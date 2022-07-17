import TwitterApi from 'twitter-api-v2'
import {TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_TOKEN_SECRET,
  TWITTER_CONSUMER_SECRET, TWITTER_CONSUMER_KEY} from './keys.json'

const twitterClient = new TwitterApi({
  appKey: TWITTER_CONSUMER_KEY,
  appSecret: TWITTER_CONSUMER_SECRET,
  accessToken: TWITTER_ACCESS_TOKEN,
  accessSecret: TWITTER_ACCESS_TOKEN_SECRET,
})

const rwClient = twitterClient.readWrite

export {rwClient}
