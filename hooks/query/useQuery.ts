import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { queryKey } from "hooks/queryKey";

export const useGetTransactionsFromAddress = (address : string) => {

    const handleGetTransactionsFromAddress = async () => {
        if (!address) {
            throw new Error('Address is required');
        }
        const response = await axios(`https://mempool.space/api/address/${address}/txs`);
        if (response.status !== 200) {
            throw new Error('Network response was not ok');
        }
        return response.data;
    };

    const queryResult = useQuery({
        queryKey: [queryKey.getTransectionsFromAddress, address],
        queryFn: handleGetTransactionsFromAddress,
        enabled: !!address,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1,
        retryDelay: 1000,
    });

    if (queryResult.isError) {
        console.error('Error fetching transactions:', queryResult.error);
    }

    return {
        handleGetTransactionsFromAddress
    }
};