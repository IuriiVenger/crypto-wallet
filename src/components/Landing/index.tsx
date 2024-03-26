import { FC } from 'react';

import Contacts from './Contacts';
import ContactSupport from './ContactSupport';

import CryptoSwap from './CryptoSwap';
import CryptoTradingInfo from './CryptoTradingInfo';

import FAQ from './FAQ';
import HaveMoreQuestions from './HaveMoreQuestions';
import WalletOverview from './WalletOverview';

import { API } from '@/api/types';
import { UseExchangeData } from '@/hooks/useExchange';

type LandingProps = {
  selectCrypto: (crypto: API.List.Crypto) => void;
  selectFiat: (fiat: API.List.Fiat) => void;
  selectedCrypto: API.List.Crypto;
  selectedFiat: API.List.Fiat;
  chainList: API.List.Chains[];
  cryptoList: API.List.Crypto[];
  fiatList: API.List.Fiat[];
  className?: string;
  exchangeData: UseExchangeData;
  isUserLoggedIn: boolean;
};

const Landing: FC<LandingProps> = (props) => (
  <div className="-mb-5 flex">
    <div className="relative left-0 flex w-screen flex-col items-center">
      <WalletOverview {...props} />
      <CryptoSwap {...props} />
      <ContactSupport />
      <CryptoTradingInfo />
      <HaveMoreQuestions />
      <FAQ />
      <Contacts />
    </div>
  </div>
);

export default Landing;
