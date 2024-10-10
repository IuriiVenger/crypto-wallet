/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  AppAction,
  StoreDataWithStatus,
  StoreDataWithStatusAndMeta,
  StoreDataWithStatusAndMetaRecordsWithNames,
  StoreOfframpCalcData,
  StoreOnrampCalcData,
  SupabasePaginationParams,
} from '../types';

import { fiat_accounts } from '@/api/fiat_accounts';
import { issuing } from '@/api/issuing';
import { orders } from '@/api/orders';
import { API } from '@/api/types';
import { wallets } from '@/api/wallets';
import {
  CalcType,
  RequestStatus,
  cardInitialPaginationParams,
  defaultPaginationParams,
  emptyStoreDataWithStatus,
} from '@/constants';

type FinanceState = {
  bins: API.Cards.CardConfig[];
  chains: API.List.Chains[];
  crypto: API.List.Crypto[];
  cryptoBySymbol: API.List.CryptoBySymbol[];
  fiats: API.List.Fiat[];
  fiatExchangeRate: API.Exchange.F2C[];
  onrampCalc: StoreDataWithStatus<StoreOnrampCalcData[] | null>;
  offrampCalc: StoreDataWithStatus<StoreOfframpCalcData[] | null>;
  withdrawCalc: StoreDataWithStatus<API.Orders.Crypto.Withdrawal.Calc.Response | null>;
  selectedChain: null | API.List.Chains;
  selectedCrypto: null | API.List.Crypto;
  selectedCard: StoreDataWithStatus<API.Cards.CardDetailItem | null>;
  selectedCardTransactions: StoreDataWithStatusAndMeta<API.Cards.TransactionItem[] | null>;
  selectedFiat: null | API.List.Fiat;
  selectedFiatAccount: StoreDataWithStatus<API.Wallets.FiatAccount | null>;
  selectedFiatAccountCards: StoreDataWithStatusAndMeta<API.Cards.CardListItem[] | null>;
  selectedWallet: StoreDataWithStatus<API.Wallets.ExtendWallet | null>;
  selectedWalletTransactions: StoreDataWithStatusAndMeta<API.WalletTransactions.Transaction[] | null>;
  selectedWalletCards: StoreDataWithStatusAndMeta<API.Cards.CardListItem[] | null>;
  selectedWalletFiatAccounts: StoreDataWithStatusAndMeta<API.Wallets.FiatAccount[] | null>;
  selectedWalletFiatAccountsWithCards: StoreDataWithStatusAndMetaRecordsWithNames<API.Cards.CardListItem[] | null>;
  userWallets: API.Wallets.Wallet[];
};

type LoadWithLimit<T> = T & {
  limit?: number;
  offset?: number;
};

type RequiredLoadWithLimit<T> = T & {
  limit: number;
  offset: number;
};

const initialState: FinanceState = {
  bins: [],
  chains: [],
  crypto: [],
  cryptoBySymbol: [],
  fiats: [],
  fiatExchangeRate: [],
  onrampCalc: emptyStoreDataWithStatus,
  offrampCalc: emptyStoreDataWithStatus,
  withdrawCalc: emptyStoreDataWithStatus,
  selectedChain: null,
  selectedCrypto: null,
  selectedFiat: null,
  selectedFiatAccount: emptyStoreDataWithStatus,
  selectedFiatAccountCards: {
    ...emptyStoreDataWithStatus,
    meta: cardInitialPaginationParams,
  },
  selectedWallet: emptyStoreDataWithStatus,
  selectedWalletFiatAccounts: {
    ...emptyStoreDataWithStatus,
    meta: defaultPaginationParams,
  },
  selectedWalletFiatAccountsWithCards: {},
  selectedCard: emptyStoreDataWithStatus,
  selectedCardTransactions: {
    ...emptyStoreDataWithStatus,
    meta: defaultPaginationParams,
  },
  selectedWalletTransactions: {
    ...emptyStoreDataWithStatus,
    meta: defaultPaginationParams,
  },
  selectedWalletCards: {
    ...emptyStoreDataWithStatus,
    meta: cardInitialPaginationParams,
  },
  userWallets: [],
};

export const hiddenLoadSelectedWallet = createAsyncThunk(
  'finanse/selectedWalletHidden',
  async (wallet_uuid: string) => {
    const data = await wallets.getByUuid(wallet_uuid);

    return data;
  },
);

export const loadSelectedWallet = createAsyncThunk('finanse/selectedWallet', async (wallet_uuid: string) => {
  const data = await wallets.getByUuid(wallet_uuid);

  return data;
});

export const loadSelectedWalletFiatAccounts = createAsyncThunk(
  'finanse/selectedWalletFiatAccounts',
  async ({ wallet_uuid, limit, offset }: LoadWithLimit<{ wallet_uuid: string }>) => {
    const requestData = {
      wallet_uuid,
      limit: limit || initialState.selectedWalletFiatAccounts.meta.limit,
      offset: offset || initialState.selectedWalletFiatAccounts.meta.offset,
    };

    const { data } = await fiat_accounts.getAllByWalletUuid(
      requestData.wallet_uuid,
      requestData.limit,
      requestData.offset,
    );

    return data;
  },
);

export const loadMoreSelectedWalletFiatAccounts = createAsyncThunk(
  'finanse/moreSelectedWalletFiatAccounts',
  async (props: RequiredLoadWithLimit<{ wallet_uuid: string }> & SupabasePaginationParams['meta']) => {
    const { wallet_uuid, limit, offset } = props;
    const { data } = await fiat_accounts.getAllByWalletUuid(wallet_uuid, limit, offset);

    return data;
  },
);

export const loadSelectedFiatAccount = createAsyncThunk(
  'finanse/selectedFiatAccount',
  async (fiat_account_id: string) => {
    const data = await fiat_accounts.getByUuid(fiat_account_id);

    return data;
  },
);

export const loadSelectedFiatAccountCards = createAsyncThunk(
  'finanse/selectedFiatAccountCards',
  async ({
    wallet_uuid,
    fiat_account_id,
    limit,
    offset,
  }: LoadWithLimit<{ wallet_uuid: string; fiat_account_id: string }>) => {
    const requestData = {
      wallet_uuid,
      fiat_account_id,
      limit: limit || initialState.selectedFiatAccountCards.meta.limit,
      offset: offset || initialState.selectedFiatAccountCards.meta.offset,
    };

    const { data } = await issuing.cards.getByFiatAccountAndWalletId(
      requestData.wallet_uuid,
      requestData.fiat_account_id,
      requestData.limit,
      requestData.offset,
    );

    return data;
  },
);

export const loadFiatAccountCards = createAsyncThunk(
  'finanse/fiatAccountCards',
  async ({
    wallet_uuid,
    fiat_account_id,
    limit,
    offset,
  }: LoadWithLimit<{ wallet_uuid: string; fiat_account_id: string }>) => {
    const requestData = {
      wallet_uuid,
      fiat_account_id,
      limit: limit || initialState.selectedFiatAccountCards.meta.limit,
      offset: offset || initialState.selectedFiatAccountCards.meta.offset,
    };

    const { data } = await issuing.cards.getByFiatAccountAndWalletId(
      requestData.wallet_uuid,
      requestData.fiat_account_id,
      requestData.limit,
      requestData.offset,
    );

    return data;
  },
);

export const loadMoreFiatAccountCards = createAsyncThunk(
  'finanse/moreFiatAccountCards',
  async (
    props: RequiredLoadWithLimit<{ wallet_uuid: string; fiat_account_id: string }> & SupabasePaginationParams['meta'],
  ) => {
    const { wallet_uuid, fiat_account_id, limit, offset } = props;
    const { data } = await issuing.cards.getByFiatAccountAndWalletId(wallet_uuid, fiat_account_id, limit, offset);

    return data;
  },
);

export const loadSelectedCard = createAsyncThunk('finanse/selectedCard', async (card_id: string) => {
  if (!card_id) {
    return null;
  }
  const { data } = await issuing.cards.getById(card_id);

  return data;
});

export const loadWalletTransactions = createAsyncThunk(
  'finanse/walletTransactions',
  async ({ wallet_uuid, limit, offset }: LoadWithLimit<{ wallet_uuid: string }>) => {
    const requestData = {
      wallet_uuid,
      limit: limit || initialState.selectedWalletTransactions.meta.limit,
      offset: offset || initialState.selectedWalletTransactions.meta.offset,
    };

    const { data } = await wallets.transactions.getByWalletUuid(
      requestData.wallet_uuid,
      requestData.limit,
      requestData.offset,
    );

    return data;
  },
);

export const loadMoreWalletTransactions = createAsyncThunk(
  'finanse/moreTransactions',
  async (props: LoadWithLimit<{ wallet_uuid: string }> & SupabasePaginationParams['meta']) => {
    const { wallet_uuid, limit, offset } = props;
    const { data } = await wallets.transactions.getByWalletUuid(wallet_uuid, limit, offset);

    return data;
  },
);

export const loadCardTransactions = createAsyncThunk(
  'finanse/selectedCardTransactions',
  async ({ card_id, limit, offset }: LoadWithLimit<{ card_id: string }>) => {
    const { data } = await issuing.transactions.getByCardId(card_id, limit, offset);

    return data;
  },
);

export const loadMoreCardTransactions = createAsyncThunk(
  'finanse/moreCardTransactions',
  async (props: LoadWithLimit<{ card_id: string }> & SupabasePaginationParams['meta']) => {
    const { card_id, limit, offset } = props;
    const { data } = await issuing.transactions.getByCardId(card_id, limit, offset);

    return data;
  },
);

export const loadWalletCards = createAsyncThunk(
  'finanse/walletCards',
  async ({ wallet_uuid, limit, offset }: RequiredLoadWithLimit<{ wallet_uuid: string }>) => {
    const { data } = await issuing.cards.getByWalletUuid(wallet_uuid, limit, offset);

    return data;
  },
);

export const loadMoreWalletCards = createAsyncThunk(
  'finanse/moreWalletCards',
  async (props: RequiredLoadWithLimit<{ wallet_uuid: string }> & SupabasePaginationParams['meta']) => {
    const { wallet_uuid, limit, offset } = props;
    const { data } = await issuing.cards.getByWalletUuid(wallet_uuid, limit, offset);

    return data;
  },
);

export const loadOnrampCalc = createAsyncThunk(
  'finanse/onrampCalc',
  async (requestData: API.Orders.OnRamp.Calc.Request) => {
    const { data } = await orders.onramp.calc(requestData);

    return data.map((calcData) => ({ ...calcData, type: CalcType.ONRAMP }));
  },
);

export const loadOfframpCalc = createAsyncThunk(
  'finanse/offrampCalc',
  async (requestData: API.Orders.OffRamp.Calc.Request) => {
    const { data } = await orders.offramp.calc(requestData);

    return data.map((calcData) => ({ ...calcData, type: CalcType.OFFRAMP }));
  },
);

export const loadWithdrawCalc = createAsyncThunk(
  'finanse/withdrawCalc',
  async (requestData: API.Orders.Crypto.Withdrawal.Calc.Request) => {
    const { data } = await orders.crypto.withdrawal.calc(requestData);

    return data;
  },
);

const financeSlice = createSlice({
  name: 'finance',
  initialState,
  reducers: {
    setBins: (state, action: AppAction<API.Cards.CardConfig[]>) => {
      state.bins = action.payload;
    },
    setChains: (state, action: AppAction<API.List.Chains[]>) => {
      state.chains = action.payload;
    },
    setCrypto: (state, action: AppAction<API.List.Crypto[]>) => {
      state.crypto = action.payload;
    },
    setCryptoBySymbol: (state, action: AppAction<API.List.CryptoBySymbol[]>) => {
      state.cryptoBySymbol = action.payload;
    },
    setFiats: (state, action: AppAction<API.List.Fiat[]>) => {
      state.fiats = action.payload;
    },
    setFiatExchangeRate: (state, action: AppAction<API.Exchange.F2C[]>) => {
      state.fiatExchangeRate = action.payload;
    },
    setSelectedChain: (state, action: AppAction<API.List.Chains>) => {
      state.selectedChain = action.payload;
    },
    setSelectedCrypto: (state, action: AppAction<API.List.Crypto>) => {
      state.selectedCrypto = action.payload;
    },
    setSelectedFiat: (state, action: AppAction<API.List.Fiat>) => {
      state.selectedFiat = action.payload;
    },
    setSelectedWallet: (state, action: AppAction<API.Wallets.ExtendWallet | null>) => {
      state.selectedWallet.data = action.payload;
    },

    setUserWallets: (state, action: AppAction<API.Wallets.Wallet[]>) => {
      state.userWallets = action.payload;
    },
    clearSelectedCard: (state) => {
      state.selectedCard = emptyStoreDataWithStatus;
      state.selectedCardTransactions = {
        ...emptyStoreDataWithStatus,
        meta: defaultPaginationParams,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadFiatAccountCards.pending, (state, { meta }) => {
      state.selectedWalletFiatAccountsWithCards[meta.arg.fiat_account_id].status = RequestStatus.PENDING;
    });
    builder.addCase(loadFiatAccountCards.fulfilled, (state, { meta, payload }) => {
      state.selectedWalletFiatAccountsWithCards[meta.arg.fiat_account_id].status = RequestStatus.FULLFILLED;
      state.selectedWalletFiatAccountsWithCards[meta.arg.fiat_account_id].data = payload.data;
      state.selectedWalletFiatAccountsWithCards[meta.arg.fiat_account_id].meta.offset = payload.data.length;
      state.selectedWalletFiatAccountsWithCards[meta.arg.fiat_account_id].meta.isLastPage =
        payload.data.length < state.selectedWalletFiatAccountsWithCards[meta.arg.fiat_account_id].meta.limit;
    });
    builder.addCase(loadFiatAccountCards.rejected, (state, { meta }) => {
      state.selectedWalletFiatAccountsWithCards[meta.arg.fiat_account_id].status = RequestStatus.REJECTED;
    });
    builder.addCase(loadMoreFiatAccountCards.pending, (state, { meta }) => {
      state.selectedWalletFiatAccountsWithCards[meta.arg.fiat_account_id].status = RequestStatus.PENDING;
    });
    builder.addCase(loadMoreFiatAccountCards.fulfilled, (state, { meta, payload }) => {
      const existingData = state.selectedWalletFiatAccountsWithCards[meta.arg.fiat_account_id].data;

      state.selectedWalletFiatAccountsWithCards[meta.arg.fiat_account_id].status = RequestStatus.FULLFILLED;
      state.selectedWalletFiatAccountsWithCards[meta.arg.fiat_account_id].data = existingData
        ? [...existingData, ...payload.data]
        : payload.data;
      state.selectedWalletFiatAccountsWithCards[meta.arg.fiat_account_id].meta.offset += payload.data.length;
      if (payload.data.length < state.selectedWalletFiatAccountsWithCards[meta.arg.fiat_account_id].meta.limit) {
        state.selectedWalletFiatAccountsWithCards[meta.arg.fiat_account_id].meta.isLastPage = true;
      }
    });
    builder.addCase(loadMoreFiatAccountCards.rejected, (state, { meta }) => {
      state.selectedWalletFiatAccountsWithCards[meta.arg.fiat_account_id].status = RequestStatus.REJECTED;
    });
    builder.addCase(hiddenLoadSelectedWallet.fulfilled, (state, action) => {
      state.selectedWallet.data = action.payload;
    });
    builder.addCase(loadSelectedWallet.pending, (state) => {
      state.selectedWallet.status = RequestStatus.PENDING;
    });
    builder.addCase(loadSelectedWallet.fulfilled, (state, action) => {
      state.selectedWallet.data = action.payload;
      state.selectedWallet.status = RequestStatus.FULLFILLED;
    });
    builder.addCase(loadSelectedWallet.rejected, (state) => {
      state.selectedWallet.status = RequestStatus.REJECTED;
    });
    builder.addCase(loadSelectedWalletFiatAccounts.pending, (state) => {
      state.selectedWalletFiatAccounts.status = RequestStatus.PENDING;
    });
    builder.addCase(loadSelectedWalletFiatAccounts.fulfilled, (state, { payload }) => {
      state.selectedWalletFiatAccounts.status = RequestStatus.FULLFILLED;
      state.selectedWalletFiatAccounts.data = payload;
      payload.forEach(({ id }) => {
        state.selectedWalletFiatAccountsWithCards[id] = {
          ...emptyStoreDataWithStatus,
          meta: cardInitialPaginationParams,
        };
      });
      state.selectedWalletFiatAccounts.meta.offset = payload.length;
      state.selectedWalletFiatAccounts.meta.isLastPage = payload.length < state.selectedWalletFiatAccounts.meta.limit;
    });
    builder.addCase(loadSelectedWalletFiatAccounts.rejected, (state) => {
      state.selectedWalletFiatAccounts.status = RequestStatus.REJECTED;
    });
    builder.addCase(loadMoreSelectedWalletFiatAccounts.pending, (state) => {
      state.selectedWalletFiatAccounts.status = RequestStatus.PENDING;
    });
    builder.addCase(loadMoreSelectedWalletFiatAccounts.fulfilled, (state, { payload }) => {
      state.selectedWalletFiatAccounts.status = RequestStatus.FULLFILLED;
      state.selectedWalletFiatAccounts.data = state.selectedWalletFiatAccounts.data
        ? [...state.selectedWalletFiatAccounts.data, ...payload]
        : payload;
      payload.forEach(({ id }) => {
        state.selectedWalletFiatAccountsWithCards[id] = {
          ...emptyStoreDataWithStatus,
          meta: cardInitialPaginationParams,
        };
      });
      state.selectedWalletFiatAccounts.meta.offset += payload.length;
      if (payload.length < state.selectedWalletFiatAccounts.meta.limit) {
        state.selectedWalletFiatAccounts.meta.isLastPage = true;
      }
    });
    builder.addCase(loadMoreSelectedWalletFiatAccounts.rejected, (state) => {
      state.selectedWalletFiatAccounts.status = RequestStatus.REJECTED;
    });
    builder.addCase(loadSelectedCard.pending, (state) => {
      state.selectedCard.status = RequestStatus.PENDING;
    });
    builder.addCase(loadSelectedCard.fulfilled, (state, action) => {
      state.selectedCard.status = RequestStatus.FULLFILLED;
      state.selectedCard.data = action.payload;
    });
    builder.addCase(loadSelectedCard.rejected, (state) => {
      state.selectedCard.status = RequestStatus.REJECTED;
    });
    builder.addCase(loadWalletTransactions.pending, (state) => {
      state.selectedWalletTransactions.status = RequestStatus.PENDING;
    });
    builder.addCase(loadWalletTransactions.fulfilled, (state, action) => {
      state.selectedWalletTransactions.status = RequestStatus.FULLFILLED;
      state.selectedWalletTransactions.data = action.payload;
      state.selectedWalletTransactions.meta.offset = state.selectedWalletTransactions.data.length;
      state.selectedWalletTransactions.meta.isLastPage =
        action.payload.length < state.selectedWalletTransactions.meta.limit;
    });
    builder.addCase(loadWalletTransactions.rejected, (state) => {
      state.selectedWalletTransactions.status = RequestStatus.REJECTED;
      state.selectedWalletTransactions.data = [];
    });
    builder.addCase(loadMoreWalletTransactions.pending, (state) => {
      state.selectedWalletTransactions.status = RequestStatus.PENDING;
    });
    builder.addCase(loadMoreWalletTransactions.fulfilled, (state, action) => {
      state.selectedWalletTransactions.status = RequestStatus.FULLFILLED;
      state.selectedWalletTransactions.data = state.selectedWalletTransactions.data
        ? [...state.selectedWalletTransactions.data, ...action.payload]
        : action.payload;
      state.selectedWalletTransactions.meta.offset += action.payload.length;
      if (action.payload.length < state.selectedWalletTransactions.meta.limit) {
        state.selectedWalletTransactions.meta.isLastPage = true;
      }
    });
    builder.addCase(loadMoreWalletTransactions.rejected, (state) => {
      state.selectedWalletTransactions.status = RequestStatus.REJECTED;
    });
    builder.addCase(loadCardTransactions.pending, (state) => {
      state.selectedCardTransactions.status = RequestStatus.PENDING;
    });
    builder.addCase(loadCardTransactions.fulfilled, (state, action) => {
      state.selectedCardTransactions.status = RequestStatus.FULLFILLED;
      state.selectedCardTransactions.data = action.payload.data;
      state.selectedCardTransactions.meta.offset = state.selectedCardTransactions.data.length;
      state.selectedCardTransactions.meta.isLastPage =
        action.payload.data.length < state.selectedCardTransactions.meta.limit;
    });
    builder.addCase(loadCardTransactions.rejected, (state) => {
      state.selectedCardTransactions.status = RequestStatus.REJECTED;
    });
    builder.addCase(loadMoreCardTransactions.pending, (state) => {
      state.selectedCardTransactions.status = RequestStatus.PENDING;
    });
    builder.addCase(loadMoreCardTransactions.fulfilled, (state, action) => {
      state.selectedCardTransactions.status = RequestStatus.FULLFILLED;
      state.selectedCardTransactions.data = state.selectedCardTransactions.data
        ? [...state.selectedCardTransactions.data, ...action.payload.data]
        : action.payload.data;
      state.selectedCardTransactions.meta.offset += action.payload.data.length;
      if (action.payload.data.length < state.selectedCardTransactions.meta.limit) {
        state.selectedCardTransactions.meta.isLastPage = true;
      }
    });
    builder.addCase(loadMoreCardTransactions.rejected, (state) => {
      state.selectedCardTransactions.status = RequestStatus.REJECTED;
    });
    builder.addCase(loadWalletCards.pending, (state) => {
      state.selectedWalletCards.status = RequestStatus.PENDING;
    });
    builder.addCase(loadWalletCards.fulfilled, (state, action) => {
      state.selectedWalletCards.status = RequestStatus.FULLFILLED;
      state.selectedWalletCards.data = action.payload.data;
      state.selectedWalletCards.meta.offset = action.payload.data.length;
      state.selectedWalletCards.meta.isLastPage = action.payload.data.length < state.selectedWalletCards.meta.limit;
    });
    builder.addCase(loadWalletCards.rejected, (state) => {
      state.selectedWalletCards.status = RequestStatus.REJECTED;
    });
    builder.addCase(loadMoreWalletCards.pending, (state) => {
      state.selectedWalletCards.status = RequestStatus.PENDING;
    });
    builder.addCase(loadMoreWalletCards.fulfilled, (state, action) => {
      state.selectedWalletCards.status = RequestStatus.FULLFILLED;
      state.selectedWalletCards.data = state.selectedWalletCards.data
        ? [...state.selectedWalletCards.data, ...action.payload.data]
        : action.payload.data;
      state.selectedWalletCards.meta.offset += action.payload.data.length;
      if (action.payload.data.length < state.selectedWalletCards.meta.limit) {
        state.selectedWalletCards.meta.isLastPage = true;
      }
    });
    builder.addCase(loadMoreWalletCards.rejected, (state) => {
      state.selectedWalletCards.status = RequestStatus.REJECTED;
    });
    builder.addCase(loadOnrampCalc.pending, (state) => {
      state.onrampCalc.status = RequestStatus.PENDING;
    });
    builder.addCase(loadOnrampCalc.fulfilled, (state, action) => {
      state.onrampCalc.status = RequestStatus.FULLFILLED;
      state.onrampCalc.data = action.payload;
    });
    builder.addCase(loadOnrampCalc.rejected, (state) => {
      state.onrampCalc.status = RequestStatus.REJECTED;
    });
    builder.addCase(loadOfframpCalc.pending, (state) => {
      state.offrampCalc.status = RequestStatus.PENDING;
    });
    builder.addCase(loadOfframpCalc.fulfilled, (state, action) => {
      state.offrampCalc.status = RequestStatus.FULLFILLED;
      state.offrampCalc.data = action.payload;
    });
    builder.addCase(loadOfframpCalc.rejected, (state) => {
      state.offrampCalc.status = RequestStatus.REJECTED;
    });
    builder.addCase(loadWithdrawCalc.pending, (state) => {
      state.withdrawCalc.status = RequestStatus.PENDING;
    });
    builder.addCase(loadWithdrawCalc.fulfilled, (state, action) => {
      state.withdrawCalc.status = RequestStatus.FULLFILLED;
      state.withdrawCalc.data = action.payload;
    });
    builder.addCase(loadWithdrawCalc.rejected, (state) => {
      state.withdrawCalc.status = RequestStatus.REJECTED;
    });
  },
});

export const {
  setBins,
  setChains,
  setFiats,
  setCrypto,
  setCryptoBySymbol,
  setSelectedChain,
  setSelectedCrypto,
  setSelectedFiat,
  setFiatExchangeRate,
  setUserWallets,
  setSelectedWallet,
  clearSelectedCard,
} = financeSlice.actions;

export default financeSlice.reducer;
