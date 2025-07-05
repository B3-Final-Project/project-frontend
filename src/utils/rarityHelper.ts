// we use strings instead of RarityEnum because we receive the formatted rarity from the ProfileCardBuilder
export const getRarityGradient = (rarity?: string): string => {
  switch (rarity) {
    case "Common":
      return "linear-gradient(to bottom right, #FF6B6B, #ED2272, #6A5ACD)";
    case "Uncommon":
      return "linear-gradient(to bottom right, #00FFCC, #33CC99, #006633)";
    case "Rare":
      return "linear-gradient(to bottom right, #00CCFF, #0066FF, #3300FF)";
    case "Epic":
      return "linear-gradient(to bottom right, #CC33FF, #9900FF, #6600CC)";
    case "Legendary":
      return "linear-gradient(to bottom right, #FFD700, #FFA500, #FF0000)";
    default:
      return "linear-gradient(to bottom right, #FF6B6B, #ED2272, #6A5ACD)";
  }
};
