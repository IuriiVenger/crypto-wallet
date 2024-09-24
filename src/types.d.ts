import { API } from './api/types';

export type ValueWithLabel = {
  value: string;
  label: string;
};

export type WalletType = {
  [key: string]: ValueWithLabel;
};

export type HexColor = `#${string}`;
export type RGBAColor = `rgba(${string})`;
export type RGBColor = `rgb(${string})`;

type ChangeDashboardTabAdditionalParams = {
  wallet_uuid?: string;
  card_id?: string | null;
};

type WithAmount<T> = T & { amount?: number };
