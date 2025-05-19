const permissionService = require("../services/permission.service");
const ApiError = require("./exceptions/api.error");


function checkPermission(requiredPermission) {
    return function (req, res, next) {
        try {
            if (!req?.user) {
                return next(ApiError.UnauthorizedError());
            }

            
            if (req.event && req.event.owner === req.user.id) {
                return next()
            }
            
            const hasPermission = permissionService.hasPermission(req.permissions, requiredPermission);

            if (!hasPermission) {
                return next(ApiError.Forbidden("You do not have the required permission."));
            }

            next();
        } catch (error) {
            req.logger.error("Not expected error", {func: "checkPermission.middleware", error: error.stack})
            next(ApiError.ServerError("An error occurred while checking permissions."));
        }
    };
}

module.exports = checkPermission;