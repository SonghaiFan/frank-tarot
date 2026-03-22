import React, { useEffect, useRef } from "react";
import p5 from "p5";
import { GameState } from "../types";

interface Star {
  radius: number; // Distance from center
  angle: number; // Current angle in radians
  size: number;
  brightness: number;
  twinkleSpeed: number;
  twinklePhase: number;
  speed: number; // Angular velocity
}

interface CosmicParticlesProps {
  gameState: GameState;
}

const CosmicParticles: React.FC<CosmicParticlesProps> = ({ gameState }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5InstanceRef = useRef<p5 | null>(null);
  const targetSpeedRef = useRef(1.0);
  const currentSpeedRef = useRef(1.0);
  const targetHueRef = useRef(224);
  const currentHueRef = useRef(224);

  // Update target speed based on game state
  useEffect(() => {
    switch (gameState) {
      case GameState.INTRO:
      case GameState.INPUT:
        targetSpeedRef.current = 5.0; // Normal drift
        targetHueRef.current = 222;
        break;
      case GameState.PICKING:
        targetSpeedRef.current = 1.0; // Time slows down
        targetHueRef.current = 282;
        break;
      case GameState.REVEAL:
        targetSpeedRef.current = 5.0; // Moderate drift
        targetHueRef.current = 196;
        break;
      case GameState.READING:
        targetSpeedRef.current = 1.0; // Deep stillness
        targetHueRef.current = 34;
        break;
      default:
        targetSpeedRef.current = 5.0; // Fallback
        targetHueRef.current = 222;
    }
  }, [gameState]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Define the sketch in instance mode
    const sketch = (p: p5) => {
      let stars: Star[] = [];
      const STAR_COUNT = 800;
      const BASE_ANGULAR_SPEED = 0.0003;
      let maxRadius = 0;

      const initStars = () => {
        stars = [];
        maxRadius = p.dist(0, 0, p.width / 2, p.height / 2) + 50;
        
        for (let i = 0; i < STAR_COUNT; i++) {
          const r = p.sqrt(p.random()) * maxRadius;
          const sizeBase = p.random();
          const size = p.max(0.5, sizeBase * 2);
          
          stars.push({
            radius: r,
            angle: p.random(p.TWO_PI),
            size: size,
            brightness: p.random(),
            twinkleSpeed: p.random(0.005, 0.035),
            twinklePhase: p.random(p.TWO_PI),
            speed: BASE_ANGULAR_SPEED * (0.8 + p.random() * 0.4),
          });
        }
      };

      p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.frameRate(60);
        p.noStroke();
        initStars();
      };

      p.draw = () => {
        // Create a trailing effect by drawing a semi-transparent background
        // The opacity allows previous frames to fade out slowly
        p.background(0, 140); // Higher opacity clears more each frame for a shorter trail

        // Smoothly interpolate current speed
        currentSpeedRef.current = p.lerp(
          currentSpeedRef.current,
          targetSpeedRef.current,
          0.02
        );
        currentHueRef.current = p.lerp(
          currentHueRef.current,
          targetHueRef.current,
          0.02
        );

        // Center of the screen
        const cx = p.width / 2;
        const cy = p.height / 2;
        const ctx = p.drawingContext as CanvasRenderingContext2D;

        // Layered glow adds depth without replacing the existing starfield language.
        const t = p.millis() * 0.001;
        const baseRadius = p.max(p.width, p.height) * 0.44;
        const pulse = 1 + 0.09 * p.sin(t * 0.9);

        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        const coreGlow = ctx.createRadialGradient(
          cx,
          cy,
          0,
          cx,
          cy,
          baseRadius * pulse
        );
        coreGlow.addColorStop(0, `hsla(${currentHueRef.current}, 85%, 68%, 0.19)`);
        coreGlow.addColorStop(
          0.45,
          `hsla(${currentHueRef.current + 26}, 72%, 56%, 0.08)`
        );
        coreGlow.addColorStop(1, "hsla(0, 0%, 0%, 0)");
        ctx.fillStyle = coreGlow;
        ctx.fillRect(0, 0, p.width, p.height);

        ctx.globalCompositeOperation = "lighter";
        for (let i = 0; i < 3; i++) {
          const glowAngle = t * (0.14 + i * 0.05) + i * 2.1;
          const orbitRadius = baseRadius * (0.34 + i * 0.12 + 0.04 * p.sin(t + i));
          const gx = cx + p.cos(glowAngle) * orbitRadius;
          const gy = cy + p.sin(glowAngle) * orbitRadius;
          const gr = baseRadius * (0.19 - i * 0.03) * (1 + 0.16 * p.sin(t * 1.6 + i));
          const glowBlob = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);

          glowBlob.addColorStop(
            0,
            `hsla(${currentHueRef.current + i * 20 + 12}, 90%, 70%, ${0.1 - i * 0.02})`
          );
          glowBlob.addColorStop(1, "hsla(0, 0%, 0%, 0)");
          ctx.fillStyle = glowBlob;
          ctx.beginPath();
          ctx.arc(gx, gy, gr, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.globalCompositeOperation = "source-over";
        ctx.restore();

        p.translate(cx, cy);

        // Iterate through stars (backwards loop for safe removal if we needed it, though we don't here)
        for (let i = 0; i < stars.length; i++) {
          const s = stars[i];

          // 1. Update Twinkle
          s.twinklePhase += s.twinkleSpeed;
          const twinkleVal = p.sin(s.twinklePhase);
          const opacity = p.map(twinkleVal, -1, 1, 0.2, 1) * s.brightness;

          // 2. Update Rotation
          s.angle += s.speed * currentSpeedRef.current;

          // 3. Position
          const x = p.cos(s.angle) * s.radius;
          const y = p.sin(s.angle) * s.radius;

          // 4. Draw
          // Check bounds roughly before drawing to save some perf (though GPU is fast)
          // Since we translated, coordinates are relative to center
          if (x > -cx - 10 && x < cx + 10 && y > -cy - 10 && y < cy + 10) {
            const alpha = p.constrain(opacity, 0, 1);
            if (!Number.isFinite(alpha)) continue;

            // Apply per-star alpha on the 2D context to avoid p5 fill arg parsing edge cases.
            ctx.globalAlpha = alpha;
            p.fill(255);
            p.circle(x, y, s.size);

            // A soft secondary pass gives larger stars an atmospheric halo.
            if (s.size > 1.25) {
              ctx.globalAlpha = alpha * 0.35;
              p.circle(x, y, s.size * 3.2);
            }
          }
        }

        // Restore default alpha for any subsequent p5 drawing.
        ctx.globalAlpha = 1;
      };

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        initStars(); // Re-distribute stars to cover new area
      };
    };

    // Create the p5 instance
    p5InstanceRef.current = new p5(sketch, containerRef.current);

    // Cleanup on unmount
    return () => {
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove();
        p5InstanceRef.current = null;
      }
    };
  }, []); // Empty dependency array ensures this runs once on mount

  return <div ref={containerRef} className="absolute inset-0 w-full h-full" />;
};

export default CosmicParticles;
