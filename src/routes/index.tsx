import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { getAddressTxs, getTransection } from "../../utils/lib";
import logo from "../logo.svg";

export const Route = createFileRoute("/")({
	component: App,
});

function App() {
	const [address, setAddress] = useState<string>("");
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
							setAddress(e.target.value);
						}}
					/>
					<button
						type="button"
						className="p-2 m-2 font-semibold bg-teal-500 text-white rounded hover:bg-teal-700"
						onClick={() => {
							setAddress("3G7jcEELKh38L6kaSV8K35pTqsh5bgZW2D");
						}}
					>
						Paste Example Address
					</button>
				</span>
				<button
					type="button"
					className="p-2 m-2 font-semibold bg-teal-500 text-white rounded hover:bg-teal-700"
					onClick={async () => {
						console.log(await getAddressTxs(address));
					}}
				>
					Check
				</button>
				<button
					type="button"
					onClick={async () => {
						console.log(
							await getTransection(
								"23ea67b29bd20c19012ba9203ddb2e57aae28f253fda0f590d9021bf7a35cf5d",
							),
						);
					}}
				>
					test
				</button>
			</header>
		</div>
	);
}
