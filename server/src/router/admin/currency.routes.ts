import { Router } from 'express'

import { currencyController } from '#controllers/currency'

const router = Router()

router.get('/', [], currencyController.getAllCurrencies)

// router.post('/recalculate', [], currencyController.recalculateCurrencies)

export default router