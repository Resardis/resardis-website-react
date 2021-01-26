import { BigNumber as BN } from 'bignumber.js'
import { tokenABIs, getTokenNameFromAddress } from '../constants/networks'
//import abiERC20Standard from '../abi/ERC20Standard.json'
import abiERC20Standard from '../abi/ERC20MintableX.json'
import { ethers } from 'ethers'
import { addActiveOfferID, removeActiveOfferID } from '../actions/contractActions'
import { setAssetBalance, setAccountAddress } from '../actions/walletActions'
import { BigNumber } from 'bignumber.js'
import store from '../store'
// @ts-ignore
import WalletConnectProvider from '@maticnetwork/walletconnect-provider'
import Web3 from 'web3'
import abiResardis from '../abi/Resardis.json'
import { Network } from '../constants/networks'

// TODO - change Function to correct type
const getTokenBalancesFromDEX = (contractAPI:any, network:any, account:string) => {
  // function balanceOf(address token, address user) external view returns (uint256) {

  Object.keys(network.tokens).forEach(tokenAddress => {
    // console.log('Getting DEX balance of', tokenAddress, account, contractAPI)
    contractAPI.methods
    .balanceOf(tokenAddress, account)
    .call()
    .then((balance:any) => {
      // if (tokenAddress === '0xfe4F5145f6e09952a5ba9e956ED0C25e3Fa4c7F1')
      //console.log('Got DEX balance of', tokenAddress, account, balance, new BN(balance.toString()))
      //console.log(network.tokens[tokenAddress], balances)
      store.dispatch(setAssetBalance({
        symbol: getTokenNameFromAddress(tokenAddress),
        source: 'resardis',
        balance: new BN(balance.toString())
      }))
    })
    .catch((err:any) => {
      console.error('Cannot get DEX balance of token', tokenAddress, account, err)
    })

    contractAPI.methods
    .balanceInUse(tokenAddress, account)
    .call()
    .then((balances:any) => {
      //console.log(network.tokens[tokenAddress], balances)
      store.dispatch(setAssetBalance({
        symbol: getTokenNameFromAddress(tokenAddress),
        source: 'resardisInUse',
        balance: new BN(balances[0].toString())
      }))
    })
    .catch((err:any) => {
      console.error('Cannot get DEX balance in use of token', tokenAddress, account, err)
    })

  })
}

const getTokenBalanceFromSidechain = (accountAddress: string, tokenAddress:string) => {
  const abi = (tokenAddress in tokenABIs) ? tokenABIs[tokenAddress] : abiERC20Standard

  let tokenContractAPI = new window.web3.eth.Contract(abi, tokenAddress)

  tokenContractAPI.methods
  .balanceOf(accountAddress)
  .call()
  .then((balance:any) => {
    //console.log('Got balance of token:', tokenAddress, balance)
    store.dispatch(setAssetBalance({
      symbol: getTokenNameFromAddress(tokenAddress),
      source: 'sidechain',
      balance: new BN(balance.toString())
    }))
  })
  .catch((err:any) => {
    console.error('Cannot get balance of token', accountAddress, err)
  })
}

const getTokenBalancesFromSidechain = (network:any, account:string) => {
  Object.keys(network.tokens).forEach(tokenAddress => {
    if (tokenAddress === ethers.constants.AddressZero) return
    getTokenBalanceFromSidechain(account, tokenAddress)
  })
}

export const getBalances = async (
  contractAPI:any,
  account:string,
  network:Network,
) => {
  // store.dispatch(setIsWalletEnabled(true))
  // store.dispatch(setAccountAddress(account))

  // get balances of tokens added to DEX contract
  getTokenBalancesFromDEX(contractAPI, network, account)
  // get balances of tokens in the wallet
  getTokenBalancesFromSidechain(network, account)

  const balance = await window.web3.eth.getBalance(account)

  setAssetBalance({
    symbol: 'ETH',
    source: network.name,
    balance: new BigNumber(balance.toString()),
  })

}

// TODO: isActive -> Redux, isActiveBatch
export const isActive = (contractAPI:any, offerID:number) => {
  return contractAPI.methods
    .isActive(offerID)
    .call()
    .then((res:any) => {
      if (res.active) {
        store.dispatch(addActiveOfferID(offerID))
      } else {
        store.dispatch(removeActiveOfferID(offerID))
      }
    })
    .catch((err:any) => console.log('isActive caught!', err))
}

// function offer(
//   uint256 payAmt, //maker (ask) sell how much
//   address payGem, //maker (ask) sell which token
//   uint256 buyAmt, //maker (ask) buy how much
//   address buyGem, //maker (ask) buy which token
//   uint256 pos, //position to insert offer, 0 should be used if unknown
//   bool rounding, //match "close enough" orders?
//   uint8 offerType
// ) public returns (uint256) {

type OfferData = {
  quoteToken:string,
  baseToken:string,
  isBuy:boolean,
  amount:string,
  price:string,
  offerType:number,
}

export const createOrder = (contractAPI:any, offerData:OfferData, accountAddress:string, DOMID:string) => {
  console.log('creating new offer:', contractAPI, offerData)
//   event LogMake(
//     uint256 indexed id,
//     bytes32 indexed pair,
//     address indexed maker,
//     address payGem,
//     address buyGem,
//     uint128 payAmt,
//     uint128 buyAmt,
//     uint64 timestamp,
//     uint8 offerType
// );

// event LogTake(
//     uint256 id,
//     bytes32 indexed pair,
//     address indexed maker,
//     address payGem,
//     address buyGem,
//     address indexed taker,
//     uint128 takeAmt,
//     uint128 giveAmt,
//     uint64 timestamp,
//     uint8 offerType
// );

  contractAPI.once('LogMake', async (id:any, res:any) => {
    // console.log('LogMake res', id.toString(), maker)
    console.log('LogMake res', res.returnValues.maker)
    if (res.returnValues.maker === accountAddress) {
      updateButton(DOMID, 'Done!')
      store.dispatch(addActiveOfferID(parseInt(res.returnValues.id)))
    }
  })
  contractAPI.once('LogTake', async (id:any, res:any) => {
    // console.log('LogTake res', res.returnValues)
    if (res.returnValues.taker === accountAddress) {
      updateButton(DOMID, 'Done!')
      store.dispatch(addActiveOfferID(parseInt(res.returnValues.id)))
    } else {
      console.log('LogTake mismatched addresses', res.returnValues.taker, accountAddress)
    }
  })

  const { quoteToken, baseToken, isBuy, offerType } = offerData

  const price = new BN(offerData.price)
  const amount = new BN(offerData.amount)

  const payGem:string = isBuy ? quoteToken : baseToken
  const buyGem:string = isBuy ? baseToken : quoteToken
  // to wei, basically
  const payAmt:BN = isBuy ? price.multipliedBy(amount).multipliedBy(1e+18) : amount.multipliedBy(1e+18)
  const buyAmt:BN = isBuy ? amount.multipliedBy(1e+18) : price.multipliedBy(amount).multipliedBy(1e+18)

  // console.log(`--params', payAmt:
  //   ${payAmt.toFixed()}, payGem: ${payGem},
  //   buyGem: ${buyGem}, buyAmt: ${buyAmt.toFixed()}, offerType: ${offerType}`)

//   function offer(
//     uint256 payAmt, //maker (ask) sell how much
//     address payGem, //maker (ask) sell which token
//     uint256 buyAmt, //maker (ask) buy how much
//     address buyGem, //maker (ask) buy which token
//     uint256 pos, //position to insert offer, 0 should be used if unknown
//     bool rounding, //match "close enough" orders?
//     uint8 offerType
// ) public returns (uint256) {
  updateButton(DOMID, 'signing TX...')

  contractAPI.methods.offer(payAmt.toFixed(), payGem, buyAmt.toFixed(), buyGem, 0, true, offerType)
  .send({
    from: accountAddress
  })
  .then(async (res:any) => {
    console.log('offer res:', res)
    updateButton(DOMID, 'Done!')
    if ('LogMake' in res.events) {
      console.log('Offer', res.events.LogMake)
      store.dispatch(addActiveOfferID(parseInt(res.events.LogMake.returnValues.id)))
    }

  })
  .catch((e:any) => {
    updateButton(DOMID, 'Error!')
    console.log('offer caught', e.code, e.message)
  })
}

const updateButton = (DOMID:string, text:string) => {
  const buttonElement = document.getElementById(DOMID)
  if (buttonElement) buttonElement.innerHTML = text
  else console.warn('updateButton cannot find', DOMID)
}

export const cancelOrder = (contractAPI:any, offerID:number, DOMID:string) => {
  console.log('cancelling', offerID)

//   event LogKill(
//     uint256 indexed id,
//     bytes32 indexed pair,
//     address indexed maker,
//     address payGem,
//     address buyGem,
//     uint128 payAmt,
//     uint128 buyAmt,
//     uint64 timestamp
// );

  contractAPI.on( 'LogKill', (res:any) => {
    console.log('LogKill res', res, res.toNumber().toString())
    updateButton(DOMID, 'confirmed!')
    store.dispatch(removeActiveOfferID(res.toNumber()))
  })

  contractAPI.functions.isActive(offerID)
    .then(async (res:any) => {
      console.log('isActive got:', res.active)
      const owner = await contractAPI.functions.getOwner(offerID)
      console.log('owner got:', owner)
      if (res.active) {
        updateButton(DOMID, 'signing TX...')
        const res = await contractAPI.functions.cancel(offerID)
        updateButton(DOMID, 'waiting for TX...')
        console.log('cancelling got:', res)
      } else {
        console.error('Cannot cancel inactive offer', offerID)
      }

      return res.active
    })
    .catch((e:any) => {
      console.log('isActive caught!', e)
      updateButton(DOMID, 'error!')
    })

}

export const withdraw = (contractAPI:any, amountToWithdraw:string, tokenAddress:string, DOMID:string) => {
  // event LogWithdraw(
  //   address indexed token,
  //   address indexed user,
  //   uint256 amount,
  //   uint256 balance
  // );
  contractAPI.on('LogWithdraw', async (tokenAddress:string, user:string, amount:BigNumber, balance:BigNumber) => {
    console.log('LogWithdraw res', tokenAddress, user, amount.toString(), balance.toString())
    const signerAddress = await contractAPI.signer.getAddress()
    if (signerAddress === user) {
      console.log('LogWithdraw relevant event', signerAddress, user)
      store.dispatch(setAssetBalance({
        symbol: getTokenNameFromAddress(tokenAddress),
        source: 'resardis',
        balance: new BN(balance.toString())
      }))
      updateButton(DOMID, 'Transfer: done')
    } else {
      console.log('LogWithdraw ignoring', signerAddress, user)
    }
  })

  console.log(`withdrawing ${amountToWithdraw} of ${tokenAddress}`)
  const amount:BN = new BN(amountToWithdraw).multipliedBy(1e+18)

  updateButton(DOMID, 'signing TX...')

  if (tokenAddress === ethers.constants.AddressZero) {
    // function withdraw(uint256 amount) external {
    return contractAPI.functions.withdraw(amount.toFixed())
    .then((res:any) => {
      updateButton(DOMID, 'waiting for TX...')
      console.log('---withdraw 1', res)
    })
    .catch((err:any) => {
      console.log('Withdrawing failed', err)
      updateButton(DOMID, 'error!')
    })
  } else {
    // function withdrawToken(address token, uint256 amount) external {
    return contractAPI.functions.withdrawToken(tokenAddress, amount.toFixed())
    .then((res:any) => {
      updateButton(DOMID, 'waiting for TX...')
      console.log('---withdraw 2', res)
    })
    .catch((err:any) => {
      console.log('Withdrawing failed', err)
      updateButton(DOMID, 'error!')
    })
  }
}


// deposit(api, transferData.amount, tokenAddress, DOMID)
export const deposit = (
  contractAPI:any,
  amountToDeposit:string,
  tokenAddress:string,
  accountAddress: string,
  DOMID:string
) => {
  // emit LogDeposit(
  // token,
  // msg.sender,
  // amount,
  // tokens[token][msg.sender]
  // );

  contractAPI.once('LogDeposit', {
    filter: { user: accountAddress }
  }, (error:any, event:any) => {
    console.log(error, event)

    if (error) {
      updateButton(DOMID, 'error!')
      console.log('Depositing failed', error)
    } else {
      console.log('Depositing finished!')

      store.dispatch(setAssetBalance({
        symbol: getTokenNameFromAddress(tokenAddress),
        source: 'resardis',
        balance: new BN(event.returnValues.balance.toString())
      }))

      getTokenBalanceFromSidechain(accountAddress, tokenAddress)

      updateButton(DOMID, 'Transfer: done')
    }
  })

  console.log(`depositing ${amountToDeposit} of ${tokenAddress}`)
  const amount:BN = new BN(amountToDeposit).multipliedBy(1e+18)

  updateButton(DOMID, 'signing TX...')

////////////////////////////////////////////////////
// const maticProvider = new WalletConnectProvider(
//   {
//     host: `https://rpc-mumbai.matic.today`,
//     callbacks: {
//       onConnect: console.log('connected'),
//       onDisconnect: console.log('disconnected!')
//     }
//   }
// )
// const maticWeb3 = new Web3(maticProvider)
// const web3 = window.web3
// let contr = new web3.eth.Contract(abiResardis, '0xdf3786659dc64e343fFED27eD213Ed6138834B19')
////////////////////////////////////////////////////


  if (tokenAddress === ethers.constants.AddressZero) {
    // function deposit() external payable {
    return contractAPI.functions.deposit({
      gasLimit: 1500000
    }).send({
      from: accountAddress
    })
    .then((res:any) => {
      updateButton(DOMID, 'Waiting for TX...')
      console.log('---deposit 1', res)
    })
    .catch((err:any) => {
      updateButton(DOMID, 'error!')
      console.log('Depositing failed', err)
    })
  } else {
      // function depositToken(address token, uint256 amount) external {
      // remember to call Token(address).approve(this, amount)
      // or this contract will not be able to do the transfer on your behalf.

    return contractAPI.methods.depositToken(tokenAddress, amount.toFixed()
      //, { gasLimit: 1500000 }
      ).send({
        from: accountAddress
      })
      .then((res:any) => {
        //updateButton(DOMID, 'waiting for TX...')
        console.log('---deposit 2', res)
      })
      .catch((err:any) => {
        updateButton(DOMID, 'error!')
        console.log('Depositing failed', err)
      })
  }
}


const allowance = (accountAddress: string, tokenAddress:string, resardisAddress: string) => {
  const abi = (tokenAddress in tokenABIs) ? tokenABIs[tokenAddress] : abiERC20Standard
  let tokenContractAPI = new window.web3.eth.Contract(abi, tokenAddress)

  tokenContractAPI.methods
  .allowance(resardisAddress, accountAddress)
  .call()
  .then((res:any) => {
     console.log('Got allowance result, token:', tokenAddress, 'res', res)
  })
  .catch((err:any) => {
    console.error('Cannot call allowance', accountAddress, resardisAddress, err)
  })

}

export const depositAfterApprove = (
  contractAPI:any,
  amountToDeposit:string,
  tokenAddress:string,
  accountAddress: string,
  network: any,
  DOMID:string
) => {
  console.log('depositAfterApprove',
    'contractAPI:',contractAPI,
    'amountToDeposit:',amountToDeposit,
    'tokenAddress:',tokenAddress,
    'accountAddress:',accountAddress,
    'resardisAddress:', network.contract
  )
  const resardisAddress = network.contract

  // allowance(accountAddress, tokenAddress, resardisAddress)
  console.log('past allowance')

  const amount:BN = new BN(amountToDeposit).multipliedBy(1e+18)

  // prepare token's own contract for calling allowance/approval
  // const provider = new ethers.providers.Web3Provider(window.ethereum)
  const abi = (tokenAddress in tokenABIs) ? tokenABIs[tokenAddress] : abiERC20Standard
  // let tokenContract = new ethers.Contract(tokenAddress, abi, provider.getSigner())
  let tokenContractAPI = new window.web3.eth.Contract(abi, tokenAddress)

  // const x = tokenContractAPI.approve.sendTransaction(resardisAddress, )


  tokenContractAPI.methods.approve(resardisAddress, amount.toFixed()).send({from: accountAddress})
  // .once('transactionHash', (hash) => { console.log(hash); })
  // .once('receipt', (receipt) => { console.log(receipt); });

  .then(async (res:any) => {
    // just checking - allowance prints out the amount of tokens already approved
    // allowance(accountAddress, tokenAddress, resardisAddress)
    await deposit(contractAPI, amountToDeposit, tokenAddress, accountAddress, DOMID)
    console.log('all done')
  })
  .catch((err:any) => {
    console.error('Cannot deposit', accountAddress, resardisAddress, err)
  })

  // remember to call Token(address).approve(this, amount)

  //deposit(contractAPI, amountToDeposit, tokenAddress, DOMID)

}

