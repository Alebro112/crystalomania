import ApiError from "#middlewares/exceptions/api.error"
import { DatabaseError, ForeignKeyConstraintError } from "sequelize"

export interface SequalizeErrorHelperError {
    path: string[],
    message: string
}

export interface Messages {
    foreignKeys?: {
        [key: string]: SequalizeErrorHelperError
    }
    unique?: {
        [key: string]: SequalizeErrorHelperError
    }
}

export interface SeuqalizeErrorHelperResponse {
    issues: SequalizeErrorHelperError[],
    name: 'SequelizeError'
}

export type handleFunction = (
    err: any
) => ApiError | null

export type handleControllerFunction = (
    err: DatabaseError
) => SequalizeErrorHelperError[]|null

export type handleFKConstraintErrorFunction = (
    err: ForeignKeyConstraintError
) => SequalizeErrorHelperError[]

export type handleUniqueConstraintErrorFunction = (
    err: UniqueConstraintError
) => SequalizeErrorHelperError[]
