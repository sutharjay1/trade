"use client";

import { useEffect, useMemo, useState } from "react";
import ConnectKite from "@/components/global/connect-kite";
import MaxWidthWrapper from "@/components/global/max-width-wrapper";
import { useUser } from "@/hook/useUser";
import { trpc } from "@/trpc/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SkeletonLoader from "@/components/global/skeleton";
import UserStockCard from "./_components/user-stock-card";
import { P, H1, H2 } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import MotionWrapper from "@/components/global/motion-wrapper";
import { useToast } from "@/hook/use-toast";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";

export default function Page() {
  const { user } = useUser();
  const { toast } = useToast();
  const [totalInvestedValue, setTotalInvestedValue] = useState<number>(0);
  const [currentPL, setCurrentPL] = useState<number>(0);

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

  const memorizedStocks = useMemo(() => userStocks, [userStocks]);

  const totalInvested = useMemo(() => {
    if (!memorizedStocks) {
      return 0;
    }

    setTotalInvestedValue(
      memorizedStocks.reduce(
        (acc, stock) => acc + stock.averagePrice * stock.quantity,
        0,
      ),
    );
    setCurrentPL(
      memorizedStocks.reduce(
        (acc, stock) =>
          acc + (stock.lastPrice - stock.averagePrice) * stock.quantity,
        0,
      ),
    );
  }, [memorizedStocks]);

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
                      <strong>Total Gain:</strong>{" "}
                      {formatPrice(totalInvestedValue + currentPL)}
                    </P>
                    <P className="flex items-center justify-start gap-2">
                      <strong>Total P&L: </strong>
                      {formatPrice(currentPL)}
                      {currentPL >= 0 ? <TrendingUp /> : <TrendingDown />}
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
                <H2 className="w-fit border-b-0">
                  {isFetchingStocks ? (
                    <SkeletonLoader
                      type="text"
                      count={{
                        text: 1,
                      }}
                    />
                  ) : (
                    userProfileData?.userName
                  )}
                  's Stocks
                </H2>

                <Badge className="w-fit text-sm">
                  {memorizedStocks?.length} Stocks
                </Badge>
              </CardHeader>
              <CardContent>
                {isFetchingStocks ? (
                  <SkeletonLoader
                    type="text"
                    count={{
                      text: 3,
                    }}
                  />
                ) : memorizedStocks && userProfileData ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {memorizedStocks.map((stock) => (
                      <UserStockCard key={stock.id} stock={stock} />
                    ))}
                  </div>
                ) : (
                  <P>No stock data available.</P>
                )}
              </CardContent>
            </Card>
          </MotionWrapper>
        </div>
      )}
    </MaxWidthWrapper>
  );
}
