import { Router } from 'express'

import { depositController } from '#controllers/deposit'
import authMiddleware from '#middlewares/auth/auth.middleware'

const router = Router()

router.get('/', depositController.getAll)

router.post('/', [
    authMiddleware
],  depositController.deposit)

router.post('/rollback/:id', [
    authMiddleware
], depositController.rollback)

router.post('/stress', [
    authMiddleware
], depositController.stressTest)

export default router