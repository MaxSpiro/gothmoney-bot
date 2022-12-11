import Redis from "ioredis";
import { config } from "../settings/config";

export const redis = new Redis(config.REDIS_URL);
