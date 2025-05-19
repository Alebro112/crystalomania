import { NextFunction, Request, Response } from "express"
import { currencyService } from "#controllers/currency"

class CurrencyController {
    async getAllCurrencies(req: Request, res: Response, next: NextFunction) {
        try {
            const [currencies, error] = await currencyService.getAllCurrencies(req.logger)
            if (error) {
                return next(error)
            }

            res.status(200).json(currencies)
        } catch (error) {
            next(error)
        }
    }

    async recalculateCurrencies(req: Request, res: Response, next: NextFunction) {
        try {
        
            
        } catch (error) {
            next(error)
        }
    }
}

export default new CurrencyController()