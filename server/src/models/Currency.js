import TenantModel from '@/models/TenantModel';

export default class Currency extends TenantModel {
  /**
   * Table name
   */
  static get tableName() {
    return 'currencies';
  }
}