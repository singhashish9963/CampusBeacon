// utils/avatarGenerator.js
const generateRandomAvatarURL = (seed) => {
  // Use a consistent hash for the seed to generate consistent avatars
  const hash = hashCode(seed);
  const avatarId = Math.abs(hash) % 70; // Use a modulus to limit the number of avatars

  // URL to the DiceBear avatars API
  return `https://avatars.dicebear.com/api/open-peeps/${avatarId}.svg`;
};

// Simple hash function
const hashCode = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
  }
  return hash;
};

export { generateRandomAvatarURL };
