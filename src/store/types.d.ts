import { TypedUseSelectorHook } from 'react-redux';

import { store } from '.';

import { API } from '@/api/types';
import { CalcType, ModalNames } from '@/constants';

export type RootState = ReturnType<typeof store.getState>;
export type AppSelector = TypedUseSelectorHook<RootState>;
export type AppDispatch = typeof store.dispatch;
export type AppAction<P, T = string> = {
  readonly payload: P;
  readonly type: T;
};

export type SupabasePaginationParams = {
  meta: {
    offset: number;
    limit: number;
    isLastPage?: boolean;
  };
};

export type StoreDataWithStatus<T> = {
  status: RequestStatus;
  data: T;
};

export type StoreDataWithStatusAndMeta<T> = StoreDataWithStatus<T> & SupabasePaginationParams;
export type StoreDataWithStatusAndMetaRecordsWithNames<T> = Record<string, StoreDataWithStatusAndMeta<T>>;

export interface StoreOnrampCalcData extends API.Orders.OnRamp.Calc.Item {
  type: CalcType;
}

export interface StoreOfframpCalcData extends API.Orders.OffRamp.Calc.Item {
  type: CalcType;
}

export type ModalVisibility = {
  [key in ModalNames]: boolean;
};
