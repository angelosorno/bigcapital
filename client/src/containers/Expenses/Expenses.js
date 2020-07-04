import React, { useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useQuery } from 'react-query';

import ExpenseForm from './ExpenseForm';
import DashboardInsider from 'components/Dashboard/DashboardInsider';

import withAccountsActions from 'containers/Accounts/withAccountsActions';
import withExpensesActions from 'containers/Expenses/withExpensesActions';
import withCurrenciesActions from 'containers/Currencies/withCurrenciesActions';

import { compose } from 'utils';

function Expenses({
  // #withwithAccountsActions
  requestFetchAccounts,
  requestFetchAccountTypes,

  // #withExpensesActions
  requestFetchExpense,

  // #wihtCurrenciesActions
  requestFetchCurrencies,
}) {
  const history = useHistory();
  const { id } = useParams();

  const fetchAccounts = useQuery('accounts-list', (key) =>
    requestFetchAccounts(),
  );

  const fetchExpense = useQuery(
    ['expense', id],
    (key, _id) => requestFetchExpense(_id),
    { enabled: !!id },
  );

  const fetchCurrencies = useQuery('currencies', () =>
    requestFetchCurrencies(),
  );
  const handleFormSubmit = useCallback(
    (payload) => {
      payload.redirect && history.push('/expenses-list');
    },
    [history],
  );

  const handleCancel = useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    <DashboardInsider
      loading={
        fetchExpense.isFetching ||
        fetchAccounts.isFetching ||
        fetchCurrencies.isFetching
      }
      name={'expense-form'}
    >
      <ExpenseForm
        onFormSubmit={handleFormSubmit}
        expenseId={id}
        onCancelForm={handleCancel}
      />
    </DashboardInsider>
  );
}

export default compose(
  withAccountsActions,
  withCurrenciesActions,
  withExpensesActions,
)(Expenses);