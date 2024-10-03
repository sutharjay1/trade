"use server";

import axios from "axios";

type Props = {
  stockName: string;
};

export const getStockHighLow = async ({ stockName }: Props) => {
  try {
    const response = await axios.get(
      //   `https://api.polygon.io/v1/open-close/${stockName}/2023-01-09`,
      `https://api.polygon.io/v1/open-close/IRFC/2024-10-01`,
      {
        params: {
          adjusted: true,
          apiKey: process.env.POLYGON_API_KEY,
        },
      },
    );
    return response.data; // Return the data to be used elsewhere
  } catch (error) {
    console.error("Error fetching stock high/low:", error);
  }
};
