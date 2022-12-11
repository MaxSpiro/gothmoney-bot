import { TwitterApiReadWrite } from "twitter-api-v2";

export class TwitterService {
  constructor(private readonly twitterClient: TwitterApiReadWrite) {}

  async sendTweet(tweetMaterial: string) {
    const { data: createdTweet } = await this.twitterClient.v2.tweet(
      tweetMaterial
    );
    return createdTweet;
  }
}
