import React, { useState } from 'react'
import { ethers } from 'ethers'
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from '../reducers'
import { BalancesType } from '../reducers/funds'
import { wei2ether } from '../helpers'
import '../css/Transfer.css'
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
    <div className="container-balances">

      <h1>Transfer Assets<QuestionMark/></h1>

      <select
        className="transfer-asset-select"
        value={assetSelected}
        onChange={e => selectAsset(e.target.value)}
      >
        {Object.keys(balances).map((assetSymbol) => (
          <option key={assetSymbol} value={assetSymbol}>{assetSymbol}</option>
          ))}
      </select>

      <div className="balances-details">
        <div className="wallet-address">
          <span>My Wallet</span><QuestionMark/>
          <span>{accountAddress}</span>
        </div>
        <div>
          <span>Mainnet Balance</span><QuestionMark/>
          {balances[assetSelected].mainnet.toFixed()} {assetSelected}
        </div>
        <div>
          <span>Side Chain Balance</span><QuestionMark/>
          {wei2ether(balances[assetSelected].sidechain, 10)} {assetSelected}
        </div>
        <div>
          <span>Resardis Balance</span><QuestionMark/>
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
    <div className="container-transfer-form">

      <div className="selects-labels">
        <span>From</span>
        <span>To</span>
      </div>

      <div className="transfer-selects">
        <select name="transferFrom" className="transfer-asset-select"
          value={transferData.transferFrom}
          onChange={e => updateTransferData(e)}
        >
          <option value="mainnet">Mainnet</option>
          <option value="sidechain">Side Chain</option>
          <option value="resardis">Resardis</option>
        </select>

        <select name="transferTo" className="transfer-asset-select"
          value={transferData.transferTo}
          onChange={e => updateTransferData(e)}
        >
          {transferData.transferFrom !== 'mainnet' && <option value="mainnet">Mainnet</option>}
          {transferData.transferFrom !== 'sidechain' && <option value="sidechain">Side Chain</option>}
          {transferData.transferFrom !== 'resardis' && <option value="resardis">Resardis</option>}
        </select>
      </div>

      <div className="transfer-details">
        <div>
          <div>Amount (
            {wei2ether(balances[assetSelected][transferData.transferFrom])}
            &nbsp;
            {assetSelected})
          </div>
          {transferData.err && (
            <div className="form-amount-error">
              Not enough {assetSelected} for this transfer
            </div>
          )}
          <span>00000 USD</span>
          <input type="text" name="amount"
            value={transferData.amount}
            onChange={e => updateTransferData(e)} />
        </div>
        <div>
          <div>Fee</div>
          <span>00000 USD</span>
          <input type="text" disabled value={transferData.fee} /></div>
        <div>
          <div>Total</div>
          <span>00000 USD</span>
          <input type="text" disabled value={transferData.amount} /></div>
      </div>

      <div className="transfer-button">
        <button id={DOMID}
          onClick={() => {
            if (!transferData.err) {
              const tokenAddress = getSelectedAssetAddress(assetSelected, network) || ''
              const buttonElement = document.getElementById(DOMID)

              if (buttonElement) buttonElement.innerHTML = 'transfer starting...'

              if (transferData.transferFrom === 'resardis') {
                withdraw(api, transferData.amount, tokenAddress, DOMID)
              } else if (transferData.transferTo === 'resardis') {
                if (tokenAddress === ethers.constants.AddressZero) {
                  deposit(api, transferData.amount, tokenAddress, DOMID)
                } else {
                  depositAfterApprove(
                    api,
                    transferData.amount,
                    tokenAddress,
                    accountAddress,
                    network.contract,
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
  <div className="container container-transfer">

    <div className="container-transfer-inner">
      <Balances />
      <TransferForm />
    </div>

    <TransferHistory />

  </div>

)

export default connector(Transfer)
