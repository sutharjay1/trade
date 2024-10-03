"use server";

import axios from "axios";

type Props = {
  stockName: string;
};

export const relatedCompany = async ({ stockName }: Props) => {
  console.log("stockName", stockName);
  try {
    const response = await axios.get(
      //   `https://api.polygon.io/v1/open-close/${stockName}/2023-01-09`,
      `https://api.polygon.io/v1/related-companies/BSE:${stockName}?apiKey=${process.env.POLYGON_API_KEY}`,
    );

    console.log(`Related company data for ${stockName}:`, response.data);

    return response.data; // Return the data to be used elsewhere
  } catch (error) {
    console.error("Error fetching stock high/low:", error);
  }
};
