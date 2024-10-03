// "use client";

// import React from "react";
// import { Button } from "../ui/button";
// import { trpc } from "@/trpc/client";
// import Loading from "./loading";
// import { useRouter } from "next/navigation";
// import { useUser } from "@/hook/useUser";

// type Props = {};

// const ConnectKite = (props: Props) => {
//   const router = useRouter();

//   const { user } = useUser();

//   const { data: isConnected } = trpc.kite.isConnectedKite.useQuery({
//     id: user.id!.toString(),
//   });

//   const handleNavigateToKiteLogin = () => {
//     router.push(
//       `https://kite.zerodha.com/connect/login?v=3&api_key=${process.env.NEXT_PUBLIC_KITE_API_KEY}`,
//     );
//   };

//   if (isConnected) {
//     return (
//       <div>

//         <Button variant="default" onClick={handleNavigateToKiteLogin}>
//           Connect Kite
//         </Button>
//       </div>
//     );
//   }
// };

// export default ConnectKite;

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { useUser } from "@/hook/useUser";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { P } from "../ui/typography";

export default function ConnectKite() {
  const router = useRouter();
  const { user } = useUser();

  const {
    data: isConnected,
    isLoading,
    isError,
    error,
  } = trpc.kite.isConnectedKite.useQuery(
    { id: user?.id?.toString() ?? "" },
    { retry: 0 },
  );

  const handleNavigateToKiteLogin = () => {
    if (process.env.NEXT_PUBLIC_KITE_API_KEY) {
      router.push(
        `https://kite.zerodha.com/connect/login?v=3&api_key=${process.env.NEXT_PUBLIC_KITE_API_KEY}`,
      );
    } else {
      console.error("Kite API key is not set");
    }
  };

  if (isLoading) {
    return (
      <div className="py-8">
        <Skeleton className="w-32 h-10" />
      </div>
    );
  }

  // if (isError) {
  //   return (
  //     <Alert variant="destructive">
  //       <AlertCircle className="h-4 w-4" />
  //       <AlertTitle>Error</AlertTitle>
  //       <AlertDescription>
  //         {error?.message || "Failed to check Kite connection status"}
  //       </AlertDescription>
  //     </Alert>
  //   );
  // }

  return (
    <div className="py-8">
      <Button
        variant={"secondary"}
        onClick={handleNavigateToKiteLogin}
        disabled={isConnected}
      >
        {isConnected ? (
          <P className="text-zinc-900 dark:text-zinc-200">Already Connected</P>
        ) : (
          <P className="text-zinc-900 dark:text-zinc-200">Connect Kite</P>
        )}
      </Button>
    </div>
  );
}
