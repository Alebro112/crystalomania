import { parseZod } from '#helpers/zod';
import { ControllerFunction } from '..';
import { RequestUserSchema } from './DTO/Request/RequestUserDTO';
import { DUserDTO, RequestLoginSchema, userService } from '#controllers/user';
import ApiError from '#middlewares/exceptions/api.error';

class UserController {
    getMe: ControllerFunction = async (req, res, next) => {
        try {
            res.status(200).json(req.user);
        } catch (error) {
            next(error);
        }
    }

    createUser: ControllerFunction = async (req, res, next) => {
        try {
            const userDTO = parseZod(RequestUserSchema, req.body);

            const [user, error] = await userService.createUser(
                userDTO,
                req.logger,
            );
            if (error) {
                return next(error);
            }

            res.status(200).json(user);
        } catch (error) {
            next(error);
        }
    };

    login: ControllerFunction = async (req, res, next) => {
        try {
            const userDTO = parseZod(RequestLoginSchema, req.body);

            const [user, error] = await userService.login(userDTO, req.logger);
            if (error) {
                return next(ApiError.BadRequest('Неверный логин или пароль'));
            }

            req.login(user, (err) => {
                if (err) {
                    return next(ApiError.UnauthorizedError());
                }

                req.logger.session(`User ${user.login} logged in`, {
                    details: { user },
                });
                res.status(200).json(user);
            });
        } catch (error) {
            next(error);
        }
    };

    logout: ControllerFunction = async (req, res, next) => {
        try {
            if (!req?.user) {
                return next(ApiError.UnauthorizedError());
            }

            const user = new DUserDTO(req.user);

            req.session.destroy((err) => {
                if (err) {
                    return next(ApiError.UnauthorizedError());
                }

                req.logger.session(`User ${user.login} logged out`, {
                    details: { user: user },
                });
            });

            return res
                .clearCookie('connect.sid', { path: '/' })
                .sendStatus(200);
        } catch (error) {
            next(error);
        }
    };
}

export default new UserController();
