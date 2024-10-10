/* eslint-disable no-alert */
import cn from 'classnames';
import { FC, useState } from 'react';

import { RiAddFill, RiCornerLeftDownFill, RiCornerRightUpFill, RiWalletLine } from 'react-icons/ri';

import CreateCardModal from '../../CreateCardModal';
import ReceiveCryptoModal from '../../ReceiveCryptoModal';
import WalletTransactions from '../../WalletTransactions';
import WithdrawCryptoModal from '../../WithdrawCryptoModal';

import MainInformation from './MainInformation';
import WalletBalanceList from './WalletBalanceList';

import { DashboardProps } from '@/components/Dashboard';
import CardsList from '@/components/Dashboard/tabs/MainTab/CardsList';
import DefaultContainer from '@/components/ui/DefaultContainer';
import { RoundButtonProps } from '@/components/ui/RoundButton';
import { DashboardTabs } from '@/constants';
import { roundToDecimals, separateNumbers } from '@/utils/converters';

type MainTabProps = {
  className?: string;
  selectedWallet: DashboardProps['selectedWallet'];
  selectedWalletBalanceCurrency: string;
  changeDashboardTab: DashboardProps['changeDashboardTab'];
  chainList: DashboardProps['chainList'];
  cards: DashboardProps['cards'];
  loadSelectedWalletCards: DashboardProps['loadSelectedWalletCards'];
  loadMoreWalletCards: DashboardProps['loadMoreWalletCards'];
  loadMoreWalletTransactions: DashboardProps['loadMoreWalletTransactions'];
  createCard: DashboardProps['createCard'];
  createCrypto2CryptoOrder: DashboardProps['createCrypto2CryptoOrder'];
  createCrypto2FiatOrder: DashboardProps['createCrypto2FiatOrder'];
  walletTransactions: DashboardProps['walletTransactions'];
  selectedCrypto: DashboardProps['selectedCrypto'];
  cryptoBySymbol: DashboardProps['cryptoBySymbol'];
  bins: DashboardProps['bins'];
  verificationStatus?: DashboardProps['verificationStatus'];
  openKYC: DashboardProps['openKYC'];
  getWalletAddress: DashboardProps['getWalletAddress'];
  createWalletAddress: DashboardProps['createWalletAddress'];
  selectCrypto: DashboardProps['selectCrypto'];
  externalCalcData: DashboardProps['externalCalcData'];
};

const MainTab: FC<MainTabProps> = (props) => {
  const {
    className,
    selectedWallet,
    changeDashboardTab,
    selectedWalletBalanceCurrency,
    chainList,
    loadSelectedWalletCards,
  } = props;

  const [isReceiveCryptoModalOpen, setIsReceiveCryptoModalOpen] = useState(false);
  const [isCreateCardModalOpen, setIsCreateCardModalOpen] = useState(false);
  const [isWithdrawCryptoModalOpen, setIsWithdrawCryptoModalOpen] = useState(false);

  const currentWalletBalanceAmount = separateNumbers(roundToDecimals(selectedWallet.data?.total_amount || 0));
  const currentWalletBalance = `${selectedWalletBalanceCurrency} ${currentWalletBalanceAmount}`;

  const onCardClick = (card_id: string) => {
    changeDashboardTab(DashboardTabs.CARD, { card_id });
  };
  const openWalletTab = () => changeDashboardTab(DashboardTabs.WALLET);
  const openTransactionsTab = () => changeDashboardTab(DashboardTabs.TRANSACTIONS);
  const openReceiveCryptoModal = () => setIsReceiveCryptoModalOpen(true);
  const openCreateCardModal = () => setIsCreateCardModalOpen(true);
  const openWithdrawCryptoModal = () => setIsWithdrawCryptoModalOpen(true);

  const onCardCreate = (card_id: string) => {
    onCardClick(card_id);
    loadSelectedWalletCards();
  };

  const actionButtons: RoundButtonProps[] = [
    {
      title: 'New card',
      Icon: RiAddFill,
      onClick: openCreateCardModal,
    },
    {
      title: 'Receive',
      Icon: RiCornerLeftDownFill,
      onClick: openReceiveCryptoModal,
    },
    {
      title: 'Send',
      Icon: RiCornerRightUpFill,
      onClick: openWithdrawCryptoModal,
    },
    {
      title: 'Wallet',
      Icon: RiWalletLine,
      onClick: openWalletTab,
    },
  ];

  return (
    <section className={cn(className, 'bg-custom-turquoise-gradient grid max-w-screen-xl grid-cols-3 gap-4')}>
      <MainInformation className="col-span-3" balance={currentWalletBalance} actionButtons={actionButtons} />
      <DefaultContainer className={cn(className, 'col-span-3 lg:col-span-2 xs:px-0 max-xs:px-0')}>
        <CardsList openCreateCardModal={openCreateCardModal} onCardClick={onCardClick} cardSize="adaptive" {...props} />
      </DefaultContainer>
      <DefaultContainer className="col-span-3 row-span-2 flex flex-col lg:col-span-1">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl lg:text-2xl">Wallet</h2>
          <button onClick={openWalletTab} type="button" className="text-foreground-2 text-small hover:opacity-hover ">
            Show all
          </button>
        </div>
        <WalletBalanceList selectedWalletBalanceCurrency={selectedWalletBalanceCurrency} wallet={selectedWallet.data} />
      </DefaultContainer>
      <DefaultContainer className="col-span-3 lg:col-span-2">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl lg:text-2xl">Transactions</h2>
          <button
            onClick={openTransactionsTab}
            type="button"
            className="text-foreground-2 text-small hover:opacity-hover "
          >
            Show all
          </button>
        </div>
        <WalletTransactions disableLoadMore {...props} />
      </DefaultContainer>
      <ReceiveCryptoModal
        isOpen={isReceiveCryptoModalOpen}
        setIsModalOpen={setIsReceiveCryptoModalOpen}
        chains={chainList}
        {...props}
      />
      <CreateCardModal
        isOpen={isCreateCardModalOpen}
        setIsModalOpen={setIsCreateCardModalOpen}
        onCardCreate={onCardCreate}
        {...props}
      />
      <WithdrawCryptoModal
        isOpen={isWithdrawCryptoModalOpen}
        setIsModalOpen={setIsWithdrawCryptoModalOpen}
        chains={chainList}
        {...props}
      />
    </section>
  );
};

export default MainTab;
