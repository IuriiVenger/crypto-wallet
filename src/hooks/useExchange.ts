import { useState } from 'react';

import { API } from '@/api/types';

export type UseExchangeData = {
  sellValue: number;
  setSellValue: (value: number) => void;
  buyValue: number;
  setBuyValue: (value: number) => void;
  activeExchangeRate: number;
  potentialFiat2CryptoValue: number;
  fiat2CryptoValue: number;
  crypto2FiatValue: number;
  checkMinSellValue: () => void;
  minSellValue: number;
  exchangeRate: API.Exchange.F2C[];
};

type UseExchange = (arg1: API.Exchange.F2C[], arg2: API.List.Crypto | API.List.Fiat) => UseExchangeData;

const useExchange: UseExchange = (exchangeRate, buyingCurrency) => {
  const activeExchange = exchangeRate.find((rate) => rate.crypto_uuid === buyingCurrency.uuid);
  const minSellValue = activeExchange?.min_amount || 0;

  const [sellValue, setSellValue] = useState(minSellValue || 0);
  const [buyValue, setBuyValue] = useState(0);

  const activeExchangeRate = activeExchange?.rate || 0;

  const potentialFiat2CryptoValue = sellValue * activeExchangeRate;
  const fiat2CryptoValue = potentialFiat2CryptoValue > 0 ? potentialFiat2CryptoValue : 0;

  const potentialCrypto2FiatValue = sellValue / activeExchangeRate;
  const crypto2FiatValue = potentialCrypto2FiatValue > 0 ? potentialCrypto2FiatValue : 0;

  const checkMinSellValue = () => sellValue <= minSellValue && setSellValue(minSellValue);

  return {
    sellValue,
    setSellValue,
    buyValue,
    setBuyValue,
    activeExchangeRate,
    potentialFiat2CryptoValue,
    fiat2CryptoValue,
    crypto2FiatValue,
    checkMinSellValue,
    minSellValue,
    exchangeRate,
  };
};

export default useExchange;
