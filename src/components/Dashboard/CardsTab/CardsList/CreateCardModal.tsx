import { Button, Select, SelectItem } from '@nextui-org/react';
import { initMainButton, useBackButton, useMainButton } from '@telegram-apps/sdk-react';
import cn from 'classnames';
import { FC, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import ExternalExhangeInput from '../../ExternalExchangeInput';

import BinInfo from './BinInfo';

import { CardsListProps } from '.';

import { API } from '@/api/types';
import SelectCurrency from '@/components/Currency/SelectCurrency';
import ConfirmModal from '@/components/modals/ConfirmModal';
import CurrencyListModal from '@/components/modals/CurrencyListModal';
import CustomInput from '@/components/ui/CustomInput';
import CustomModal from '@/components/ui/CustomModal';
import { isCrypto, isFiat } from '@/utils/financial';

type CreateCardModalProps = CardsListProps & {
  setIsModalOpen: (isOpen: boolean) => void;
  isOpen: boolean;
  onCardCreate?: (card_id: string) => void;
};

const CreateCardModal: FC<CreateCardModalProps> = (props) => {
  const {
    allowedCryptoToFiatList,
    bins,
    createCard,
    selectedWallet,
    className,
    isTelegramEnviroment,
    selectCrypto,
    selectFiat,
    selectedCrypto,
    selectedFiat,
    fiatList,
    chainList,
    externalCalcData,
    setIsModalOpen,
    isOpen,
    onCardCreate,
  } = props;

  const [isCryptoModalOpen, setIsCryptoModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [activeBin, setActiveBin] = useState<API.Cards.Bin>(bins[0]);
  const [cardName, setCardName] = useState<string>('');
  const [topUpConfirmationText, setTopUpConfirmationText] = useState<string | null>(null);

  const { setAmount, amount, offrampCalcData, isOfframpCalcPending } = externalCalcData;

  const selectedWalletBalance = selectedWallet.data?.balance;
  const selectedCryptoWalletBalance =
    selectedWalletBalance?.find((balance) => balance.crypto.uuid === selectedCrypto.uuid)?.amount || 0;
  const selectedCryptoAvavilibleToWithdraw =
    selectedWallet.data &&
    selectedWallet.data.balance.find((balance) => balance.crypto.uuid === selectedCrypto.uuid)?.amount;

  const backButton = isTelegramEnviroment && useBackButton(true);
  const [mainButton] = isTelegramEnviroment ? initMainButton() : [null];

  const isAmountEnough = selectedCryptoAvavilibleToWithdraw && selectedCryptoAvavilibleToWithdraw >= amount;
  const isTopUpAvailable = !!selectedCrypto && !!selectedFiat && !!selectedWallet.data && !!amount && isAmountEnough;

  const mainButtonTitle = isAmountEnough ? 'Create card' : 'Not enough funds';

  const selectCurrency = (currency: API.List.Crypto | API.List.Fiat | API.List.Chains) => {
    if (isFiat(currency)) {
      selectFiat(currency);
    }
    if (isCrypto(currency)) {
      selectCrypto(currency);
    }
  };

  const openCryptoModal = () => setIsCryptoModalOpen(true);

  const openConfirmationModal = () => {
    const confirmationText = `Are you sure you want to create card and top up it with ${amount} ${selectedCrypto.symbol}?`;

    setTopUpConfirmationText(confirmationText);
    setIsConfirmationModalOpen(true);
  };

  const createCardHandler = async () => {
    if (!selectedWallet.data) {
      return;
    }

    const requestData: API.Cards.Create.Request = {
      binCode: activeBin.code,
      cardName,
      wallet_uuid: selectedWallet.data.uuid,
      cardBalance: amount,
    };

    const { data } = await createCard(requestData);
    setIsModalOpen(false);
    toast.success('Card created successfully');
    onCardCreate && onCardCreate(data.id);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    backButton && backButton.hide();
    mainButton && mainButton.hide();
  };

  const setCardFiatCurrency = () => {
    const cardCurrency = fiatList.find((fiat) => fiat.code === activeBin.currencyCode);

    if (cardCurrency) {
      selectFiat(cardCurrency);
    } else {
      closeModal();
      toast.error('Card currency not found');
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const bin = bins.find((item) => item.code === e.target.value);
    if (!bin) {
      return;
    }
    setActiveBin(bin);
  };

  useEffect(() => {
    setCardFiatCurrency();
    setAmount(0);
  }, [activeBin]);

  useEffect(() => {
    if (backButton) {
      isOpen && backButton.show();
      backButton.on('click', () => {
        closeModal();
      });
    }

    if (mainButton) {
      console.log('mainButton', mainButton);
      isOpen && mainButton.show();
      mainButton.on('click', () => {
        openConfirmationModal();
      });
    }
  }, [isOpen]);

  useEffect(() => {
    mainButton && mainButton.setText(mainButtonTitle);
  }, [mainButtonTitle]);

  useEffect(() => {
    if (!mainButton) return;

    isTopUpAvailable ? mainButton.enable() : mainButton.disable();
  }, [isTopUpAvailable]);

  return (
    <CustomModal
      isOpen={isOpen}
      onOpenChange={setIsModalOpen}
      hideCloseButton
      backdrop="opaque"
      scrollBehavior="inside"
      header="Create card"
      footer={
        <>
          {!mainButton && (
            <Button isDisabled={!isTopUpAvailable} color="primary" radius="md" onClick={openConfirmationModal}>
              {mainButtonTitle}
            </Button>
          )}
          {!backButton && (
            <Button onClick={closeModal} className="w-full" color="primary" variant="bordered">
              Close
            </Button>
          )}
        </>
      }
    >
      <div className={cn('flex flex-col gap-4', className)}>
        <Button onClick={() => mainButton && mainButton.show()}>Show main button</Button>
        <Select label="Select BIN" onChange={handleSelectChange} selectedKeys={[activeBin.code]}>
          {bins.map((bin) => (
            <SelectItem
              key={bin.code}
              onClick={() => setActiveBin(bin)}
              value={bin.code}
              className="border-b border-gray-200 p-2 text-xs"
              textValue={`${bin.code}, ${bin.provider}, ${bin.currencyCode}`}
            >
              <BinInfo bin={bin} />
            </SelectItem>
          ))}
        </Select>
        <CustomInput
          label="Card name"
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
          placeholder="Enter card name"
        />
        <SelectCurrency
          label="Top Up from"
          labelClassName="!text-base font-medium mb-2"
          onClick={openCryptoModal}
          currency={selectedCrypto}
          balance={selectedCryptoWalletBalance}
          chains={chainList}
        />

        <ExternalExhangeInput
          externalLabel="Top Up amount"
          buyingCurrency={selectedFiat}
          sellingCurrency={selectedCrypto}
          calcData={offrampCalcData}
          sellValue={amount}
          setSellValue={setAmount}
          isCalculating={isOfframpCalcPending}
          isWithdraw
        />

        <CurrencyListModal
          isOpen={isCryptoModalOpen}
          setIsModalOpen={setIsCryptoModalOpen}
          activeCurrency={selectedCrypto}
          currencies={allowedCryptoToFiatList}
          onSelect={selectCurrency}
          chains={chainList}
        />

        <ConfirmModal
          isOpen={isConfirmationModalOpen}
          setIsModalOpen={setIsConfirmationModalOpen}
          onConfirm={createCardHandler}
          title="Top Up confirmation"
          confirmText={topUpConfirmationText}
        />
      </div>
    </CustomModal>
  );
};

export default CreateCardModal;