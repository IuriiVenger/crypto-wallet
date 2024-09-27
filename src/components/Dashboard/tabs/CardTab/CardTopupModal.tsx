import { FC, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { API } from '@/api/types';

import { DashboardProps } from '@/components/Dashboard';
import ExchangeForm from '@/components/ExchangeForm';
import ConfirmModal from '@/components/modals/ConfirmModal';
import CurrencyListModal from '@/components/modals/CurrencyListModal';
import MainModal from '@/components/modals/MainModal';
import { getCurrencyListWithAmount, isCrypto, isFiat } from '@/utils/financial';

type CardTopupModalProps = {
  allowedCryptoToFiatList: DashboardProps['allowedCryptoToFiatList'];
  selectedWallet: DashboardProps['selectedWallet'];
  setIsModalOpen: (isOpen: boolean) => void;
  isOpen: boolean;
  selectCrypto: DashboardProps['selectCrypto'];
  selectFiat: DashboardProps['selectFiat'];
  selectedCrypto: DashboardProps['selectedCrypto'];
  selectedFiat: DashboardProps['selectedFiat'];
  fiatList: DashboardProps['fiatList'];
  createInternalTopUpOrder: DashboardProps['createInternalTopUpOrder'];
  chainList: DashboardProps['chainList'];
  externalCalcData: DashboardProps['externalCalcData'];
  selectedCard: DashboardProps['selectedCard'];
  selectCard: DashboardProps['selectCard'];
};

const CardTopupModal: FC<CardTopupModalProps> = (props) => {
  const {
    allowedCryptoToFiatList,
    selectedWallet,

    selectCrypto,
    selectFiat,
    selectedCrypto,
    selectedFiat,
    fiatList,
    createInternalTopUpOrder,
    chainList,
    externalCalcData,
    setIsModalOpen,
    isOpen,
    selectedCard,
    selectCard,
  } = props;

  const { setAmount, amount, offrampCalcData, isOfframpCalcPending } = externalCalcData;

  const [isCryptoModalOpen, setIsCryptoModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [topUpConfirmationText, setTopUpConfirmationText] = useState<string | null>(null);

  const selectedWalletBalance = selectedWallet.data?.balance;
  const selectedCryptoWalletBalance =
    selectedWalletBalance?.find((balance) =>
      balance.details.find((balanceDetails) => balanceDetails.crypto.uuid === selectedCrypto?.uuid),
    )?.amount || 0;

  const selectedCryptoAvavilibleToWithdraw =
    selectedWallet.data &&
    selectedWallet.data.balance.find((balance) =>
      balance.details.find((details) => details.crypto.uuid === selectedCrypto?.uuid),
    )?.amount;

  const isAmountEnough = selectedCryptoAvavilibleToWithdraw && selectedCryptoAvavilibleToWithdraw >= amount;
  const isTopUpAvailable = !!selectedCrypto && !!selectedFiat && !!selectedWallet.data && !!amount && isAmountEnough;

  const availableCryptoToWithdraw = selectedWallet.data
    ? getCurrencyListWithAmount(allowedCryptoToFiatList, selectedWallet.data.balance)
    : [];

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
    const confirmationText = `Are you sure you want to topup ${amount} ${selectedCrypto?.symbol}?`;

    setTopUpConfirmationText(confirmationText);
    setIsConfirmationModalOpen(true);
  };

  const topUpCard = async () => {
    if (!selectedWallet.data || !selectedCard.data || !selectedCrypto || !selectedFiat) return;

    await createInternalTopUpOrder({
      amount,
      crypto_uuid: selectedCrypto.uuid,
      fiat_uuid: selectedFiat.uuid,
      wallet_uuid: selectedWallet.data.uuid,
      is_subsctract: true,
      card_id: selectedCard.data.card_id,
    });
    toast.success('Card successfully topped up');
    selectCard(selectedCard.data.card_id);
    setIsModalOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const setCardFiatCurrency = () => {
    const cardCurrency = fiatList.find((fiat) => fiat.uuid === selectedCard.data?.fiat_account.fiat.uuid);

    if (cardCurrency) {
      selectFiat(cardCurrency);
    } else {
      closeModal();
      toast.error('Card currency not found');
    }
  };

  const handleAmountInput = (e: React.ChangeEvent<HTMLInputElement>) => setAmount(Number(e.target.value));

  useEffect(() => {
    if (!selectedCard.data) return;
    setCardFiatCurrency();
    setAmount(0);
  }, [selectedCard]);

  return (
    <MainModal
      isOpen={isOpen}
      onOpenChange={setIsModalOpen}
      confirmButtonDisabled={!isTopUpAvailable}
      confirmButtonText={isAmountEnough ? 'Top Up' : 'Not enough funds'}
      onConfirm={openConfirmationModal}
    >
      <div className="flex  flex-col gap-6">
        <h2 className="text-3xl font-medium">From crypto wallet</h2>
        <ExchangeForm
          chains={chainList}
          sellingTitleLabel="From"
          sellingTitleValue={`Available: ${selectedCryptoWalletBalance} ${selectedCrypto?.symbol}`}
          sellingCurrency={selectedCrypto}
          sellingAmount={amount}
          handleSellingAmountInput={handleAmountInput}
          buyingAmount={offrampCalcData?.amount_fiat || 0}
          buyingCurrency={selectedFiat}
          buyingTitleLabel="To"
          buyingTitleValue={`Balance: ${selectedCard.data?.fiat_account.fiat.symbol}${selectedCard.data?.fiat_account.balance}`}
          buyingAmoutPending={isOfframpCalcPending}
          onSellingCurrencyClick={openCryptoModal}
        />

        <CurrencyListModal
          isOpen={isCryptoModalOpen}
          setIsModalOpen={setIsCryptoModalOpen}
          activeCurrency={selectedCrypto}
          currencies={availableCryptoToWithdraw}
          onSelect={selectCurrency}
          chains={chainList}
        />
        <ConfirmModal
          isOpen={isConfirmationModalOpen}
          setIsModalOpen={setIsConfirmationModalOpen}
          onConfirm={topUpCard}
          title="Top Up confirmation"
          confirmText={topUpConfirmationText}
        />
      </div>
    </MainModal>
  );
};

export default CardTopupModal;