const redis = require("redis");
const bluebird = require("bluebird");
const env = process.env.ENV || "development";
const config = require("../../config/config")[env];

const client = redis.createClient(config.redis);

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

module.exports = client;
