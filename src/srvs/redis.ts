
import Redis from "ioredis";
import config from "../config/index";

const redis = new Redis(config.redis);

export default redis;