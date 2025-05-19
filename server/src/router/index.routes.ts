import { Router } from 'express'

import adminRouter from '#router/admin/index.routes'
import homeRouter from '#router/home/index.routes'
import authMiddleware from '#middlewares/auth/auth.middleware'

const router = Router()

router.use('/', homeRouter)
router.use('/admin', adminRouter)

export default router