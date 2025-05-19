import {
    createUserFunction,
    hashPasswordFunction,
    loginFunction,
} from './Types';
import { DUserDTO, userRepository } from '#controllers/user';
import bcrypt from 'bcrypt';
import ApiError from '#middlewares/exceptions/api.error';

class UserService {
    createUser: createUserFunction = async (
        userDTO,
        logger,
        transaction = null,
    ) => {
        userDTO.password = this.hashPassword(userDTO.password);

        return await userRepository.insertUser(userDTO, logger, transaction);
    };

    login: loginFunction = async (userDTO, logger) => {
        try {
            const [user, error] = await userRepository.selectByLoginUnsafe(
                userDTO.login,
                logger,
            );
            if (error) {
                return [null, error];
            }

            if (!bcrypt.compareSync(userDTO.password, user.password)) {
                return [null, ApiError.BadRequest('Wrong password')];
            }

            const userSafe = new DUserDTO(user);

            return [userSafe, null];
        } catch (error) {
            logger.error('Error selecting user by login', { error: error, details: {login: userDTO.login} });
            return [null, ApiError.BadRequest()];
        }
    };

    hashPassword: hashPasswordFunction = (password) => {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(12));
    };
}

export default new UserService();
