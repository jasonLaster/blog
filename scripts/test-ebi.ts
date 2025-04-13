import { getEBIDetails, sendUpdate } from "../app/lib/ebi";

if (false) {
  getEBIDetails().then((data) => {
    console.log(data);
  });
}

if (true) {
  sendUpdate(
    {
      premium_discount: "-0.01",
      median_30_day_spread: "0.14",
    },
    "jason.laster.11@gmail.com"
  ).then((data) => {
    console.log(data);
  });
}
