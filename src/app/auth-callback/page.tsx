// "use client";

// import { useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { Loader2 } from "lucide-react";
// import { trpc } from "@/trpc/client";
// import { useUser } from "@/hook/useUser";

// const AuthCallbackPage = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const email = searchParams.get("email");
//   const { setUser } = useUser();

//   const {
//     mutate: authCallback,
//     isLoading,
//     isSuccess,
//     isError,
//     error,
//   } = trpc.auth.authCallback.useMutation({
//     onSuccess: (data) => {
//       console.log("Auth callback successful:", data.user?.id);
//       if (data.user) {
//         setUser({
//           id: data.user.id,
//           name: data.user.name,
//           email: data.user.email,
//           avatar: data.user.avatar,
//         });
//         router.push(`/u/${data.user.id}`);
//       }
//     },
//     onError: (error) => {
//       console.error("Auth callback error:", error);
//       // Handle error (e.g., show error message)
//     },
//   });

//   useEffect(() => {
//     console.log("email", email);
//     if (email) {
//       authCallback({ email });
//     }
//   }, [email, router]);

//   if (isLoading || isSuccess) {
//     return (
//       <div className="flex h-screen w-full items-center justify-center">
//         <Loader2 className="h-10 w-10 animate-spin" />
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="flex h-screen w-full items-center justify-center">
//         <p>Error: {error.message}</p>
//       </div>
//     );
//   }

//   return null; // The page will redirect before rendering anything
// };

// export default AuthCallbackPage;

"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { trpc } from "@/trpc/client";
import { useUser } from "@/hook/useUser";

const AuthCallbackPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const { setUser } = useUser();

  const [isErrorSet, setIsErrorSet] = useState(false);

  const {
    mutate: authCallback,
    isLoading,
    isSuccess,
    isError,
    error,
  } = trpc.auth.authCallback.useMutation({
    onSuccess: (data) => {
      console.log("Auth callback successful:", JSON.stringify(data));
      if (data.user) {
        setUser({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          avatar: data.user.avatar,
        });
        router.push(`/u/${data.user.id}`);
      }
    },
    onError: () => {
      setIsErrorSet(true);
    },
  });

  useEffect(() => {
    if (isErrorSet) {
      authCallback({ email });
    }
  }, [router, isErrorSet, isError]);

  useEffect(() => {
    if (email) {
      authCallback({ email });
    }
  }, [email, authCallback]);

  if (isLoading || isSuccess) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-red-500">Error: {error.message}</div>
      </div>
    );
  }

  return null; // The page will redirect before rendering anything
};

export default AuthCallbackPage;
