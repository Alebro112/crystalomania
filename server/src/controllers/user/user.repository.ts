import ApiError from '#middlewares/exceptions/api.error';
import { insertUserFunction, selectByLoginFunction, selectByLoginUnsafeFunction } from './Types';
import { User, DUserDTO, DUserUnsafeDTO } from '#controllers/user';
import SequalizeErrorHelper from '#helpers/sequalizeError';

class UserRepository {
    private sequalizeErrorHelper: SequalizeErrorHelper;

    constructor() {
        this.sequalizeErrorHelper = new SequalizeErrorHelper({
            unique: {
                login: {
                    path: ['login'],
                    message: 'Login already exists',
                },
            },
        });
    }

    selectByLogin: selectByLoginFunction = async (
        login,
        logger,
        transaction = null,
    ) => {
        try {
            const user = await User.findOne({
                where: { login },
                transaction,
            });

            return user
                ? [new DUserDTO(user), null]
                : [null, ApiError.BadRequest('User not found')];
        } catch (error) {
            logger.error('Error selecting user by login', {
                error: error,
                details: { login },
            });
            return [null, ApiError.BadRequest()];
        }
    };

    selectByLoginUnsafe: selectByLoginUnsafeFunction = async (
        login,
        logger,
        transaction = null,
    ) => {
        try {
            const user = await User.findOne({
                where: { login },
                transaction,
            });

            return user
                ? [new DUserUnsafeDTO(user), null]
                : [null, ApiError.BadRequest('User not found')];
        } catch (error) {
            logger.error('Error selecting user by login', {
                error: error,
                details: { login },
            });
            return [null, ApiError.BadRequest()];
        }
    };

    insertUser: insertUserFunction = async (
        userDTO,
        logger,
        transaction = null,
    ) => {
        try {
            const user = new DUserDTO(
                await User.create(userDTO, { transaction }),
            );

            logger.info('User created', {
                func: 'UserRepository.insertUser',
                details: {
                    id: user.id,
                    login: user.login,
                    name: user.name,
                    admin: user.admin,
                },
            });

            return [user, null];
        } catch (error: any) {
            const sequalizeError = this.sequalizeErrorHelper.handle(error);
            if (sequalizeError) return [null, sequalizeError];

            logger.error('Error inserting user', { error: error });
            return [null, ApiError.BadRequest()];
        }
    };
}

export default new UserRepository();
