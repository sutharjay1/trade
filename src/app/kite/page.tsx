// "use client";

// import React, { useState, useEffect } from "react";
// import MaxWidthWrapper from "@/components/global/max-width-wrapper";
// import ConnectKite from "@/components/global/connect-kite";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useKiteRequest } from "@/hook/use-kite-request";
// import { trpc } from "@/trpc/client";
// import { useUser } from "@/hook/useUser";
// import { Toaster } from "@/components/ui/toaster";
// import { useToast } from "@/hook/use-toast";
// import Loading from "@/components/global/loading";

// export default function Kite() {
//   const param = useSearchParams();
//   const router = useRouter();
//   const { toast } = useToast();
//   const requestTokenFromParam = param.get("request_token");
//   const { setRequestToken } = useKiteRequest();
//   const { user } = useUser();

//   const {
//     data,
//     isLoading: isMutating,
//     isSuccess,
//   } = trpc.kite.generateSession.useQuery(
//     {
//       request_token: requestTokenFromParam as string,
//       userInfo: user,
//     },
//     {
//       enabled: !!requestTokenFromParam && !!user,
//     },
//   );

//   const { mutate: updateUserKiteProfile, isLoading: isUpdatingProfile } =
//     trpc.kite.updateUserKiteProfile.useMutation({
//       onSuccess: (data) => {
//         if (data?.success) {
//           toast({
//             title: "Kite Profile Updated",
//             description: "Your Kite profile has been successfully updated.",
//             duration: 5000,
//           });
//         } else {
//           toast({
//             title: "Update Failed",
//             description:
//               "Failed to update your Kite profile. Please try again.",
//             variant: "destructive",
//             duration: 5000,
//           });
//         }
//       },
//       onError: (error: any) => {
//         toast({
//           title: "Error",
//           description: `Failed to update Kite profile: ${error.message}`,
//           variant: "destructive",
//           duration: 5000,
//         });
//       },
//     });

//   useEffect(() => {
//     if (requestTokenFromParam && user) {
//       setRequestToken(requestTokenFromParam);
//     }
//   }, [user, requestTokenFromParam, setRequestToken]);

//   useEffect(() => {
//     if (data?.success && user?.id) {
//       updateUserKiteProfile({
//         id: user.id.toString(),
//       });
//     }
//   }, [data?.success, user, updateUserKiteProfile]);

//   useEffect(() => {
//     if (data?.success && user?.id && !isUpdatingProfile) {
//       toast({
//         title: "Connection Successful",
//         description: "Your Kite account has been successfully connected.",
//         duration: 5000,
//       });
//       router.push(`/u/${user.id}`);
//     }
//   }, [isSuccess, data?.success, user, router, isUpdatingProfile, toast]);

//   return (
//     <MaxWidthWrapper padding="large" paddingTop="large" maxw="max-w-8xl">
//       <ConnectKite />
//       {(isMutating || isUpdatingProfile) && (
//         <div className="flex flex-col items-center justify-center mt-8">
//           <Loading className="h-10 w-10 animate-spin" />
//           <p className="mt-4 text-lg text-zinc-900 dark:text-zinc-300">
//             {isMutating
//               ? "Generating data from session..."
//               : "Updating profile..."}
//           </p>
//         </div>
//       )}
//       <Toaster />
//     </MaxWidthWrapper>
//   );
// }

"use client";

import React, { useState, useEffect } from "react";
import MaxWidthWrapper from "@/components/global/max-width-wrapper";
import ConnectKite from "@/components/global/connect-kite";
import { useRouter, useSearchParams } from "next/navigation";
import { useKiteRequest } from "@/hook/use-kite-request";
import { trpc } from "@/trpc/client";
import { useUser } from "@/hook/useUser";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hook/use-toast";
import Loading from "@/components/global/loading";

export default function Kite() {
  const param = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const requestTokenFromParam = param.get("request_token");
  const { setRequestToken } = useKiteRequest();
  const { user } = useUser();

  const {
    mutate: generateSession,
    isLoading: isGeneratingSession,
    isSuccess: isSessionGenerated,
  } = trpc.kite.generateSession.useMutation({
    onSuccess: (data) => {
      if (data?.success && user?.id) {
        updateUserKiteProfile({ id: user.id.toString() });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Retrying...",
        duration: 5000,
      });

      updateUserKiteProfile({ id: user?.id.toString() });
    },
    retry: 0,
  });

  const {
    mutate: updateUserKiteProfile,
    isLoading: isUpdatingProfile,
    isError,
  } = trpc.kite.updateUserKiteProfile.useMutation({
    onSuccess: (data: any) => {
      if (data?.success) {
        toast({
          title: "Kite Profile Updated",
          description: "Your Kite profile has been successfully updated.",
          duration: 5000,
        });
        router.push(`/u/${user.id}`);
      } else {
        // updateUserKiteProfile({ id: user?.id.toString() });
      }
    },
    onError: (error: any) => {
      // toast({
      //   title: "Error",
      //   description: `Failed to update Kite profile: ${error.message}`,
      //   variant: "destructive",
      //   duration: 5000,
      // });
      toast({
        title: "Retrying...",
        duration: 5000,
      });
      updateUserKiteProfile({ id: user?.id.toString() });
    },
  });

  useEffect(() => {
    if (requestTokenFromParam && user) {
      setRequestToken(requestTokenFromParam);
      generateSession({
        request_token: requestTokenFromParam,
        userInfo: user,
      });
    }
  }, [user, requestTokenFromParam, setRequestToken, generateSession]);

  return (
    <MaxWidthWrapper padding="large" paddingTop="large" maxw="max-w-8xl">
      <ConnectKite />
      {(isGeneratingSession || isUpdatingProfile) && (
        <div className="flex flex-col items-center justify-center mt-8">
          <Loading className="h-10 w-10 animate-spin" />
          <p className="mt-4 text-lg text-zinc-900 dark:text-zinc-300">
            {isGeneratingSession
              ? "Generating data from session..."
              : "Updating profile..."}
          </p>
        </div>
      )}
      <Toaster />
    </MaxWidthWrapper>
  );
}
