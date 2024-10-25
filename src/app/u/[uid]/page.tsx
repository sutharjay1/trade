"use client";

import ConnectKite from "@/components/global/connect-kite";
import MaxWidthWrapper from "@/components/global/max-width-wrapper";
import MotionWrapper from "@/components/global/motion-wrapper";
import SkeletonLoader from "@/components/global/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { H2, P } from "@/components/ui/typography";
import { useToast } from "@/hook/use-toast";
import { useUser } from "@/hook/useUser";
import { formatPrice } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { Portfolio } from "@prisma/client";
import {
  Database,
  Link2,
  Table2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import UserStockCard from "./_components/user-stock-card";

const UserPage = ({ params }: { params: { uid: string } }) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [totalInvestedValue, setTotalInvestedValue] = useState<number>(0);
  const [currentPL, setCurrentPL] = useState<number>(0);
  const [selectedExchange, setSelectedExchange] = useState<string>("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [sortBy, setSortBy] = useState("alphabetical");

  const {
    data: isConnected,
    isLoading,
    error,
  } = trpc.kite.isConnectedKite.useQuery(
    { id: user?.id?.toString() ?? "" },
    { enabled: !!user?.id },
  );

  const { data: userProfileData, isLoading: isFetchingProfile } =
    trpc.kite.getUserKite.useQuery(
      { id: user.id.toString() },
      { retry: 0, enabled: !isConnected },
    );

  const { data: userStocks, isLoading: isFetchingStocks } =
    trpc.kite.getUserPortfolioStocks.useQuery({ id: user.id.toString() });

  const filteredStocks = useMemo(() => {
    if (!userStocks) return [];
    if (selectedExchange === "all") return userStocks;
    return userStocks.filter(
      (stock) =>
        stock.exchange.toLowerCase() === selectedExchange.toLowerCase(),
    );
  }, [userStocks, selectedExchange]);

  useEffect(() => {
    if (!filteredStocks) return;

    const totalInvested = filteredStocks.reduce(
      (acc, stock) => acc + stock.averagePrice * stock.quantity,
      0,
    );
    setTotalInvestedValue(totalInvested);

    const pl = filteredStocks.reduce(
      (acc, stock) =>
        acc + (stock.lastPrice - stock.averagePrice) * stock.quantity,
      0,
    );
    setCurrentPL(pl);
  }, [filteredStocks]);

  const getPriceRange = (price: number) => {
    if (price < 100) return "low";
    if (price < 500) return "medium";
    return "high";
  };

  const filteredAndSortedStocks = useMemo(() => {
    if (!userStocks) return [];

    let filtered = [...userStocks];

    if (selectedExchange !== "all") {
      filtered = filtered.filter(
        (stock) =>
          stock.exchange.toLowerCase() === selectedExchange.toLowerCase(),
      );
    }

    if (priceFilter !== "all") {
      filtered = filtered.filter(
        (stock) => getPriceRange(stock.lastPrice) === priceFilter,
      );
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-high":
          return b.lastPrice - a.lastPrice;
        case "price-low":
          return a.lastPrice - b.lastPrice;
        case "pl-high":
          const plA = (a.lastPrice - a.averagePrice) * a.quantity;
          const plB = (b.lastPrice - b.averagePrice) * b.quantity;
          return plB - plA;
        case "pl-low":
          const plC = (a.lastPrice - a.averagePrice) * a.quantity;
          const plD = (b.lastPrice - b.averagePrice) * b.quantity;
          return plC - plD;
        case "alphabetical":
        default:
          return a.tradingSymbol.localeCompare(b.tradingSymbol);
      }
    });
  }, [userStocks, selectedExchange, priceFilter, sortBy]);

  return (
    <MaxWidthWrapper
      padding="large"
      paddingTop="small"
      maxw="max-w-8xl"
      className="px-4"
    >
      <ConnectKite />

      {isConnected && (
        <div className="space-y-10">
          <MotionWrapper isVisible={true} duration={0.5}>
            <Card className="shadow-lg rounded-lg border">
              <CardHeader>
                <H2>Zerodha Profile</H2>
              </CardHeader>
              <CardContent>
                {isFetchingProfile ? (
                  <SkeletonLoader
                    type="text"
                    count={{
                      text: 7,
                    }}
                  />
                ) : userProfileData ? (
                  <div className="space-y-2">
                    <P>
                      <strong>User ID:</strong> {userProfileData.userId}
                    </P>
                    <P>
                      <strong>Email:</strong> {userProfileData.email}
                    </P>
                    <P>
                      <strong>Name:</strong> {userProfileData.userName}
                    </P>
                    <P>
                      <strong>Broker:</strong> {userProfileData.broker}
                    </P>
                    <P>
                      <strong>Kite ID:</strong>{" "}
                      <Badge className="ml-2 text-sm" variant="gradient">
                        {userProfileData.kiteId}
                      </Badge>
                    </P>
                    <P>
                      <strong>Exchanges:</strong>{" "}
                      {JSON.stringify(userProfileData.exchanges, null, 2)}
                    </P>
                    <P>
                      <strong>Total Invested:</strong>{" "}
                      {formatPrice(totalInvestedValue)}
                    </P>
                    <P>
                      <strong>Total Current Value:</strong>{" "}
                      {formatPrice(totalInvestedValue + currentPL)}
                    </P>
                    <P className="flex items-center justify-start gap-2">
                      <strong>Total P&L: </strong>
                      <span
                        className={
                          currentPL >= 0 ? "text-green-500" : "text-red-500"
                        }
                      >
                        {formatPrice(currentPL)}
                      </span>
                      {currentPL >= 0 ? (
                        <TrendingUp className="text-green-500" />
                      ) : (
                        <TrendingDown className="text-red-500" />
                      )}
                    </P>
                  </div>
                ) : (
                  <P>No profile data available.</P>
                )}
              </CardContent>
            </Card>
          </MotionWrapper>

          <MotionWrapper isVisible={true} duration={0.5}>
            <Card className="shadow-lg rounded-lg border">
              <CardHeader className="w-full flex-1 flex justify-between items-start">
                <CardTitle className="flex flex-col md:flex-row items-center justify-between w-full">
                  <h2 className="w-full border-b-0 scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                    {isFetchingStocks ? (
                      <SkeletonLoader
                        type="text"
                        count={{
                          text: 1,
                        }}
                      />
                    ) : (
                      `${userProfileData?.userName}'s Portfolio`
                    )}
                  </h2>

                  <div className="flex flex-col space-y-4 justify-start sm:space-y-0 sm:flex-row sm:items-center sm:justify-between w-full">
                    <div className="flex flex-wrap gap-3">
                      <Select
                        value={selectedExchange}
                        onValueChange={setSelectedExchange}
                      >
                        <SelectTrigger className="w-[130px] h-9">
                          <SelectValue placeholder="Exchange" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="nse">NSE</SelectItem>
                          <SelectItem value="bse">BSE</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-[140px] h-9">
                          <SelectValue placeholder="Sort By" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="alphabetical">A-Z</SelectItem>
                          <SelectItem value="price-high">
                            Highest Price
                          </SelectItem>
                          <SelectItem value="price-low">
                            Lowest Price
                          </SelectItem>
                          <SelectItem value="pl-high">Highest P&L</SelectItem>
                          <SelectItem value="pl-low">Lowest P&L</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select
                        value={priceFilter}
                        onValueChange={setPriceFilter}
                      >
                        <SelectTrigger className="w-[140px] h-9">
                          <SelectValue placeholder="Price Range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Prices</SelectItem>
                          <SelectItem value="low">&lt; ₹100</SelectItem>
                          <SelectItem value="medium">₹100 - ₹500</SelectItem>
                          <SelectItem value="high">&gt; ₹500</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Badge className="ml-auto sm:ml-0 h-9 px-4 flex items-center  md:justify-center text-sm font-medium">
                      {filteredAndSortedStocks.length || 0} Stocks
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isFetchingStocks ? (
                  <SkeletonLoader
                    type="text"
                    count={{
                      text: 3,
                    }}
                  />
                ) : filteredAndSortedStocks.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredAndSortedStocks.map((stock) => (
                      <UserStockCard key={stock.id} stock={stock} />
                    ))}
                  </div>
                ) : (
                  <P>No stocks found matching the selected filters.</P>
                )}
              </CardContent>
            </Card>
          </MotionWrapper>

          <MotionWrapper isVisible={true} duration={0.5}>
            <SchemaFragmentation
              userStocks={filteredStocks}
              userProfileData={userProfileData}
            />
          </MotionWrapper>
        </div>
      )}
    </MaxWidthWrapper>
  );
};

const SchemaFragmentation = ({
  userStocks,
  userProfileData,
}: {
  userStocks: Portfolio[] | any;
  userProfileData: any;
}) => {
  const getModelStats = () => {
    if (!userStocks || !userProfileData) return null;

    const portfolioSize = userStocks.length;

    const calculateAvgRecordSize = (records: any[], fields: string[]) => {
      const totalSize = records.reduce((acc, record) => {
        const recordSize = fields.reduce((size, field) => {
          const value = record[field];
          if (typeof value === "string") {
            return size + value.length * 2;
          }
          if (typeof value === "number") {
            return size + 8;
          }
          return size;
        }, 0);
        return acc + recordSize;
      }, 0);
      return totalSize / records.length / 1024;
    };

    const portfolioFields = [
      "tradingSymbol",
      "exchange",
      "lastPrice",
      "quantity",
      "averagePrice",
    ];

    const userKiteFields = ["kiteId", "email", "accessToken", "enctoken"];
    const userFields = ["name", "email", "avatar"];

    const avgPortfolioSize = calculateAvgRecordSize(
      userStocks,
      portfolioFields,
    );
    const avgUserKiteSize = calculateAvgRecordSize(
      [userProfileData],
      userKiteFields,
    );
    const avgUserSize = calculateAvgRecordSize([userProfileData], userFields);

    return {
      Portfolio: {
        recordCount: portfolioSize,
        avgRecordSize: avgPortfolioSize,
        relations: ["UserKite"],
        usage: Math.min((portfolioSize / 1000) * 100, 100),
        fields: portfolioFields,
      },
      UserKite: {
        recordCount: 1,
        avgRecordSize: avgUserKiteSize,
        relations: ["User", "Portfolio"],
        usage: 45,
        fields: userKiteFields,
      },
      User: {
        recordCount: 1,
        avgRecordSize: avgUserSize,
        relations: ["UserKite"],
        usage: 30,
        fields: userFields,
      },
    };
  };

  const modelStats = getModelStats();

  if (!modelStats) return null;

  return (
    <Card className="shadow-lg rounded-lg border mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          <span className="font-medium">Schema Fragmentation Analysis</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(modelStats).map(([model, stats]) => (
            <div key={model} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Table2 className="w-4 h-4" />
                  <P className="font-medium [&:not(:first-child)]:mt-0">
                    {model}
                  </P>
                </div>
                <Badge
                  variant={
                    stats.usage > 70
                      ? "destructive"
                      : stats.usage > 40
                        ? "warning"
                        : "success"
                  }
                >
                  {stats.recordCount} Records
                </Badge>
              </div>
              <Progress value={stats.usage} className="h-2" />
              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>
                  <span>Avg Record Size: </span>
                  <span className="font-medium">
                    {stats.avgRecordSize.toFixed(2)} KB
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Link2 className="w-3 h-3" />
                  <span className="font-medium">
                    {stats.relations.join(", ")}
                  </span>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                <span>Key Fields: </span>
                <span className="font-medium">{stats.fields.join(", ")}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserPage;
