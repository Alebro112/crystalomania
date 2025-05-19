const UserDto = require('../dtos/user.dto')
const ApiError = require('../middlewares/exceptions/api.error')
const permissionService = require('../services/permission.service')
const userService = require('../services/user.service')

module.exports = async function (req,res,next){
    try {
        if (req?.session?.cookie && req?.session?.passport?.user) {
            return next(ApiError.Forbidden())
        }


        req.user = null;
        next()
    } catch (error) {
        req.logger.error("Not expected error", {func: "notAuth.middleware", error: error.stack})
        return next(ApiError.UnauthorizedError())
    }
}