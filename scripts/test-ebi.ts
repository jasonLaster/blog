import { getEBIDetails } from "../app/lib/ebi";

getEBIDetails().then((data) => {
  console.log(data);
});
