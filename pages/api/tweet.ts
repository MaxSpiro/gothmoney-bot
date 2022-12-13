import { verifySignature } from "@upstash/qstash/nextjs";
import type { NextApiRequest, NextApiResponse } from "next";
import { TwitterService, GeniusService, redis } from "../../src/services";
import { twitterClient, geniusClient } from "../../src/clients";
import { artists } from "../../src/settings/artists";
import { CACHE_INTERVAL } from "../../src/settings/config";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("tweeting!");
  const twitterService = new TwitterService(twitterClient);
  const geniusService = new GeniusService(geniusClient);

  const redisCache = {
    latestUpdate: await redis.get("latestUpdate"),
    allSongIds: await redis.get("allSongIds"),
  };
  if (!redisCache.latestUpdate || !redisCache.allSongIds) {
    throw new Error("no cache found");
  }
  const allSongIds = JSON.parse(redisCache.allSongIds);
  console.log("redis cache", redisCache);

  let tweetMaterial: string | undefined;
  while (!tweetMaterial) {
    tweetMaterial = await geniusService.generateSnippet(allSongIds);
    console.log(tweetMaterial);
  }
  const { id, text } = await twitterService.sendTweet(tweetMaterial);

  console.log("tweeted", id, text);
  res.status(200).json({ id, text });
}

export default verifySignature(handler);

export const config = {
  api: {
    bodyParser: false,
  },
};
