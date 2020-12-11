import React, { useState } from 'react'
import { ethers } from 'ethers'
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from '../reducers'
import { BalancesType } from '../reducers/funds'
import { wei2ether } from '../helpers'
import '../scss/Transfer.scss'
import { AccountActions, selectAsset } from '../actions/walletActions'
import { BigNumber } from 'bignumber.js'
import TransferHistory from './TransferHistory'
import { withdraw, deposit, depositAfterApprove } from '../contracts'
import { Network } from '../constants/networks'

interface StateProps {
  accountAddress: string,
  assetSelected: string,
  balances: BalancesType,
  api: any,
  network: Network,
}

const mapStateToProps = (state: RootState):StateProps => ({
  accountAddress: state.funds.accountAddress,
  assetSelected: state.funds.assetSelected,
  balances: state.funds.balances,
  api: state.contract.contractAPI,
  network: state.contract.network,
})

const mapDispatchToProps = (dispatch:any) => ({
  selectAsset: (asset:string):AccountActions => dispatch(selectAsset(asset)),
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

const QuestionMark = () => (
  <div className="question-mark" style={{ marginRight: '8px' }}>?</div>
)

const BalancesConnected = ({
  balances,
  assetSelected,
  selectAsset,
  accountAddress,
}:PropsFromRedux) => {
  //console.log('+++',balances, assetSelected, )
  return (
    <div className="pt-2">
      <div className="form-row mb-3">
        <div className="col-4">
          <select
            className="form-control form-control-sm transfer-asset-select"
            value={assetSelected}
            onChange={e => selectAsset(e.target.value)}
          >
            {Object.keys(balances).map((assetSymbol) => (
              <option key={assetSymbol} value={assetSymbol}>{assetSymbol}</option>
              ))}
          </select>
        </div>
      </div>

      <div className="balances-details">
        <h3 className="wallet-address">Account</h3>
        <p>{accountAddress}</p>

        <h3>Balances On</h3>
        <div>
          <span>Mainnet: </span>
          {balances[assetSelected].mainnet.toFixed()} {assetSelected}
        </div>
        <div>
          <span>Side Chain: </span>
          {wei2ether(balances[assetSelected].sidechain, 10)} {assetSelected}
        </div>
        <div>
          <span>Resardis: </span>
          {wei2ether(balances[assetSelected].resardis, 10)} {assetSelected}
        </div>
      </div>

    </div>
  )
}

const Balances = connector(BalancesConnected)

const getSelectedAssetAddress = (assetSelected:string, network:Network) =>
  Object.keys(network.tokens).find(address => network.tokens[address] === assetSelected)

const TransferFormConnected = ({
  api,
  balances,
  assetSelected,
  accountAddress,
  network
}:PropsFromRedux) => {
  const [ transferData, setTransferData ] = useState({
    transferFrom: 'sidechain',
    transferTo: 'resardis',
    amount: new BigNumber(0).toFixed(12),
    fee: new BigNumber(0).toFixed(12),
    total: new BigNumber(0).toFixed(12),
    err: '',
  })
  const DOMID = 'transferButtonDOMID'

  const updateTransferData = (e:any) => {
    // disallow non-BigNumber values in amount
    if (e.target.name === 'amount') {
      if (e.target.value !== '' && new BigNumber(e.target.value).toString() === 'NaN') return
    }

    let newData = { ...transferData, err: '', [e.target.name]: e.target.value}
    const { amount, fee } = newData
    const newTotal = new BigNumber(amount).plus(new BigNumber(fee))
    newData.total = newTotal.toFixed(12)

    console.log(wei2ether(newTotal), wei2ether(balances[assetSelected][newData.transferFrom]))
    if (newTotal.gt(balances[assetSelected][newData.transferFrom].div((1e+18)))) {
      newData.err = 'Not enough funds'
    }

    const buttonElement = document.getElementById(DOMID)
    if (buttonElement) buttonElement.innerHTML = 'Transfer'

    setTransferData(newData)
  }

  return (
    <div>

    <div className="transfer-selects mb-3">
      <form>
        <div className="form-row justify-content-between">
          <div className="col-4">
            <div className="text-center mb-1">
              <span>From</span>
            </div>
            <select name="transferFrom" className="form-control form-control-sm transfer-asset-select"
              value={transferData.transferFrom}
              onChange={e => updateTransferData(e)}
            >
              <option value="mainnet">Mainnet</option>
              <option value="sidechain">Side Chain</option>
              <option value="resardis">Resardis</option>
            </select>
          </div>
          <div className="col-4">
            <div className="text-center mb-1">
              <span>To</span>
            </div>
            <select name="transferTo" className="form-control form-control-sm transfer-asset-select"
              value={transferData.transferTo}
              onChange={e => updateTransferData(e)}
            >
              {transferData.transferFrom !== 'mainnet' && <option value="mainnet">Mainnet</option>}
              {transferData.transferFrom !== 'sidechain' && <option value="sidechain">Side Chain</option>}
              {transferData.transferFrom !== 'resardis' && <option value="resardis">Resardis</option>}
            </select>
          </div>
        </div>
      </form>
    </div>

    <div className="transfer-details">
      <div className="form-group row justify-content-between">
        <label htmlFor="inputtransferamount"
          className="col-4 col-form-label col-form-label-sm">
            Amount (
            {wei2ether(balances[assetSelected][transferData.transferFrom])}
            &nbsp;
            {assetSelected})
        </label>
        <div className="col-8">
          <div className="input-group input-group-sm mb-2">
            <div className="input-group-prepend">
              <span className="input-group-text">00000 USD</span>
            </div>
            <input className="form-control"
              id="inputtransferamount" name="amount" type="text"
              value={transferData.amount}
              onChange={e => updateTransferData(e)}
            />
          </div>
        </div>
        {transferData.err && (
          <div className="form-amount-error">
            Not enough {assetSelected} for this transfer
          </div>
        )}
      </div>

      <div className="form-group row justify-content-between">
        <label htmlFor="inputtransferfee"
          className="col-4 col-form-label col-form-label-sm">
            Fee
        </label>
        <div className="col-8">
          <div className="input-group input-group-sm mb-2">
            <div className="input-group-prepend">
              <span className="input-group-text">00000 USD</span>
            </div>
            <input className="form-control"
              id="inputtransferfee" type="text"
              value={transferData.fee}
              disabled
            />
          </div>
        </div>
      </div>

      <div className="form-group row justify-content-between">
        <label htmlFor="inputtransfertotal"
          className="col-4 col-form-label col-form-label-sm">
            Total
        </label>
        <div className="col-8">
          <div className="input-group input-group-sm mb-2">
            <div className="input-group-prepend">
              <span className="input-group-text">00000 USD</span>
            </div>
            <input className="form-control"
              id="inputtransfertotal" type="text"
              value={transferData.amount}
              disabled
            />
          </div>
        </div>
      </div>
    </div>

    <div className="transfer-button">
      <button id={DOMID}
        className="btn px-4 py-1 btn-transfer"
        onClick={() => {
          if (!transferData.err) {
            const tokenAddress = getSelectedAssetAddress(assetSelected, network) || ''
            const buttonElement = document.getElementById(DOMID)

            if (buttonElement) buttonElement.innerHTML = 'Transfer starting...'

            if (transferData.transferFrom === 'resardis') {
              withdraw(api, transferData.amount, tokenAddress, DOMID)
            } else if (transferData.transferTo === 'resardis') {
              if (tokenAddress === ethers.constants.AddressZero) {
                deposit(
                  api,
                  transferData.amount,
                  tokenAddress,
                  accountAddress,
                  network,
                  DOMID)
              } else {
                depositAfterApprove(
                  api,
                  transferData.amount,
                  tokenAddress,
                  accountAddress,
                  network,
                  DOMID
                )
              }
            }
          }
        }
      }>Transfer</button>
    </div>
  </div>
  )
}
const TransferForm = connector(TransferFormConnected)

const Transfer = () => (
  <div className="row py-3">

    <div className="col col-12 pb-4">
      <h2 className="mb-3">Transfer Assets</h2>
      <div className="row justify-content-around">
        <div className="col col-md-auto">
          <Balances />
        </div>
        <div className="col col-md-auto">
          <TransferForm />
        </div>
      </div>
    </div>

    <div className="col col-12">
      <TransferHistory />
    </div>
  </div>
)

export default connector(Transfer)
