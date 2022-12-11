import { verifySignature } from "@upstash/qstash/nextjs";
import type { NextApiRequest, NextApiResponse } from "next";
import { TwitterService, GeniusService, redis } from "../../src/services";
import { twitterClient, geniusClient } from "../../src/clients";
import { artists } from "../../src/settings/artists";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const twitterService = new TwitterService(twitterClient);
  const geniusService = new GeniusService(geniusClient);

  const redisCache = {
    latestUpdate: await redis.get("latestUpdate"),
    allSongIds: await redis.get("allSongIds"),
  };
  let allSongIds: number[];
  if (
    !redisCache.latestUpdate ||
    !redisCache.allSongIds ||
    (redisCache.latestUpdate &&
      Date.now() - parseInt(redisCache.latestUpdate, 10) > 60 * 60 * 24 * 1000)
  ) {
    allSongIds = await geniusService.getAllSongIds(artists);
    redis.set("allSongIds", JSON.stringify(allSongIds));
    redis.set("latestUpdate", Date.now().toString());
  } else {
    allSongIds = JSON.parse(redisCache.allSongIds);
  }

  let tweetMaterial: string | undefined;
  while (!tweetMaterial) {
    tweetMaterial = await geniusService.generateSnippet(allSongIds);
  }
  // const { id, text } = await twitterService.sendTweet(tweetMaterial);

  // res.status(200).json({ id, text });
  console.log(tweetMaterial);
  res.status(200).send(tweetMaterial);
}

// export default verifySignature(handler);
export default handler;

export const config = {
  api: {
    bodyParser: false,
  },
};
