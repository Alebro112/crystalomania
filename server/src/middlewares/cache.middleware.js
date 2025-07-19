const ApiError = require("./exceptions/api.error");

const redis = require("#config/redis.js")

const dateTimeHelper = require("#helpers/datetimeHelper.js")

function cacheMiddleware(keyTemplate = null, cacheTime = null) {
    return async function (req, res, next) {
        try {
            let cacheKey = keyTemplate;

            if (!cacheKey) {
                cacheKey = `${req.method}:${req.originalUrl}`;
            } else {
                cacheKey = cacheKey.replace('%eventId', req.event?.id ?? '');

                for (const [param, value] of Object.entries(req.params)) {
                    cacheKey = cacheKey.replace(`%${param}`, value);
                }

                for (const [query, value] of Object.entries(req.query)) {
                    cacheKey = cacheKey.replace(`$${query}`, value);
                }

                cacheKey = `${req.method}:${cacheKey}`;
            }

            const cachedData = await redis.get(cacheKey);
            if (cachedData) {
                return res.send(JSON.parse(cachedData));
            }

            const originalSend = res.send.bind(res);
            res.send = function (data) {
                try {
                    redis.set(cacheKey, data, "EX", cacheTime)
                } catch (error) {
                    req.logger.error("Error setting cache", { error: error.stack });
                }
                return originalSend(data);
            };

            next();
        } catch (error) {
            req.logger.error("Unexpected error in cacheMiddleware", { error: error.stack });
            next();
        }
    };
}

module.exports = cacheMiddleware;