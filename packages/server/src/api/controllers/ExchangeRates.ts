import { Service, Inject } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';
import { check, param, query } from 'express-validator';
import asyncMiddleware from '@/api/middleware/asyncMiddleware';
import BaseController from './BaseController';
import { ServiceError } from '@/exceptions';
import { ExchangeRatesService } from '@/services/ExchangeRates/ExchangeRatesService';
import { EchangeRateErrors } from '@/lib/ExchangeRate/types';

@Service()
export default class ExchangeRatesController extends BaseController {
  @Inject()
  private exchangeRatesService: ExchangeRatesService;

  /**
   * Constructor method.
   */
  router() {
    const router = Router();

    router.get(
      '/latest',
      [query('to_currency').exists().isString()],
      this.validationResult,
      asyncMiddleware(this.latestExchangeRate.bind(this)),
      this.handleServiceError
    );
    return router;
  }

  /**
   * Retrieve exchange rates.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  private async latestExchangeRate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { tenantId } = req;
    const exchangeRateQuery = this.matchedQueryData(req);

    try {
      const exchangeRate = await this.exchangeRatesService.latest(
        tenantId,
        exchangeRateQuery
      );
      return res.status(200).send(exchangeRate);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handle service errors.
   * @param {Error} error
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  private handleServiceError(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (error instanceof ServiceError) {
      if (EchangeRateErrors.EX_RATE_INVALID_BASE_CURRENCY === error.errorType) {
        return res.status(400).send({
          errors: [
            {
              type: EchangeRateErrors.EX_RATE_INVALID_BASE_CURRENCY,
              code: 100,
              message: 'The given base currency is invalid.',
            },
          ],
        });
      } else if (
        EchangeRateErrors.EX_RATE_SERVICE_NOT_ALLOWED === error.errorType
      ) {
        return res.status(400).send({
          errors: [
            {
              type: EchangeRateErrors.EX_RATE_SERVICE_NOT_ALLOWED,
              code: 200,
              message: 'The service is not allowed',
            },
          ],
        });
      } else if (
        EchangeRateErrors.EX_RATE_SERVICE_API_KEY_REQUIRED === error.errorType
      ) {
        return res.status(400).send({
          errors: [
            {
              type: EchangeRateErrors.EX_RATE_SERVICE_API_KEY_REQUIRED,
              code: 300,
              message: 'The API key is required',
            },
          ],
        });
      } else if (EchangeRateErrors.EX_RATE_LIMIT_EXCEEDED === error.errorType) {
        return res.status(400).send({
          errors: [
            {
              type: EchangeRateErrors.EX_RATE_LIMIT_EXCEEDED,
              code: 400,
              message: 'The API rate limit has been exceeded',
            },
          ],
        });
      }
    }
    next(error);
  }
}
