import { Router } from 'express'

import { currencyRouter, depositRouter, teamRouter } from '#router/admin'

const router = Router()

router.use('/team', teamRouter)
router.use('/currency', currencyRouter)
router.use('/deposit', depositRouter)

export default router