import { Router } from 'express'

import { userController } from "#controllers/user"
import authMiddleware from '#middlewares/auth/auth.middleware'

const router = Router()

router.post('/', [
    authMiddleware
], userController.createUser)

router.post('/login', userController.login)
router.post('/logout', [
    authMiddleware
],userController.logout)

router.get('/', [
    authMiddleware
], userController.getMe)

export default router