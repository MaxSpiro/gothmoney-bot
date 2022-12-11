import TwitterApi from "twitter-api-v2";
import { config } from "../settings/config";

const twitterClient = new TwitterApi({
  appKey: config.TWITTER_CONSUMER_KEY,
  appSecret: config.TWITTER_CONSUMER_SECRET,
  accessToken: config.TWITTER_ACCESS_TOKEN,
  accessSecret: config.TWITTER_ACCESS_TOKEN_SECRET,
}).readWrite;

export { twitterClient };
