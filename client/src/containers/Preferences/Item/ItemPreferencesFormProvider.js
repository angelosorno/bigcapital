import React, { useContext, createContext } from 'react';
import classNames from 'classnames';
import { CLASSES } from 'common/classes';

import { useSettingsItems, useAccounts, useSaveSettings } from 'hooks/query';
import PreferencesPageLoader from '../PreferencesPageLoader';

const ItemFormContext = createContext();

/**
 * Item data provider.
 */

function ItemPreferencesFormProvider({ ...props }) {
  // Fetches the accounts list.
  const { isLoading: isAccountsLoading, data: accounts } = useAccounts();

  const {
    isLoading: isItemsSettingsLoading,
    isFetching: isItemsSettingsFetching,
  } = useSettingsItems();

  // Save Organization Settings.
  const { mutateAsync: saveSettingMutate } = useSaveSettings();

  // Provider state.
  const provider = {
    accounts,
    saveSettingMutate,
  };

  const isLoading = isAccountsLoading || isItemsSettingsLoading;

  return (
    <div
      className={classNames(
        CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT,
        CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT_ACCOUNTANT,
      )}
    >
      <div className={classNames(CLASSES.CARD)}>
        {isLoading ? (
          <PreferencesPageLoader />
        ) : (
          <ItemFormContext.Provider value={provider} {...props} />
        )}
      </div>
    </div>
  );
}

const useItemPreferencesFormContext = () => useContext(ItemFormContext);

export { useItemPreferencesFormContext, ItemPreferencesFormProvider };