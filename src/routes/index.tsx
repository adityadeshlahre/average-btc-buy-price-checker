import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Store, useStore } from "@tanstack/react-store";
import { useEffect } from "react";
import type { AddressTransectionItem } from "types/addressTransections";
import {
	getAddressTxs,
	getPriceAtTimeStamp,
	getTimeStampsFromHash,
	getTransectionFromHashId,
} from "../../utils/lib";
import logo from "../logo.svg";
import { useGetTransactionsFromAddress } from "./../../hooks/query/useQuery";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const Route = createFileRoute("/")({
	component: App,
});

export const currentStore = new Store<{
	address: string;
}>({
	address: "",
});

export const getAddressTxsStore = new Store<{
	AddressTransectionItem: AddressTransectionItem[];
}>({
	AddressTransectionItem: [],
});

export const TransectionDetailsFromHashIds = new Store<{
	transectionHashIds: AddressTransectionItem[];
}>({
	transectionHashIds: [],
});

export const timeStampsAndPricesStore = new Store<{
	timeStamps: (Date | number)[];
	prices: string[];
}>({
	timeStamps: [],
	prices: [],
});

const updateStore = (address: string) => {
	currentStore.setState((prev) => ({
		...prev,
		address: address,
	}));
};

const updateGetAddressTxsStore = (transections: AddressTransectionItem[]) => {
	getAddressTxsStore.setState((prev) => ({
		...prev,
		AddressTransectionItem: [
			...prev.AddressTransectionItem,
			...(Array.isArray(transections) ? transections : [transections]),
		],
	}));
};

const updateTransectionDetailsFromHashIds = (
	transections: AddressTransectionItem[],
) => {
	TransectionDetailsFromHashIds.setState((prev) => ({
		...prev,
		transectionHashIds: [
			...prev.transectionHashIds,
			...(Array.isArray(transections) ? transections : [transections]),
		],
	}));
};

const updateTimeStampsAndPricesStore = (
	timeStamps: (Date | number)[],
	prices: string[],
) => {
	timeStampsAndPricesStore.setState((prev) => ({
		...prev,
		timeStamps: [
			...prev.timeStamps,
			...(Array.isArray(timeStamps) ? timeStamps : [timeStamps]),
		],
		prices: [...prev.prices, ...(Array.isArray(prices) ? prices : [prices])],
	}));
};

const queryClient = new QueryClient();

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<Render />
		</QueryClientProvider>
	);
}

function Render() {
	const { address } = useStore(currentStore);
	const { AddressTransectionItem } = useStore(getAddressTxsStore);
	const { transectionHashIds } = useStore(TransectionDetailsFromHashIds);
	const { timeStamps, prices } = useStore(timeStampsAndPricesStore);
	const { handleGetTransactionsFromAddress } = useGetTransactionsFromAddress(
		currentStore.state.address ?? "",
	);
	useEffect(() => {
		const fetchDetails = async () => {
			if (AddressTransectionItem.length > 0) {
				const details: AddressTransectionItem[] = [];

				for (const tx of AddressTransectionItem) {
					await sleep(2000);
					const detail = await getTransectionFromHashId(tx.txid);
					details.push(...(Array.isArray(detail) ? detail : [detail]));
				}

				updateTransectionDetailsFromHashIds(details);
			}
		};

		fetchDetails();
	}, [AddressTransectionItem]);

	useEffect(() => {
		const fetchTimestamps = async () => {
			if (transectionHashIds.length > 0) {
				for (const transection of transectionHashIds) {
					if (transection && !Array.isArray(transection)) {
						await sleep(2000);
						console.log("transection", transection.txid);
						const timeStamps: number = await getTimeStampsFromHash(
							transection.txid,
						);
						await sleep(2000);
						console.log("timeStamps", timeStamps);
						const { price, timeStamp } = await getPriceAtTimeStamp(timeStamps);

						updateTimeStampsAndPricesStore([timeStamp], [price]);
					}
				}
			}
		};

		setTimeout(() => {
			fetchTimestamps();
		}, 2000);
	}, [transectionHashIds]);

	return (
		<div className="text-center">
			<header className="min-h-screen flex flex-col items-center justify-center bg-[#282c34] text-white text-[calc(10px+2vmin)]">
				<img
					src={logo}
					className="h-[40vmin] pointer-events-none animate-[spin_20s_linear_infinite]"
					alt="logo"
				/>
				<p className="m-2 font-bold text-2xl">
					Get Average Buy Price Of Your Bitcoin Address.
				</p>
				<span className="flex flex-row items-center">
					<input
						type="text"
						placeholder="Enter Bitcoin Address"
						className="p-2 m-2 border-4 border-dashed border-gray-300 rounded"
						value={address ?? ""}
						onChange={(e) => {
							updateStore(e.target.value);
						}}
					/>
					<button
						type="button"
						className="p-2 m-2 font-semibold bg-teal-500 text-white rounded hover:bg-teal-700"
						onClick={() => {
							updateStore("bc1q0vae9k5fhde4l7dr79d37u7cuaezjqarlfraek");
							// updateStore("bc1qhyje6fsteyavalgy5pmnf4wgpqe74vdg3nr0s0");
						}}
					>
						Paste Example Address
					</button>
				</span>
				<button
					type="button"
					className="p-2 m-2 font-semibold bg-teal-500 text-white rounded hover:bg-teal-700"
					onClick={async () => {
						updateGetAddressTxsStore(
							await getAddressTxs(currentStore.state.address ?? ""),
						);
						handleGetTransactionsFromAddress();
					}}
				>
					Check
				</button>
				<span className="flex flex-col items-center">
					{timeStamps.length > 0 &&
						timeStamps.map((timeStamp, index) => (
							<div key={`${timeStamp}+1`} className="m-2">
								{`Time Stamp: ${timeStamp} Price: ${prices[index]}`}
							</div>
						))}
				</span>
				<button
					type="button"
					onClick={async () => {
						console.log(
							await getTransectionFromHashId(
								"23ea67b29bd20c19012ba9203ddb2e57aae28f253fda0f590d9021bf7a35cf5d",
							),
						);
					}}
				>
					test
				</button>
				<button
					type="button"
					onClick={async () => {
						console.log(await getPriceAtTimeStamp(1742319847));
					}}
				>
					test time stamp
				</button>
			</header>
		</div>
	);
}
