import { Router } from 'express'

import { teamController } from '#controllers/team'
import authMiddleware from '#middlewares/auth/auth.middleware'

const router = Router()

router.get('/', [], teamController.getAllTeams)

router.post('/', [
    authMiddleware
], teamController.createTeam)

export default router