import { Router } from 'express'

import { userRouter } from "#router/home"

const router = Router()

router.use('/user', userRouter)

export default router