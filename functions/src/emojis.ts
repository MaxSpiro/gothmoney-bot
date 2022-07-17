import {get} from 'node-emoji'

const heavyEmojis = [
  ':black_heart:',
  ':skull_and_crossbones:',
  ':dizzy:',
  ':dove_of_peace:',
  ':angel:',
  ':drop_of_blood:',
  ':pray:',
  ':collision:',

]
const lightEmojis = [
  ':sunny:',
  ':earth_asia:',
  ':crossed_swords:',
  ':vampire:',
  ':gun:',
  ':sparkles:',
  ':umbrella_with_rain_drops:',
  ':sparkling_heart:',
]

export function getRandomEmojis(): string {
  let emojiString = ''
  let i = 0
  while (i++ < 2) {
    if (Math.random() > 0.3) {
      const repeat = Math.ceil(Math.random() * 3)
      const index = Math.floor(Math.random() * heavyEmojis.length)
      emojiString += get(heavyEmojis[index]).repeat(repeat)
    } else {
      const repeat = Math.ceil(Math.random() * 3)
      const index = Math.floor(Math.random() * lightEmojis.length)
      emojiString += get(lightEmojis[index]).repeat(repeat)
    }
  }
  return emojiString
}

export const music: string = get(':musical_note:')
