
exports.seed = (knex) => {
  // Deletes ALL existing entries
  return knex('account_types').del()
    .then(() => {
      // Inserts seed entries
      return knex('account_types').insert([
        {
          id: 1,
          name: 'Fixed Asset',
          balance_sheet: true,
          income_sheet: false,
        },
        {
          id: 2,
          name: 'Current Asset',
          balance_sheet: true,
          income_sheet: false,
        },
        {
          id: 3,
          name: 'Long Term Liability',
          balance_sheet: false,
          income_sheet: true,
        },
        {
          id: 4,
          name: 'Current Liability',
          balance_sheet: false,
          income_sheet: true,
        },
        {
          id: 5,
          name: 'Equity',
          balance_sheet: false,
          income_sheet: true,
        },
        {
          id: 6,
          name: 'Expense',
          balance_sheet: false,
          income_sheet: true,
        },
        {
          id: 7,
          name: 'Income',
          balance_sheet: false,
          income_sheet: true,
        },
        {
          id: 8,
          name: 'Accounts Receivable',
          balance_sheet: true,
          income_sheet: false,
        },
        {
          id: 9,
          name: 'Accounts Payable',
          balance_sheet: true,
          income_sheet: false,
        },
      ]);
    });
};
