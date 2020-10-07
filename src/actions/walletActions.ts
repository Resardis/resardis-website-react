import {
    SET_IS_WALLET_ENABLED,
    SET_ACCOUNT_ADDRESS,
    SET_ASSET_BALANCE,
    SELECT_ASSET,
    CLEAR_ASSETS_BALANCE,
    SetIsWalletEnabled,
    AccountAddressAction,
    AssetBalanceAction,
    SelectAssetAction,
    AssetBalanceActionPayload,
    ClearAssetsBalanceAction,
} from '../constants/actionTypes'

export const setIsWalletEnabled = (payload: boolean):SetIsWalletEnabled => ({
  type: SET_IS_WALLET_ENABLED,
  payload
})

export const setAccountAddress = (payload: string):AccountAddressAction => ({
  type: SET_ACCOUNT_ADDRESS,
  payload,
})

export const setAssetBalance = (payload: AssetBalanceActionPayload):AssetBalanceAction => ({
  type: SET_ASSET_BALANCE,
  payload,
})

export const selectAsset = (payload: string):SelectAssetAction => ({
  type: SELECT_ASSET,
  payload,
})

export const clearAssetsBalance = ():ClearAssetsBalanceAction => ({
  type: CLEAR_ASSETS_BALANCE,
})

export type AccountActions = SetIsWalletEnabled |
  AccountAddressAction |
  AssetBalanceAction |
  SelectAssetAction |
  ClearAssetsBalanceAction

