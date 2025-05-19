import {
    DatabaseError,
    ForeignKeyConstraintError,
    UniqueConstraintError,
} from 'sequelize';
import {
    Messages,
    SequalizeErrorHelperError,
    SeuqalizeErrorHelperResponse,
    handleControllerFunction,
    handleFKConstraintErrorFunction,
    handleFunction,
    handleUniqueConstraintErrorFunction,
} from '#helpers/sequalizeError/types';

import logger from '#config/logger';
import ApiError from '#middlewares/exceptions/api.error';

export default class SequelizeErrorHelper {
    _messages: Messages;

    constructor(messages: Messages = {}) {
        this._messages = messages;
    }

    handle: handleFunction = (err) => {
        const issues = this.handleController(err);
        if (!issues) return null

        return ApiError.BadRequest('Validation error', {
            issues: issues,
            name: 'SequelizeError',
        } as SeuqalizeErrorHelperResponse);
    };

    handleController: handleControllerFunction = (err) => {
        if (err instanceof ForeignKeyConstraintError)
            return this.handleFKConstraintError(err);
        if (err instanceof UniqueConstraintError)
            return this.handleUniqueConstraintError(err);

        if (err instanceof DatabaseError) {
            logger.error('Not expected sequalize error', {
                func: 'SequelizeErrorHelper.handleController',
                error: err,
            });
            return [
                {
                    message: 'Not expected error',
                    path: [],
                },
            ];
        }
        return null;
    };

    handleFKConstraintError: handleFKConstraintErrorFunction = (err) => {
        const index = err.index;
        try {
            if (!this._messages.foreignKeys) {
                throw Error('Missing FKC messages');
            }

            if (index && this._messages.foreignKeys[index]) {
                return [this._messages.foreignKeys[index]];
            }

            throw Error('Missing FKC messages');
        } catch (error: any) {
            logger.error('Unhandled foreign key constraint error', {
                func: 'SequelizeErrorHelper.handleFKConstraintError',
                details: {
                    index,
                    messages: this._messages.foreignKeys,
                },
                error: err,
            });
            return [
                {
                    path: [],
                    message: 'Invalid foreign key reference.',
                },
            ];
        }
    };

    handleUniqueConstraintError: handleUniqueConstraintErrorFunction = (
        err: UniqueConstraintError,
    ) => {
        const fields = err.fields;
        try {
            if (!this._messages.unique) {
                throw Error('Missing UC messages');
            }

            let errors: SequalizeErrorHelperError[] = [];

            if (fields) {
                for (const key in err.fields) {
                    if (this._messages.unique[key]) {
                        errors.push(this._messages.unique[key]);
                    } else {
                        logger.error('Unhandled unique constraint error', {
                            func: 'SequelizeErrorHelper.handleUniqueConstraintError',
                            details: {
                                key,
                                messages: this._messages.unique,
                            },
                            error: err,
                        });
                    }
                }
                return errors;
            }

            throw Error('Missing UC messages');
        } catch (error) {
            logger.error('Unhandled unique constraint error', {
                func: 'SequelizeErrorHelper.handleUniqueConstraintError',
                details: {
                    fields,
                    messages: this._messages.unique,
                },
                error: err,
            });
            return [
                {
                    path: [],
                    message: 'Invalid foreign key reference.',
                },
            ];
        }
    };
}
