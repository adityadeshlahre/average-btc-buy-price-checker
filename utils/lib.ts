import mempool from "@mempool/mempool.js";
import axios from "axios";
// import { useQueryClient } from "@tanstack/react-query";
import type { AddressTransectionItem } from "types/addressTransections";
import type { TransectionHashItems } from "types/transectionHash";
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
const transectionURL: string = "https://www.blockchain.com/explorer/transactions/btc/";

export const getTransectionFromHashId = async (
  hashId: string | string[],
): Promise<TransectionHashItems[]> => {
  const results: TransectionHashItems[] = [];

  if (Array.isArray(hashId)) {
    for (const hash of hashId) {
      try {
        await new Promise((r) => setTimeout(r, 1000));
        const res = await axios.get(`${transectionURL}${hash}`);
        results.push(res.data as TransectionHashItems);
        await new Promise((r) => setTimeout(r, 1000));
      } catch (err) {
        console.error(`Failed to fetch transaction for hash: ${hash}`, err);
      }
    }
    return results;
  } else {
    const response = await axios.get(`${transectionURL}${hashId}`);
    return [response.data as TransectionHashItems];
  }
};

export const getTimeStampsFromHash = async (hash: string): Promise<number> => {
  const transection = await getTransectionFromHashId(hash);
  if (
    transection &&
    !Array.isArray(transection) &&
    (transection as TransectionHashItems).confirmed
  ) {
    const date = new Date((transection as TransectionHashItems).confirmed);
    const timeStamp = Math.floor(date.getTime() / 1000);
    return timeStamp;
  }
  throw new Error("Transection not found");
};

const priceTimeStampUrl: string =
  "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=usd&"; //from=1712456361&to=1712459961";

export const getPriceAtTimeStamp = async (
  timeStamp: number,
): Promise<{ timeStamp: Date | number; price: string }> => {
  const from = timeStamp - 1800;
  const to = timeStamp + 1800;

  const response = await axios.get(`${priceTimeStampUrl}from=${from}&to=${to}`);

  const data = response.data;

  const closest = data.prices.reduce((prev: number[], curr: number[]) => {
    return Math.abs(curr[0] - timeStamp) < Math.abs(prev[0] - timeStamp)
      ? curr
      : prev;
  });

  return {
    timeStamp: new Date(closest[0]),
    price: closest[1],
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
