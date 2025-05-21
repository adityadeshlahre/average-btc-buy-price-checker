import mempool from "@mempool/mempool.js";
import axios from "axios";
// import { useQueryClient } from "@tanstack/react-query";
import type { AddressTransectionItem } from "types/addressTransections";
import type { coinMarketCap } from "types/coinMarketCap";
const {
  bitcoin: { addresses },
} = mempool();

// const queryClient = useQueryClient();

export const getAddressTxs = async (
  address: string,
): Promise<AddressTransectionItem[]> => {
  const addressTx = await addresses.getAddressTxs({ address });
  return addressTx;
};

// const transectionURL: string = "https://api.blockcypher.com/v1/btc/main/txs/";
// const transectionURL: string = "https://www.blockchain.com/explorer/transactions/btc/";
// const transectionURL: string = "https://blockstream.info/api/blocks/";
const transectionURL: string = "https://mempool.space/api/tx/";


export const getTransectionFromHashId = async (
  hashId: string | string[],
): Promise<AddressTransectionItem[]> => {
  const results: AddressTransectionItem[] = [];

  if (Array.isArray(hashId)) {
    for (const hash of hashId) {
      try {
        await new Promise((r) => setTimeout(r, 1000));
        const res = await axios.get(`${transectionURL}${hash}`);
        results.push(res.data as AddressTransectionItem);
        await new Promise((r) => setTimeout(r, 1000));
      } catch (err) {
        console.error(`Failed to fetch transaction for hash: ${hash}`, err);
      }
    }
    return results;
  } else {
    const response = await axios.get(`${transectionURL}${hashId}`);
    return [response.data as AddressTransectionItem];
  }
};

export const getTimeStampsFromHash = async (hash: string): Promise<number> => {
  const transections: AddressTransectionItem[] = await getTransectionFromHashId(hash);

  if (transections.length > 0) {
    const date = new Date(transections[0].status.block_time);
    console.log("date", date);
    const timeStamp = Math.floor(date.getTime() / 1000);
    return timeStamp;
  }

  throw new Error("Transaction not found");
};

// const priceTimeStampUrl: string =
//   "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=usd&"; //from=1712456361&to=1712459961";

// const priceTimeStampUrl: string = "https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/historical"

export const getPriceAtTimeStamp = async (
  timeStamp: number,
): Promise<{ timeStamp: Date | number; price: string }> => {

  console.log("timeStamp", timeStamp);
  const from = new Date((timeStamp - 1800) * 1000).toISOString();
  const to = new Date((timeStamp + 1800) * 1000).toISOString();

  const response = await axios.get('/api/get-btc-history', {
    params: {
      time_start: from,
      time_end: to,
    },
  });

  const data : coinMarketCap = response.data;

  const quotes = data.data.quotes;

  const closest = quotes.reduce((prev, curr) => {
    const prevDiff = Math.abs(new Date(prev.timestamp).getTime() / 1000 - timeStamp);
    const currDiff = Math.abs(new Date(curr.timestamp).getTime() / 1000 - timeStamp);
    return currDiff < prevDiff ? curr : prev;
  });

  return {
    timeStamp: new Date(closest.timestamp),
    price: closest.quote.USD.price.toFixed(2),
  };
};

export const checkAddressExist = async (
  address: string,
): Promise<
  | {
      exist: boolean;
      address: string;
      avgPrice: string;
    }
  | { message: string }
> => {
  const addressExist = localStorage.getItem("address");
  const avgPriceExist = localStorage.getItem("avgPrice");
  if (addressExist === address) {
    return {
      exist: true,
      avgPrice: avgPriceExist ?? "",
      address: address,
    };
  }
  return {
    message: "Address not found",
  };
};
