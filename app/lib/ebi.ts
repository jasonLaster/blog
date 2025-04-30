import { Hyperbrowser } from "@hyperbrowser/sdk";

const hbClient = new Hyperbrowser({
  apiKey: process.env.HYPERBROWSER_API_KEY,
});

const ebiTask = `
What are the fund details for https://longviewresearchpartners.com/charts/

Return the details as a JSON object. Do not include any other text.

{
    "etf_ticker": "EBI",
    "exchange": "NASDAQ",
    "cusip": "75526L852",
    "inception": "Feb 26, 2025",
    "net_assets": "452,629,474.16",
    "shares_outstanding": "9,896,830",
    "nav": "45.73",
    "nav_change_dollar": "0.12",
    "nav_change_percent": "0.26",
    "market_price": "45.72",
    "market_price_change_dollar": "0.08",
    "market_price_change_percent": "0.18",
    "premium_discount": "-0.03",
    "median_30_day_spread": "0.14",
    "gross_expense_ratio": "0.35%",
    "net_expense_ratio": "0.25%",
}


`;

export async function getEBIDetails() {
  const result = await hbClient.agents.browserUse.startAndWait({
    task: ebiTask,
  });

  return result.data?.finalResult;
}
