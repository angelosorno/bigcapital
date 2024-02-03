import { Inject, Service } from 'typedi';
import { PlaidClientWrapper } from '@/lib/Plaid';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import events from '@/subscribers/events';
import {
  IPlaidItemCreatedEventPayload,
  PlaidItemDTO,
} from '@/interfaces/Plaid';

@Service()
export class PlaidItemService {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private eventPublisher: EventPublisher;

  /**
   * Exchanges the public token to get access token and item id and then creates
   * a new Plaid item.
   * @param {number} tenantId
   * @param {PlaidItemDTO} itemDTO
   * @returns {Promise<void>}
   */
  public async item(tenantId: number, itemDTO: PlaidItemDTO) {
    const { PlaidItem } = this.tenancy.models(tenantId);
    const { publicToken, institutionId } = itemDTO;

    const plaidInstance = new PlaidClientWrapper();

    // exchange the public token for a private access token and store with the item.
    const response = await plaidInstance.itemPublicTokenExchange({
      public_token: publicToken,
    });
    const plaidAccessToken = response.data.access_token;
    const plaidItemId = response.data.item_id;

    const plaidItem = await PlaidItem.query().insertAndFetch({
      tenantId,
      plaidAccessToken,
      plaidItemId,
      plaidInstitutionId: institutionId,
    });
    // Triggers `onPlaidItemCreated` event.
    await this.eventPublisher.emitAsync(events.plaid.onItemCreated, {
      tenantId,
      plaidAccessToken,
      plaidItemId,
      plaidInstitutionId: institutionId,
    } as IPlaidItemCreatedEventPayload);
  }
}
