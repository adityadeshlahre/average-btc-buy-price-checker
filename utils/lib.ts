import mempool from "@mempool/mempool.js";
import axios from "axios";
import type { TransectionHash } from "types/transectionHash";
  const {
    bitcoin: { addresses },
  } = mempool();


export const getAddressTxs = async (address: string) => {


  const addressTx = await addresses.getAddressTxs({ address });
  return addressTx;
};

const transectionURL : string = "https://api.blockcypher.com/v1/btc/main/txs/";

export const getTransection = async (
  hashId: string | string[]
): Promise<TransectionHash | TransectionHash[]> => {
  if (Array.isArray(hashId)) {
    const requests = hashId.map((hash) =>
      axios.get(`${transectionURL}${hash}`).then(res => res.data as TransectionHash)
    );
    const results = await Promise.all(requests);

    return results.length === 1 ? results[0] : results;
  } else {
    const response = await axios.get(`${transectionURL}${hashId}`);
    return response.data as TransectionHash;
  }
};
