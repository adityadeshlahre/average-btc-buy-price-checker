import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default async function handler(req: VercelRequest, res: VercelResponse) {
	const { time_start, time_end } = req.query;

	try {
		const response = await axios.get(
			`https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/historical`,
			{
				params: {
					symbol: 'BTC',
					interval: '5m',
					time_start,
					time_end,
				},
				headers: {
					'X-CMC_PRO_API_KEY': process.env.VITE_COINMARKETCAP_API_KEY!,
				},
			}
		);

		res.status(200).json(response.data);
	} catch (error: any) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}
