// "use client";
// import React, { useState } from "react";
// import { Loader2 } from "lucide-react";
// import { signIn, useSession } from "next-auth/react";
// import { useTheme } from "next-themes";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { FcGoogle } from "react-icons/fc";
// import { IoLogoApple } from "react-icons/io5";
// import Link from "next/link";

// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { toast } from "@/hooks/use-toast";
// import { cn } from "@/lib/utils";
// import { trpc } from "@/trpc/client";
// import { useUser } from "@/hook/useUser";

// const AuthPage = () => {
//   const { theme } = useTheme();
//   const { user, setUser } = useUser()
//   const [isLoggingIn, setIsLoggingIn] = useState(false);
//   const [afterGoogleLogin, setAfterGoogleLogin] = useState(false);

//   const router = useRouter();
//   const session = useSession();

//   const { data, isInitialLoading, isSuccess } = trpc.auth.isVerfied.useQuery(
//     { email: session?.data?.user?.email as string },
//     {
//       enabled: !!session?.data?.user?.email,
//       retry: false,
//       onSuccess: (data) => {
//         console.log("isVerified success", data);
//         if (data.success && data.user) {
//           setUser({
//             id: data.user.id,
//             name: session?.data?.user?.name as string,
//             email: session.data?.user?.email as string,
//             avatar: session.data?.user?.image as string,
//           });
//           console.log("User verified, redirecting to profile");
//           router.push(`/u/${data.user.id}`);
//           setAfterGoogleLogin(true);
//         } else {
//           console.log("User not verified, redirecting to auth-callback");
//           router.push(`/auth-callback?email=${session.data?.user?.email}`);
//           setAfterGoogleLogin(true);
//         }
//       },
//       onError: (error) => {
//         // console.error('isVerified error', error);
//         // toast({
//         //   description: 'Error verifying user. Please try again.',
//         //   variant: 'destructive',
//         // });
//         router.push(`/auth-callback?email=${session.data?.user?.email}`);
//         setAfterGoogleLogin(true);
//       },
//     },
//   );

//   const handleGoogleLogin = () => {
//     setIsLoggingIn(true);
//     signIn("google")
//       .then(() => {
//         setIsLoggingIn(false);
//       })
//       .catch((error) => {
//         toast({
//           description: error.message,
//           variant: "destructive",
//         });
//         setIsLoggingIn(false);
//       });
//   };

//   if (
//     isInitialLoading ||
//     isSuccess ||
//     data?.success ||
//     data?.user ||
//     session.status === "authenticated" ||
//     afterGoogleLogin
//   ) {
//     return (
//       <div className="flex h-screen w-full items-center justify-center">
//         <Loader2 className="h-10 w-10 animate-spin" />
//       </div>
//     );
//   }

//   return (
//     <div className="grid min-h-screen grid-rows-1 bg-background lg:grid-cols-1 ">

//       <div className="order-1 flex w-full items-center justify-center px-4 lg:order-2 lg:p-8">
//         <Card className="mx-auto w-full  md:max-w-sm ">
//           <CardHeader>
//             <CardTitle className="text-2xl">Login</CardTitle>
//             <CardDescription>Enter your email below to login to your account</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="relative w-full grid gap-4">
//               <Button variant="outline" className="w-full flex items-center justify-center" onClick={handleGoogleLogin}>
//                 <FcGoogle className="mr-2" />
//                 {isLoggingIn ? "Logging in..." : "Login with Google"}
//               </Button>

//               <div className="relative text-center py-2">
//                 <span className="relative z-10 bg-background px-4 text-gray-600 dark:text-gray-400">
//                   Or continue with
//                 </span>
//                 <div className="absolute inset-0 flex items-center justify-center">
//                   <div className="w-full border-t border-gray-300 dark:border-gray-700" />
//                 </div>
//               </div>

//               <Button variant="outline" className="w-full flex items-center justify-center">
//                 <IoLogoApple className="mr-2" />
//                 Login with Apple
//               </Button>

//               <p className="text-center text-sm mt-4 text-gray-500 dark:text-gray-400">
//                 Don't have an account?{" "}
//                 <Link href="/register" className="text-primary font-medium hover:underline">
//                   Sign Up
//                 </Link>
//               </p>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default AuthPage;

"use client";

import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { IoLogoApple } from "react-icons/io5";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hook/use-toast";
import { trpc } from "@/trpc/client";
import { useUser } from "@/hook/useUser";

const AuthPage = () => {
  const { setUser } = useUser();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const session = useSession();

  const {
    mutate: verifyUser,
    isLoading: isVerifying,
    isSuccess,
  } = trpc.auth.isVerfied.useMutation({
    onSuccess: (data) => {
      if (data.success && data.user) {
        setUser({
          id: data.user.id,
          name: session.data?.user?.name ?? "",
          email: session.data?.user?.email ?? "",
          avatar: session.data?.user?.image ?? "",
        });
        router.push(`/u/${data.user.id}`);
      } else {
        router.push(`/auth-callback?email=${session.data?.user?.email}`);
      }
      setIsLoading(false);
    },
    onError: (error) => {
      console.error("Verification error:", error);
      // toast({
      //   description: 'Error verifying user. Please try again.',
      //   variant: 'destructive',
      // });
      router.push(`/auth-callback?email=${session.data?.user?.email}`);
      setIsLoading(false);
    },
  });

  useEffect(() => {
    if (session.status === "authenticated" && session.data?.user?.email) {
      verifyUser({ email: session.data.user.email });
    } else if (session.status !== "loading") {
      setIsLoading(false);
    }
  }, [session.status, session.data?.user?.email, verifyUser]);

  const handleGoogleLogin = () => {
    setIsLoggingIn(true);
    signIn("google").catch((error) => {
      toast({
        description: error.message,
        variant: "destructive",
      });
      setIsLoggingIn(false);
    });
  };

  if (isLoading || isVerifying || isSuccess) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid min-h-screen grid-rows-1 bg-background lg:grid-cols-1">
      <div className="order-1 flex w-full items-center justify-center px-4 lg:order-2 lg:p-8">
        <Card className="mx-auto w-full md:max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative w-full grid gap-4">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center"
                onClick={handleGoogleLogin}
                disabled={isLoggingIn}
              >
                <FcGoogle className="mr-2" />
                {isLoggingIn ? "Logging in..." : "Login with Google"}
              </Button>

              <div className="relative text-center py-2">
                <span className="relative z-10 bg-background px-4 text-gray-600 dark:text-gray-400">
                  Or continue with
                </span>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-700" />
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full flex items-center justify-center"
              >
                <IoLogoApple className="mr-2" />
                Login with Apple
              </Button>

              <p className="text-center text-sm mt-4 text-gray-500 dark:text-gray-400">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="text-primary font-medium hover:underline"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
