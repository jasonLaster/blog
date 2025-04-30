import { getEBIDetails, sendPremiumDiscountAlert } from "../app/lib/ebi";

if (false) {
  getEBIDetails().then((data) => {
    console.log(data);
  });
}

if (true) {
  sendPremiumDiscountAlert({
    premium_discount: "-0.01",
    median_30_day_spread: "0.14",
    etf_ticker: "EBI",
    exchange: "NYSE",
    cusip: "0000000000",
    gross_expense_ratio: "0.35%",
    net_assets: "100000000",
  }).then((data) => {
    console.log(data);
  });
}
