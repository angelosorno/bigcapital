import TenancyService from 'services/Tenancy/TenancyService'
import Container from 'typedi';

exports.up = function (knex) {
  const tenancyService = Container.get(TenancyService);
  const i18n = tenancyService.i18n(knex.userParams.tenantId);

  return knex('accounts').then(() => {
    // Inserts seed entries
    return knex('accounts').insert([
      {
        id: 1,
        name: 'Petty Cash',
        slug: 'petty-cash',
        account_type_id: 2,
        parent_account_id: null,
        code: '1000',
        description: '',
        active: 1,
        index: 1,
        predefined: 1,
      },
      {
        id: 2,
        name: 'Bank',
        slug: 'bank',
        account_type_id: 2,
        parent_account_id: null,
        code: '2000',
        description: '',
        active: 1,
        index: 1,
        predefined: 1,
      },
      {
        id: 3,
        name: 'Other Income',
        slug: 'other-income',
        account_type_id: 7,
        parent_account_id: null,
        code: '1000',
        description: '',
        active: 1,
        index: 1,
        predefined: 1,
      },
      {
        id: 4,
        name: 'Interest Income',
        slug: 'interest-income',
        account_type_id: 7,
        parent_account_id: null,
        code: '1000',
        description: '',
        active: 1,
        index: 1,
        predefined: 1,
      },
      {
        id: 5,
        name: 'Opening Balance',
        slug: 'opening-balance',
        account_type_id: 5,
        parent_account_id: null,
        code: '1000',
        description: '',
        active: 1,
        index: 1,
        predefined: 1,
      },
      {
        id: 6,
        name: 'Depreciation Expense',
        slug: 'depreciation-expense',
        account_type_id: 6,
        parent_account_id: null,
        code: '1000',
        description: '',
        active: 1,
        index: 1,
        predefined: 1,
      },
      {
        id: 7,
        name: 'Interest Expense',
        slug: 'interest-expense',
        account_type_id: 6,
        parent_account_id: null,
        code: '1000',
        description: '',
        active: 1,
        index: 1,
        predefined: 1,
      },
      {
        id: 8,
        name: 'Payroll Expenses',
        slug: 'payroll-expenses',
        account_type_id: 6,
        parent_account_id: null,
        code: '1000',
        description: '',
        active: 1,
        index: 1,
        predefined: 1,
      },
      {
        id: 9,
        name: 'Other Expenses',
        slug: 'other-expenses',
        account_type_id: 6,
        parent_account_id: null,
        code: '1000',
        description: '',
        active: 1,
        index: 1,
        predefined: 1,
      },
      {
        id: 10,
        name: 'Accounts Receivable',
        slug: 'accounts-receivable',
        account_type_id: 8,
        parent_account_id: null,
        code: '1000',
        description: '',
        active: 1,
        index: 1,
        predefined: 1,
      },
      {
        id: 11,
        name: 'Accounts Payable',
        slug: 'accounts-payable',
        account_type_id: 9,
        parent_account_id: null,
        code: '1000',
        description: '',
        active: 1,
        index: 1,
        predefined: 1,
      },
      {
        id: 12, 
        name: 'Cost of Goods Sold (COGS)',
        slug: 'cost-of-goods-sold',
        account_type_id: 12,
        predefined: 1,
        parent_account_id: null,
        index: 1,
        active: 1,
        description: 1,
      },
      {
        id: 13, 
        name: 'Inventory Asset',
        slug: 'inventory-asset',
        account_type_id: 14,
        predefined: 1,
        parent_account_id: null,
        index: 1,
        active: 1,
        description: '',
      },
      {
        id: 14,
        name: 'Sales of Product Income',
        slug: 'sales-of-product-income',
        account_type_id: 7,
        predefined: 1,
        parent_account_id: null,
        index: 1,
        active: 1,
        description: '',
      }
    ]);
  });
};

exports.down = function (knex) {
  
};