import { DUserDTO } from "../../controllers/user"
import "express-session"

export {}
declare global {
    namespace Express {
        export interface Request {
            user: DUserDTO
        }
    }
}
