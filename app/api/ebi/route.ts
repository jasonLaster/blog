import { NextResponse } from "next/server";

// Debug: API route loaded
console.log("[EBI API] route.ts loaded");

const FMP_API_KEY = process.env.FMP_API_KEY;

interface HistoricalPriceData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  adjClose?: number;
  volume: number;
  unadjustedVolume?: number;
  change?: number;
  changePercent?: number;
  vwap?: number;
  label?: string;
  changeOverTime?: number;
}

interface PerformanceResult {
  symbol: string;
  startDate?: string;
  startPrice?: number;
  endDate?: string;
  endPrice?: number;
  performance?: number; // as a percentage
  error?: string;
}

const API_BASE_URL =
  "https://financialmodelingprep.com/api/v3/historical-price-full";

async function getHistoricalData(
  symbol: string,
  fromDate: string,
  toDate: string
): Promise<HistoricalPriceData[]> {
  const urlSymbol = symbol.startsWith("^")
    ? `index/${symbol.substring(1)}`
    : symbol;
  const url = `${API_BASE_URL}/${urlSymbol}?from=${fromDate}&to=${toDate}&apikey=${FMP_API_KEY}`;

  console.log(
    `[EBI API] Fetching data for ${symbol} from ${fromDate} to ${toDate}...`
  );
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(
        `[EBI API] Error fetching data for ${symbol}:`,
        response.status,
        response.statusText
      );
      return [];
    }
    const data: { historical?: HistoricalPriceData[] } = await response.json();
    if (data && Array.isArray(data.historical)) {
      // FMP returns data in reverse chronological order, so reverse it.
      return data.historical.sort(
        (a: HistoricalPriceData, b: HistoricalPriceData) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    }
    console.warn(
      `[EBI API] No historical data found for ${symbol} or unexpected format.`
    );
    return [];
  } catch (error) {
    console.error(
      `[EBI API] Exception fetching historical data for ${symbol}:`,
      error
    );
    return [];
  }
}

function calculatePerformance(
  symbol: string,
  data: HistoricalPriceData[],
  targetStartDate: string
): PerformanceResult {
  if (!data || data.length === 0) {
    return { symbol, error: "No data available" };
  }

  const requestedStartDate = new Date(targetStartDate);

  const startRecord: HistoricalPriceData | undefined = data.find((d) => {
    const recordDate = new Date(d.date);
    return (
      !isNaN(recordDate.getTime()) &&
      (recordDate.getTime() === requestedStartDate.getTime() ||
        recordDate.getTime() > requestedStartDate.getTime())
    );
  });

  // The last record is the most recent one available (already sorted chronologically)
  const endRecord: HistoricalPriceData | undefined = data[data.length - 1];

  if (!startRecord) {
    return {
      symbol,
      error: `No data found on or after start date ${targetStartDate}`,
    };
  }
  if (!endRecord) {
    return {
      symbol,
      error: "Could not determine end price (empty dataset after filtering?)",
    };
  }

  const startPrice = startRecord.close;
  const endPrice = endRecord.close;

  if (startPrice === 0) {
    return {
      symbol,
      startDate: startRecord.date,
      startPrice,
      endDate: endRecord.date,
      endPrice,
      error: "Start price is zero, cannot calculate performance",
    };
  }

  const performance = ((endPrice - startPrice) / startPrice) * 100;

  return {
    symbol,
    startDate: startRecord.date,
    startPrice,
    endDate: endRecord.date,
    endPrice,
    performance,
  };
}

export async function GET() {
  console.log("[EBI API] GET handler called");
  if (!FMP_API_KEY) {
    console.error("[EBI API] FMP_API_KEY environment variable is not set.");
    return NextResponse.json(
      { error: "FMP_API_KEY environment variable is not set." },
      { status: 500 }
    );
  }

  const symbolsToCompare = ["EBI", "VTI", "IWV", "IWN", "VTV"];
  const startDateStr = "2025-03-01";
  const endDateStr = new Date().toISOString().slice(0, 10); // yyyy-mm-dd

  const results: PerformanceResult[] = [];
  const allHistoricalData: {
    [symbol: string]: { date: string; close: number }[] | { error: string };
  } = {};

  for (const symbol of symbolsToCompare) {
    const historicalDataArray = await getHistoricalData(
      symbol,
      startDateStr,
      endDateStr
    );

    if (historicalDataArray.length > 0) {
      allHistoricalData[symbol.toLowerCase()] = historicalDataArray.map(
        (d) => ({ date: d.date, close: d.close })
      );
      const performanceData = calculatePerformance(
        symbol,
        historicalDataArray,
        startDateStr
      );
      results.push(performanceData);
      console.log(`[EBI API] Performance for ${symbol}:`, performanceData);
    } else {
      allHistoricalData[symbol.toLowerCase()] = {
        error: "Failed to fetch or no data returned from API.",
      };
      results.push({
        symbol,
        error: "Failed to fetch or no data returned from API.",
      });
      console.warn(`[EBI API] No data for ${symbol}`);
    }
  }

  const resEBI = results.find((r) => r.symbol === "EBI");
  const resVTI = results.find((r) => r.symbol === "VTI");
  const resIWV = results.find((r) => r.symbol === "IWV");
  const resIWN = results.find((r) => r.symbol === "IWN");
  const resVTV = results.find((r) => r.symbol === "VTV");

  const comparisonDeltas: { [key: string]: string | number } = {};

  if (resEBI?.performance !== undefined && resVTI?.performance !== undefined) {
    comparisonDeltas["ebi_vti"] = parseFloat(
      (resEBI.performance - resVTI.performance).toFixed(2)
    );
  } else {
    comparisonDeltas["ebi_vti"] = "N/A (missing performance data)";
  }

  if (resEBI?.performance !== undefined && resIWV?.performance !== undefined) {
    comparisonDeltas["ebi_iwv"] = parseFloat(
      (resEBI.performance - resIWV.performance).toFixed(2)
    );
  } else {
    comparisonDeltas["ebi_iwv"] = "N/A (missing performance data)";
  }

  if (resEBI?.performance !== undefined && resIWN?.performance !== undefined) {
    comparisonDeltas["ebi_iwn"] = parseFloat(
      (resEBI.performance - resIWN.performance).toFixed(2)
    );
  } else {
    comparisonDeltas["ebi_iwn"] = "N/A (missing performance data)";
  }

  if (resEBI?.performance !== undefined && resVTV?.performance !== undefined) {
    comparisonDeltas["ebi_vtv"] = parseFloat(
      (resEBI.performance - resVTV.performance).toFixed(2)
    );
  } else {
    comparisonDeltas["ebi_vtv"] = "N/A (missing performance data)";
  }

  if (resVTI?.performance !== undefined && resIWV?.performance !== undefined) {
    comparisonDeltas["vti_iwv"] = parseFloat(
      (resVTI.performance - resIWV.performance).toFixed(2)
    );
  } else {
    comparisonDeltas["vti_iwv"] = "N/A (missing performance data)";
  }

  if (resVTI?.performance !== undefined && resIWN?.performance !== undefined) {
    comparisonDeltas["vti_iwn"] = parseFloat(
      (resVTI.performance - resIWN.performance).toFixed(2)
    );
  } else {
    comparisonDeltas["vti_iwn"] = "N/A (missing performance data)";
  }

  if (resVTI?.performance !== undefined && resVTV?.performance !== undefined) {
    comparisonDeltas["vti_vtv"] = parseFloat(
      (resVTI.performance - resVTV.performance).toFixed(2)
    );
  } else {
    comparisonDeltas["vti_vtv"] = "N/A (missing performance data)";
  }

  if (resIWV?.performance !== undefined && resIWN?.performance !== undefined) {
    comparisonDeltas["iwv_iwn"] = parseFloat(
      (resIWV.performance - resIWN.performance).toFixed(2)
    );
  } else {
    comparisonDeltas["iwv_iwn"] = "N/A (missing performance data)";
  }

  if (resIWV?.performance !== undefined && resVTV?.performance !== undefined) {
    comparisonDeltas["iwv_vtv"] = parseFloat(
      (resIWV.performance - resVTV.performance).toFixed(2)
    );
  } else {
    comparisonDeltas["iwv_vtv"] = "N/A (missing performance data)";
  }

  if (resIWN?.performance !== undefined && resVTV?.performance !== undefined) {
    comparisonDeltas["iwn_vtv"] = parseFloat(
      (resIWN.performance - resVTV.performance).toFixed(2)
    );
  } else {
    comparisonDeltas["iwn_vtv"] = "N/A (missing performance data)";
  }

  const finalJsonOutput = {
    dateRange: {
      startDate: startDateStr,
      endDate: endDateStr,
    },
    individualPerformance: {
      ebi: resEBI?.error
        ? { error: resEBI.error }
        : {
            startDate: resEBI?.startDate,
            startPrice: resEBI?.startPrice,
            endDate: resEBI?.endDate,
            endPrice: resEBI?.endPrice,
            performance: resEBI?.performance?.toFixed(2) + "%",
          },
      vti: resVTI?.error
        ? { error: resVTI.error }
        : {
            startDate: resVTI?.startDate,
            startPrice: resVTI?.startPrice,
            endDate: resVTI?.endDate,
            endPrice: resVTI?.endPrice,
            performance: resVTI?.performance?.toFixed(2) + "%",
          },
      iwv: resIWV?.error
        ? { error: resIWV.error }
        : {
            startDate: resIWV?.startDate,
            startPrice: resIWV?.startPrice,
            endDate: resIWV?.endDate,
            endPrice: resIWV?.endPrice,
            performance: resIWV?.performance?.toFixed(2) + "%",
          },
      iwn: resIWN?.error
        ? { error: resIWN.error }
        : {
            startDate: resIWN?.startDate,
            startPrice: resIWN?.startPrice,
            endDate: resIWN?.endDate,
            endPrice: resIWN?.endPrice,
            performance: resIWN?.performance?.toFixed(2) + "%",
          },
      vtv: resVTV?.error
        ? { error: resVTV.error }
        : {
            startDate: resVTV?.startDate,
            startPrice: resVTV?.startPrice,
            endDate: resVTV?.endDate,
            endPrice: resVTV?.endPrice,
            performance: resVTV?.performance?.toFixed(2) + "%",
          },
    },
    performanceDeltas: comparisonDeltas,
    historicalPrices: allHistoricalData,
    deltaNote:
      "Positive delta means the first symbol performed better than the second by that percentage point difference.",
  };

  console.log("[EBI API] Returning JSON result");
  return NextResponse.json(finalJsonOutput);
}
