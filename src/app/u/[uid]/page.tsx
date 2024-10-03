"use client";

import { useMemo, useState } from "react";
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

export default function Page() {
  const { user } = useUser();

  const [selectedStock, setSelectedStock] = useState<string | null>(null);

  const { data: userProfileData, isLoading: isFetchingProfile } =
    trpc.kite.getUserKite.useQuery({ id: user.id.toString() }, { retry: 0 });

  const { data: userStocks, isLoading: isFetchingStocks } =
    trpc.kite.getUserPortfolioStocks.useQuery({ id: user.id.toString() });

  const memorizedStocks = useMemo(() => userStocks, [userStocks]);

  const {
    data: isConnected,
    isLoading,
    isError,
    error,
  } = trpc.kite.isConnectedKite.useQuery(
    { id: user?.id?.toString() ?? "" },
    { enabled: !!user?.id },
  );

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
                <H1>User Profile</H1>
              </CardHeader>
              <CardContent>
                {isFetchingProfile ? (
                  <SkeletonLoader
                    type="text"
                    count={{
                      text: 6,
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
                  </div>
                ) : (
                  <P>No profile data available.</P>
                )}
              </CardContent>
            </Card>
          </MotionWrapper>

          <MotionWrapper isVisible={true} duration={0.5}>
            <Card className="shadow-lg rounded-lg border">
              <CardHeader className="w-full flex justify-between items-start">
                <div>
                  <H2 className="w-full">
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
                  <P className="text-gray-500">
                    A breakdown of your portfolio holdings
                  </P>
                </div>
                <Badge className="text-sm">
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
