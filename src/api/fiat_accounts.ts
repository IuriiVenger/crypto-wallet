import { API } from './types';

import { getRequest, postRequest } from '.';

export const fiat_accounts = {
  getAllByWalletUuid: (wallet_uuid: string, limit: number, offset: number) =>
    getRequest<API.Wallets.FiatAccount[]>(`/fiat_accounts/list/${wallet_uuid}`, { params: { limit, offset } }),
  getByUuid: (uuid: string) => getRequest<API.Wallets.FiatAccount>(`/fiat_accounts/${uuid}`),
  create: (wallet_id: string, program_id: string) =>
    postRequest<API.Wallets.FiatAccount>(`/fiat_accounts`, { data: { wallet_id, program_id } }),
};
