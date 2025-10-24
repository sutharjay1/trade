"use client";

import React, { useState, useEffect } from "react";
import ConnectKite from "@/components/global/connect-kite";
import { useRouter, useSearchParams } from "next/navigation";
import { useKiteRequest } from "@/hook/use-kite-request";
import { trpc } from "@/trpc/client";
import { useUser } from "@/hook/useUser";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hook/use-toast";
import Loading from "@/components/global/loading";
import { isPortfolioConnected } from "./_actions/update-user-kite-profile";

export default function Kite() {
  const param = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const requestTokenFromParam = param.get("request_token");
  const { setRequestToken } = useKiteRequest();
  const { user } = useUser();
  const [isUpdatedProfile, setIsUpdatedProfile] = useState(false);

  const isPortfolioConnectedSuccess = isPortfolioConnected({
    id: user?.id.toString(),
  });

  const {
    mutate: generateSession,
    isLoading: isGeneratingSession,
    isSuccess: isSessionGenerated,
  } = trpc.kite.generateSession.useMutation({
    onSuccess: (data) => {
      if (data?.success && user?.id) {
        console.log(`on success data`);
        updateUserKiteProfile({ id: user.id.toString() });
      }
    },
    onError: (error: any) => {
      console.log(`on error `);
      toast({
        title: "Retrying...",
        duration: 5000,
      });
      setIsUpdatedProfile(true);

      if (!isPortfolioConnectedSuccess) {
        updateUserKiteProfile({ id: user?.id.toString() });
      }
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
      }
    },
    onError: (error: any) => {
      toast({
        title: "Retrying...",
        duration: 5000,
      });
      console.log(`on error inside update user kite profile `);
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
    <div className="w-full h-full">
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
    </div>
  );
}
