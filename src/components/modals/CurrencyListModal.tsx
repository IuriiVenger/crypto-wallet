import { FC } from 'react';

import MainModal, { SavePreviousTelegramNativeButtonProps } from './MainModal';

import { API } from '@/api/types';
import CurrenciesList from '@/components/CurrencyList';

import { WithOptionalAmount } from '@/types';

type CurrencyListModalProps = {
  isOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  chains?: API.List.Chains[];
  title?: string;
  onSelect: (currency: API.List.Crypto | API.List.Fiat | API.List.Chains) => void;
  currencies:
    | WithOptionalAmount<API.List.Crypto>[]
    | WithOptionalAmount<API.List.Fiat>[]
    | WithOptionalAmount<API.List.Chains>[];
};

const CurrencyListModal: FC<CurrencyListModalProps & SavePreviousTelegramNativeButtonProps> = (props) => {
  const { isOpen, setIsModalOpen, onSelect, currencies, chains, title = 'Select a currency', ...otherProps } = props;

  const handleCurrencyClick = (currency: API.List.Crypto | API.List.Fiat | API.List.Chains) => {
    onSelect(currency);
    setIsModalOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <MainModal
      confirmButtonHidden
      isOpen={isOpen}
      onClose={closeModal}
      {...otherProps}
      // restoreInitialTelegramButtonsOnClose={restoreInitialTelegramButtonsOnClose}
    >
      <div>
        <h2 className="mb-4 text-3xl font-medium">{title}</h2>
        <CurrenciesList currencies={currencies} chains={chains} handleCurrencyClick={handleCurrencyClick} />
      </div>
    </MainModal>
  );
};

export default CurrencyListModal;
