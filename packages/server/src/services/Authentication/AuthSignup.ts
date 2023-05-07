import { isEmpty, omit } from 'lodash';
import moment from 'moment';
import { ServiceError } from '@/exceptions';
import {
  IAuthSignedUpEventPayload,
  IAuthSigningUpEventPayload,
  IRegisterDTO,
  ISystemUser,
} from '@/interfaces';
import { ERRORS } from './_constants';
import { Inject } from 'typedi';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import TenantsManagerService from '../Tenancy/TenantsManager';
import events from '@/subscribers/events';
import { hashPassword } from '@/utils';
import config from '@/config';

export class AuthSignupService {
  @Inject()
  private eventPublisher: EventPublisher;

  @Inject('repositories')
  private sysRepositories: any;

  @Inject()
  private tenantsManager: TenantsManagerService;

  /**
   * Registers a new tenant with user from user input.
   * @throws {ServiceErrors}
   * @param {IRegisterDTO} signupDTO
   * @returns {Promise<ISystemUser>}
   */
  public async signUp(signupDTO: IRegisterDTO): Promise<ISystemUser> {
    const { systemUserRepository } = this.sysRepositories;

    // Validates the signup disable restrictions.
    await this.validateSignupRestrictions(signupDTO.email);

    // Validates the given email uniqiness.
    await this.validateEmailUniqiness(signupDTO.email);

    const hashedPassword = await hashPassword(signupDTO.password);

    // Triggers signin up event.
    await this.eventPublisher.emitAsync(events.auth.signingUp, {
      signupDTO,
    } as IAuthSigningUpEventPayload);

    const tenant = await this.tenantsManager.createTenant();
    const registeredUser = await systemUserRepository.create({
      ...omit(signupDTO, 'country'),
      active: true,
      password: hashedPassword,
      tenantId: tenant.id,
      inviteAcceptedAt: moment().format('YYYY-MM-DD'),
    });
    // Triggers signed up event.
    await this.eventPublisher.emitAsync(events.auth.signUp, {
      signupDTO,
      tenant,
      user: registeredUser,
    } as IAuthSignedUpEventPayload);

    return registeredUser;
  }

  /**
   * Validates email uniqiness on the storage.
   * @throws {ServiceErrors}
   * @param  {string} email - Email address
   */
  private async validateEmailUniqiness(email: string) {
    const { systemUserRepository } = this.sysRepositories;
    const isEmailExists = await systemUserRepository.findOneByEmail(email);

    if (isEmailExists) {
      throw new ServiceError(ERRORS.EMAIL_EXISTS);
    }
  }

  /**
   * Validate sign-up disable restrictions.
   * @param {string} email
   */
  private async validateSignupRestrictions(email: string) {
    // Can't continue if the signup is not disabled.
    if (!config.signupRestrictions.disabled) return;

    // Validate the allowed domains.
    if (!isEmpty(config.signupRestrictions.allowedDomains)) {
      const emailDomain = email.split('@').pop();
      const isAllowed = config.signupRestrictions.allowedDomains.some(
        (domain) => emailDomain === domain
      );
      if (!isAllowed) {
        throw new ServiceError(ERRORS.SIGNUP_NOT_ALLOWED_EMAIL_DOMAIN);
      }
    }
    // Validate the allowed email addresses.
    if (!isEmpty(config.signupRestrictions.allowedEmails)) {
      const isAllowed =
        config.signupRestrictions.allowedEmails.indexOf(email) !== -1;

      if (!isAllowed) {
        throw new ServiceError(ERRORS.SIGNUP_NOT_ALLOWED_EMAIL_ADDRESS);
      }
    }
    // Throw error if the signup is disabled with no exceptions.
    if (
      isEmpty(config.signupRestrictions.allowedDomains) &&
      isEmpty(config.signupRestrictions.allowedEmails)
    ) {
      throw new ServiceError(ERRORS.SIGNUP_RESTRICTED);
    }
  }
}