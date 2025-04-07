import { createFileRoute } from "@tanstack/react-router";
import addresses from "../../addresses.json";

export const Route = createFileRoute("/addresses")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<div>Hello "/addresses"!</div>
			<pre>{JSON.stringify(addresses, null, 2)}</pre>
		</>
	);
}
