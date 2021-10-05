import { BigNumber as BN } from "bignumber.js";
import { tokenABIs, getTokenNameFromAddress } from "../constants/networks";
import abiERC20Standard from "../abi/ERC20Standard.json";
import { ethers } from "ethers";
import {
  addActiveOfferID,
  removeActiveOfferID,
} from "../actions/contractActions";
import {
  setAssetBalance,
  setIsWalletEnabled,
  setAccountAddress,
} from "../actions/walletActions";
import { BigNumber } from "bignumber.js";
import store from "../store";

// TODO - change Function to correct type
const getTokenBalancesFromDEX = (
  contractAPI: any,
  network: any,
  account: string
) => {
  // function balanceOf(address token, address user) external view returns (uint256) {

  Object.keys(network.tokens).forEach((tokenAddress) => {
    contractAPI.functions
      .balanceOf(tokenAddress, account)
      .then((balances: any) => {
        //console.log(network.tokens[tokenAddress], balances)
        store.dispatch(
          setAssetBalance({
            symbol: network.tokens[tokenAddress],
            source: "resardis",
            balance: new BN(balances[0].toString()),
          })
        );
      });
    contractAPI.functions
      .balanceInUse(tokenAddress, account)
      .then((balances: any) => {
        //console.log(network.tokens[tokenAddress], balances)
        store.dispatch(
          setAssetBalance({
            symbol: network.tokens[tokenAddress],
            source: "resardisInUse",
            balance: new BN(balances[0].toString()),
          })
        );
      });
  });
};

const getTokenBalancesFromSidechain = (
  provider: any,
  network: any,
  account: string
) => {
  Object.keys(network.tokens).forEach((tokenAddress) => {
    if (tokenAddress === ethers.constants.AddressZero) return;

    const abi =
      tokenAddress in tokenABIs ? tokenABIs[tokenAddress] : abiERC20Standard;
    let tokenContract = new ethers.Contract(
      tokenAddress,
      abi,
      provider.getSigner()
    );

    tokenContract.functions
      .balanceOf(account)
      .then((balance: any) => {
        store.dispatch(
          setAssetBalance({
            symbol: network.tokens[tokenAddress],
            source: "sidechain",
            balance: new BN(balance.toString()),
          })
        );
      })
      .catch((err) =>
        console.error(
          "Cannot call balanceOf",
          network.tokens[tokenAddress],
          tokenAddress,
          err
        )
      );
  });
};

export const getBalances = async (
  provider: any,
  contractAPI: any,
  account: string,
  network: any
) => {
  store.dispatch(setIsWalletEnabled(true));
  store.dispatch(setAccountAddress(account));

  // get balances of tokens added to DEX contract
  getTokenBalancesFromDEX(contractAPI, network, account);
  // get balances of tokens in the wallet
  getTokenBalancesFromSidechain(provider, network, account);

  const balance = await provider.getBalance(account);

  setAssetBalance({
    symbol: "ETH",
    source: network.name,
    balance: new BigNumber(balance.toString()),
  });
};

// TODO: isActive -> Redux, isActiveBatch
export const isActive = (contractAPI: any, offerID: number) => {
  return contractAPI.functions
    .isActive(offerID)
    .then((res: any) => {
      if (res.active) {
        store.dispatch(addActiveOfferID(offerID));
      } else {
        store.dispatch(removeActiveOfferID(offerID));
      }
    })
    .catch((err: any) => console.log("isActive caught!", err));
};

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
  quoteToken: string;
  baseToken: string;
  isBuy: boolean;
  amount: string;
  price: string;
  offerType: number;
};

export const createOrder = (
  contractAPI: any,
  offerData: OfferData,
  DOMID: string
) => {
  console.log("creating new offer:", offerData);
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

  contractAPI.on("LogMake", async (id: any, pair: string, maker: string) => {
    console.log("LogMake res", id.toString(), maker);
    if ((await contractAPI.signer.getAddress()) === maker) {
      updateButton(DOMID, "Done!");
      store.dispatch(addActiveOfferID(id.toNumber()));
    }
  });
  contractAPI.on(
    "LogTake",
    async (
      id: any,
      pair: string,
      maker: string,
      payGem: string,
      buyGem: string,
      taker: string
    ) => {
      console.log("LogTake res", id.toString(), taker, DOMID);
      if ((await contractAPI.signer.getAddress()) === taker) {
        updateButton(DOMID, "Done!");
        store.dispatch(addActiveOfferID(id.toNumber()));
      }
    }
  );

  const { quoteToken, baseToken, isBuy, offerType } = offerData;

  const price = new BN(offerData.price);
  const amount = new BN(offerData.amount);

  const payGem: string = isBuy ? quoteToken : baseToken;
  const buyGem: string = isBuy ? baseToken : quoteToken;
  // to wei, basically
  const payAmt: BN = isBuy
    ? price.multipliedBy(amount).multipliedBy(1e18)
    : amount.multipliedBy(1e18);
  const buyAmt: BN = isBuy
    ? amount.multipliedBy(1e18)
    : price.multipliedBy(amount).multipliedBy(1e18);

  console.log(`--params', payAmt:
    ${payAmt.toFixed()}, payGem: ${payGem},
    buyGem: ${buyGem}, buyAmt: ${buyAmt.toFixed()}, offerType: ${offerType}`);

  //   function offer(
  //     uint256 payAmt, //maker (ask) sell how much
  //     address payGem, //maker (ask) sell which token
  //     uint256 buyAmt, //maker (ask) buy how much
  //     address buyGem, //maker (ask) buy which token
  //     uint256 pos, //position to insert offer, 0 should be used if unknown
  //     bool rounding, //match "close enough" orders?
  //     uint8 offerType
  // ) public returns (uint256) {
  updateButton(DOMID, "signing TX...");

  contractAPI
    .offer(
      payAmt.toFixed(),
      payGem,
      buyAmt.toFixed(),
      buyGem,
      0,
      true,
      offerType
    )
    .then(async (res: any) => {
      console.log("offer res:", res);
      updateButton(DOMID, "waiting for TX...");
    })
    .catch((e: any) => {
      updateButton(DOMID, "Error!");
      console.log("offer caught", e.code, e.message);
    });
};

const updateButton = (DOMID: string, text: string) => {
  const buttonElement = document.getElementById(DOMID);
  if (buttonElement) buttonElement.innerHTML = text;
};

export const cancelOrder = (
  contractAPI: any,
  offerID: number,
  DOMID: string
) => {
  console.log("cancelling", offerID);

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

  contractAPI.on("LogKill", (res: any) => {
    console.log("LogKill res", res, res.toNumber().toString());
    updateButton(DOMID, "confirmed!");
    store.dispatch(removeActiveOfferID(res.toNumber()));
  });

  contractAPI.functions
    .isActive(offerID)
    .then(async (res: any) => {
      console.log("isActive got:", res.active);
      const owner = await contractAPI.functions.getOwner(offerID);
      console.log("owner got:", owner);
      if (res.active) {
        updateButton(DOMID, "signing TX...");
        const res = await contractAPI.functions.cancel(offerID);
        updateButton(DOMID, "waiting for TX...");
        console.log("cancelling got:", res);
      } else {
        console.error("Cannot cancel inactive offer", offerID);
      }

      return res.active;
    })
    .catch((e: any) => {
      console.log("isActive caught!", e);
      updateButton(DOMID, "error!");
    });
};

export const withdraw = (
  contractAPI: any,
  amountToWithdraw: string,
  tokenAddress: string,
  DOMID: string
) => {
  // event LogWithdraw(
  //   address indexed token,
  //   address indexed user,
  //   uint256 amount,
  //   uint256 balance
  // );
  contractAPI.on(
    "LogWithdraw",
    async (
      tokenAddress: string,
      user: string,
      amount: BigNumber,
      balance: BigNumber
    ) => {
      console.log(
        "LogWithdraw res",
        tokenAddress,
        user,
        amount.toString(),
        balance.toString()
      );
      const signerAddress = await contractAPI.signer.getAddress();
      if (signerAddress === user) {
        console.log("LogWithdraw relevant event", signerAddress, user);
        store.dispatch(
          setAssetBalance({
            symbol: getTokenNameFromAddress(tokenAddress),
            source: "resardis",
            balance: new BN(balance.toString()),
          })
        );
        updateButton(DOMID, "Transfer: done");
      } else {
        console.log("LogWithdraw ignoring", signerAddress, user);
      }
    }
  );

  console.log(`withdrawing ${amountToWithdraw} of ${tokenAddress}`);
  const amount: BN = new BN(amountToWithdraw).multipliedBy(1e18);

  updateButton(DOMID, "signing TX...");

  if (tokenAddress === ethers.constants.AddressZero) {
    // function withdraw(uint256 amount) external {
    return contractAPI.functions
      .withdraw(amount.toFixed())
      .then((res: any) => {
        updateButton(DOMID, "waiting for TX...");
        console.log("---withdraw 1", res);
      })
      .catch((err: any) => {
        console.log("Withdrawing failed", err);
        updateButton(DOMID, "error!");
      });
  } else {
    // function withdrawToken(address token, uint256 amount) external {
    return contractAPI.functions
      .withdrawToken(tokenAddress, amount.toFixed())
      .then((res: any) => {
        updateButton(DOMID, "waiting for TX...");
        console.log("---withdraw 2", res);
      })
      .catch((err: any) => {
        console.log("Withdrawing failed", err);
        updateButton(DOMID, "error!");
      });
  }
};

export const deposit = (
  contractAPI: any,
  amountToDeposit: string,
  tokenAddress: string,
  DOMID: string
) => {
  //   emit LogDeposit(
  //     address(0),
  //     msg.sender,
  //     msg.value,
  //     tokens[address(0)][msg.sender]
  // );

  contractAPI.on(
    "LogDeposit",
    async (
      tokenAddress: string,
      user: string,
      amount: BigNumber,
      balance: BigNumber
    ) => {
      console.log(
        "LogDeposit res",
        tokenAddress,
        user,
        amount.toString(),
        balance.toString()
      );
      if ((await contractAPI.signer.getAddress()) === user) {
        store.dispatch(
          setAssetBalance({
            symbol: getTokenNameFromAddress(tokenAddress),
            source: "resardis",
            balance: new BN(balance.toString()),
          })
        );
        updateButton(DOMID, "Transfer: done");
      }
    }
  );

  console.log(`depositing ${amountToDeposit} of ${tokenAddress}`);
  const amount: BN = new BN(amountToDeposit).multipliedBy(1e18);

  updateButton(DOMID, "signing TX...");

  if (tokenAddress === ethers.constants.AddressZero) {
    // function deposit() external payable {
    return contractAPI.functions
      .deposit({
        gasLimit: 500000,
      })
      .then((res: any) => {
        updateButton(DOMID, "waiting for TX...");
        console.log("---deposit 1", res);
      })
      .catch((err: any) => {
        updateButton(DOMID, "error!");
        console.log("Depositing failed", err);
      });
  } else {
    // function depositToken(address token, uint256 amount) external {
    // remember to call Token(address).approve(this, amount)
    // or this contract will not be able to do the transfer on your behalf.

    return contractAPI.functions
      .depositToken(tokenAddress, amount.toFixed(), {
        gasLimit: 500000,
      })
      .then((res: any) => {
        updateButton(DOMID, "waiting for TX...");
        console.log("---deposit 2", res);
      })
      .catch((err: any) => {
        updateButton(DOMID, "error!");
        console.log("Depositing failed", err);
      });
  }
};

const allowance = (
  accountAddress: string,
  tokenAddress: string,
  resardisAddress: string
) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const abi =
    tokenAddress in tokenABIs ? tokenABIs[tokenAddress] : abiERC20Standard;
  let tokenContract = new ethers.Contract(
    tokenAddress,
    abi,
    provider.getSigner()
  );
  return tokenContract.functions
    .allowance(resardisAddress, accountAddress, {
      gasLimit: 500000,
    })
    .then((res: any) => {
      console.log("--allowance result", res);
    })
    .catch((err) => {
      console.error(
        "Cannot call allowance ovr",
        accountAddress,
        resardisAddress,
        err
      );
    });
};

export const depositAfterApprove = (
  contractAPI: any,
  amountToDeposit: string,
  tokenAddress: string,
  accountAddress: string,
  resardisAddress: string,
  DOMID: string
) => {
  console.log(
    "depositAfterApprove",
    amountToDeposit,
    tokenAddress,
    accountAddress,
    resardisAddress
  );
  //allowance(accountAddress, tokenAddress, resardisAddress)
  //console.log('past allowance')

  const amount: BN = new BN(amountToDeposit).multipliedBy(1e18);

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const abi =
    tokenAddress in tokenABIs ? tokenABIs[tokenAddress] : abiERC20Standard;
  let tokenContract = new ethers.Contract(
    tokenAddress,
    abi,
    provider.getSigner()
  );

  //function allowance(address owner, address spender) external view returns (uint256);

  // tokenContract.functions.allowance(accountAddress, resardisAddress, {
  //   gasLimit: 1000000000
  // })
  tokenContract.functions
    .approve(resardisAddress, amount.toFixed(), {
      gasLimit: 500000,
    })
    .then(async (res: any) => {
      console.log("--deposit approved!", amountToDeposit, res);
      //await allowance(accountAddress, tokenAddress, resardisAddress)
      await deposit(contractAPI, amountToDeposit, tokenAddress, DOMID);
      console.log("all done");
    })
    .catch((err) => {
      console.error(
        "Cannot call allowance",
        accountAddress,
        resardisAddress,
        err
      );
    });
};

export const getBestOffer = (contractAPI: any, sellGem: any, buyGem: any) => {
  if (contractAPI && sellGem && buyGem) {
    console.log(sellGem, buyGem);
    contractAPI.functions.getOfferCount(sellGem, buyGem).then((res: any) => {
      console.log(res);
    });
  }
};
