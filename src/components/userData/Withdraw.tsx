import React, { useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { BigNumber } from "bignumber.js";

import { AccountActions, selectAsset } from "../../actions/walletActions";
import { Network } from "../../constants/networks";
import { wei2ether } from "../../helpers";
import { BalancesType } from "../../reducers/funds";
import { RootState } from "../../reducers";
import { withdraw } from "../../contracts";

interface StateProps {
  accountAddress: string;
  assetSelected: string;
  balances: BalancesType;
  api: any;
  network: Network;
}

const mapStateToProps = (state: RootState): StateProps => ({
  accountAddress: state.funds.accountAddress,
  assetSelected: state.funds.assetSelected,
  balances: state.funds.balances,
  api: state.contract.contractAPI,
  network: state.contract.network,
});

const mapDispatchToProps = (dispatch: any) => ({
  selectAsset: (asset: string): AccountActions => dispatch(selectAsset(asset)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

const getSelectedAssetAddress = (assetSelected: string, network: Network) =>
  Object.keys(network.tokens).find(
    (address) => network.tokens[address] === assetSelected
  );

type PropsFromRedux = ConnectedProps<typeof connector>;

const BUTTON_ID = "WITHDRAW_BUTTON";

const Withdraw = ({
  accountAddress,
  assetSelected,
  balances,
  api,
  network,
  selectAsset,
}: PropsFromRedux) => {
  const [amount, setAmount] = useState(new BigNumber(0).toFixed(12));
  const updateAmount = (e: any) => {
    if (
      e.target.value !== "" &&
      new BigNumber(e.target.value).toString() === "NaN"
    )
      return;

    setAmount(e.target.value);
  };

  const handleWithdraw = () => {
    const tokenAddress = getSelectedAssetAddress(assetSelected, network) || "";
    withdraw(api, amount, tokenAddress, BUTTON_ID);
  };

  return (
    <div className="container-balances">
      <select
        className="transfer-asset-select"
        value={assetSelected}
        onChange={(e) => selectAsset(e.target.value)}
      >
        {Object.keys(balances).map((assetSymbol) => (
          <option key={assetSymbol} value={assetSymbol}>
            {assetSymbol}
          </option>
        ))}
      </select>
      <div className="deposit-withdraw-form">
        <div>Amount</div>
        <div className="balance">
          {wei2ether(balances[assetSelected].resardis, 2)} {assetSelected}
        </div>
        <div>
          <input type="text" value={amount} onChange={updateAmount} />
        </div>
      </div>
      <div className="deposit-withdraw-buttons">
        <button
          className="transferbutton"
          id={BUTTON_ID}
          onClick={handleWithdraw}
        >
          Withdraw
        </button>
      </div>
    </div>
  );
};

export default connector(Withdraw);
