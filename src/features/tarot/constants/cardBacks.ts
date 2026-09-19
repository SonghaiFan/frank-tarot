export const CARD_BACKS = [
  {
    id: "celestial-compass",
    image: "images/card-backs/celestial-compass.svg",
    nameKey: "deck.cardBacks.celestialCompass.name",
    descriptionKey: "deck.cardBacks.celestialCompass.description",
  },
  {
    id: "eclipse-nocturne",
    image: "images/card-backs/eclipse-nocturne.svg",
    nameKey: "deck.cardBacks.eclipseNocturne.name",
    descriptionKey: "deck.cardBacks.eclipseNocturne.description",
  },
  {
    id: "thorn-bloom",
    image: "images/card-backs/thorn-bloom.svg",
    nameKey: "deck.cardBacks.thornBloom.name",
    descriptionKey: "deck.cardBacks.thornBloom.description",
  },
  {
    id: "sacred-geometry",
    image: "images/card-backs/sacred-geometry.svg",
    nameKey: "deck.cardBacks.sacredGeometry.name",
    descriptionKey: "deck.cardBacks.sacredGeometry.description",
  },
] as const;

export type CardBackId = (typeof CARD_BACKS)[number]["id"];

export const DEFAULT_CARD_BACK_ID: CardBackId = "celestial-compass";

export const getCardBack = (id: CardBackId) =>
  CARD_BACKS.find((cardBack) => cardBack.id === id) ?? CARD_BACKS[0];

export const getCardBackImageUrl = (id: CardBackId) =>
  `${import.meta.env.BASE_URL}${getCardBack(id).image}`;
