const redis = require("redis");
const bluebird = require("bluebird");

const client = redis.createClient(process.env.REDIS_DB);

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

module.exports = client;
