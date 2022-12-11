import { get } from "node-emoji";
import { heavyEmojis, lightEmojis } from "../settings/emoji";

export const getRandomEmojis = () => {
  let emojiString = "";
  let i = 0;
  while (i++ < 2) {
    if (Math.random() > 0.3) {
      const repeat = Math.ceil(Math.random() * 3);
      const index = Math.floor(Math.random() * heavyEmojis.length);
      emojiString += get(heavyEmojis[index]).repeat(repeat);
    } else {
      const repeat = Math.ceil(Math.random() * 3);
      const index = Math.floor(Math.random() * lightEmojis.length);
      emojiString += get(lightEmojis[index]).repeat(repeat);
    }
  }
  return emojiString;
};
