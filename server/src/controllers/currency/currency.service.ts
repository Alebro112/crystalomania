import { currencyRepository, DCurrencyDTO } from '#controllers/currency';

import { CustomLogger } from '#middlewares/logger/logger';
import ApiError from '#middlewares/exceptions/api.error';


class CurrencyService {
    async getAllCurrencies(
        logger: CustomLogger,
    ): Promise<[Array<DCurrencyDTO>, null ] | [null, ApiError]> {
        return await currencyRepository.selectAllCurrencies(logger);
    }
}

export default new CurrencyService();
