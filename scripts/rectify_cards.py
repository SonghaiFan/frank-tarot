from __future__ import annotations

import argparse
from pathlib import Path
from typing import Iterable

import cv2
import numpy as np


def order_points(pts: np.ndarray) -> np.ndarray:
    rect = np.zeros((4, 2), dtype="float32")

    s = pts.sum(axis=1)
    rect[0] = pts[np.argmin(s)]
    rect[2] = pts[np.argmax(s)]

    diff = np.diff(pts, axis=1)
    rect[1] = pts[np.argmin(diff)]
    rect[3] = pts[np.argmax(diff)]
    return rect


def find_quad_in_contours(contours: Iterable[np.ndarray], min_area: float) -> np.ndarray | None:
    found_quads = []
    candidates = []

    for contour in sorted(contours, key=cv2.contourArea, reverse=True):
        area = cv2.contourArea(contour)
        if area < min_area:
            continue

        perimeter = cv2.arcLength(contour, True)
        is_quad = False
        for ratio in (0.01, 0.015, 0.02, 0.03, 0.04, 0.05):
            approx = cv2.approxPolyDP(contour, ratio * perimeter, True)
            if len(approx) == 4 and cv2.isContourConvex(approx):
                pts = approx.reshape(4, 2).astype("float32")
                found_quads.append(order_points(pts))
                is_quad = True
                break
        
        if not is_quad:
            candidates.append(contour)
    
    # Heuristic: If we found multiple large quads (e.g. outer frame with text vs inner frame),
    # pick the *smallest* one that is still > min_area. This avoids the "white strip".
    if found_quads:
        # Sort by area (approximation using cross product or similar logic isn't needed here,
        # we can just assume list order because contours were sorted by area).
        # Actually, sorted(contours) was descending. So found_quads[0] is largest.
        # We want the *last* one in the list (smallest valid quad found so far above min_area).
        # BUT, the smallest one might be an inner box in the art.
        # Let's filter: We want the one that is closest to the *expected* card aspect ratio (0.6).
        # Or just pick the largest one that doesn't have an insane aspect ratio.
        #
        # A safer bet for "white strip removal":
        # If found_quads[1] is > 85% area of found_quads[0], it's likely the inner frame.
        if len(found_quads) >= 2:
            # Simple area check
            # We don't have area calculated for these ordered points, let's re-calc quickly
            # contourArea works on points too.
            area0 = cv2.contourArea(found_quads[0])
            area1 = cv2.contourArea(found_quads[1])
            
            # If the second largest is almost as big as the first (e.g. within 15% diff),
            # it's very likely the inner border without text/margin.
            if area1 > 0.85 * area0:
                return found_quads[1]
        
        return found_quads[0]

    # Fallback to minAreaRect of the largest contour if no clean 4-point contour is found.
    if candidates:
        contour = candidates[0]
        rect = cv2.minAreaRect(contour)
        box = cv2.boxPoints(rect)
        if cv2.contourArea(box.astype(np.float32)) >= min_area:
            return order_points(box.astype("float32"))
    return None


def find_card_quad(image: np.ndarray) -> np.ndarray | None:
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    h, w = gray.shape
    min_area = (h * w) * 0.10

    # Pre-process images
    blur = cv2.GaussianBlur(gray, (5, 5), 0)

    # 1. Binary Threshold (High Contrast / Black & White - Strong approach)
    _, binary = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

    # 2. Erosion on Binary (Disconnect text from frame)
    kernel_sm = np.ones((3, 3), np.uint8)
    eroded = cv2.erode(binary, kernel_sm, iterations=1)

    # 3. CLAHE (Adaptive Contrast Enhancement)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    enhanced = clahe.apply(blur)

    # Strategies: (source_image, lower_thresh, upper_thresh, morph_iterations)
    strategies = [
        # 1. Standard Strict
        (blur, 40, 140, 0),

        # 2. Binary Threshold (Strong Black/White)
        (binary, 40, 140, 0),

        # 3. Eroded Binary (Crucial for disconnecting text!)
        (eroded, 40, 140, 0),

        # 4. Enhanced Contrast (CLAHE)
        (enhanced, 50, 150, 0),

        # 5. Looser Canny (Catch faint edges)
        (blur, 10, 200, 0),

        # 6. Fallbacks with Morphology (Connects broken lines)
        (blur, 40, 140, 2),
    ]

    for src_img, lower, upper, morph_iters in strategies:
        edges = cv2.Canny(src_img, lower, upper)
        
        if morph_iters > 0:
            kernel = np.ones((3, 3), np.uint8)
            edges = cv2.morphologyEx(edges, cv2.MORPH_CLOSE, kernel, iterations=morph_iters)

        # Use RETR_LIST to find all contours, including nested ones
        contours, _ = cv2.findContours(edges, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
        if not contours:
            continue

        quad = find_quad_in_contours(contours, min_area)
        if quad is not None:
            return quad

    return None


def rectify_image(image: np.ndarray, width: int, height: int) -> np.ndarray | None:
    quad = find_card_quad(image)
    if quad is None:
        return None

    dst = np.array(
        [
            [0, 0],
            [width, 0],
            [width, height],
            [0, height],
        ],
        dtype="float32",
    )

    matrix = cv2.getPerspectiveTransform(quad, dst)
    warped = cv2.warpPerspective(image, matrix, (width, height))
    return warped


def iter_images(input_dir: Path) -> Iterable[Path]:
    exts = {".jpg", ".jpeg", ".png", ".webp"}
    for path in sorted(input_dir.iterdir()):
        if path.is_file() and path.suffix.lower() in exts:
            yield path


def main() -> int:
    parser = argparse.ArgumentParser(description="Batch rectify tarot card images.")
    parser.add_argument(
        "--input-dir",
        type=Path,
        default=Path("public/images/cards"),
        help="Directory containing source card images.",
    )
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=Path("public/images/cards_fixed"),
        help="Directory to write corrected images.",
    )
    parser.add_argument("--width", type=int, default=300)
    parser.add_argument("--height", type=int, default=500)
    args = parser.parse_args()

    input_dir: Path = args.input_dir
    output_dir: Path = args.output_dir

    if not input_dir.exists() or not input_dir.is_dir():
        print(f"Input directory not found: {input_dir}")
        return 1

    output_dir.mkdir(parents=True, exist_ok=True)

    total = 0
    success = 0
    failed: list[str] = []

    for image_path in iter_images(input_dir):
        total += 1
        image = cv2.imread(str(image_path))
        if image is None:
            failed.append(f"{image_path.name} (read failed)")
            continue

        warped = rectify_image(image, args.width, args.height)
        if warped is None:
            failed.append(f"{image_path.name} (contour not found)")
            continue

        out_path = output_dir / image_path.name
        cv2.imwrite(str(out_path), warped)
        success += 1

    print(f"Processed: {total}")
    print(f"Success:   {success}")
    print(f"Failed:    {len(failed)}")
    if failed:
        print("Failures:")
        for item in failed:
            print(f"  - {item}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
