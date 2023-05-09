import { getRandomInt } from "./getRandomInt.js";

export const getRandomElement = (array) => {
  const index = getRandomInt(array.length);
  return array[index];
};
