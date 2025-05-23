import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default async function handler(req: VercelRequest, res: VercelResponse) {
	const { time_start, time_end } = req.query;

	if ( !time_start || !time_end) {
      return res.status(400).json({ error: "Missing query parameters" });
    }

	const apiKey = process.env.COINMARKETCAP_API_KEY;

    if (!apiKey) {
      console.error("API Key is missing");
      return res.status(500).json({ error: "API Key not found in environment variables" });
    }

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
					'X-CMC_PRO_API_KEY': apiKey,
				},
			}
		);

		res.status(200).json(response.data);
	} catch (error: any) {
    console.error("Error in API route:", error.message);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
}
