// "use client";

// import React from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Loader2 } from "lucide-react";
// import { useEffect, useState } from "react";

// import { Input } from "../ui/input";

// import { geistSans } from "@/lib/font";
// import { cn } from "@/lib/utils";
// import { trpc } from "@/trpc/client";
// import { signIn, useSession } from "next-auth/react";
// import Image from "next/image";
// import { FaFacebook, FaGithub } from "react-icons/fa6";
// import { FcGoogle } from "react-icons/fc";
// import Loading from "../global/loading";

// import { useMediaQuery } from "react-responsive";
// import { useRouter } from "next/navigation";
// import { useToast } from "@/hook/use-toast";
// import { useModal } from "@/hook/use-modal";
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";

// const Modal = () => {

//     const { toast } = useToast();
//     const [isLoggingIn, setIsLoggingIn] = useState<{
//         isLoading: boolean;
//     }>({
//         isLoading: false,

//     });
//     const router = useRouter();
//     const { data: sess, status } = useSession();

//     const { isOpen, modalType, onClose, onOpen } = useModal();
//     const [isDrawerOpen, setIsDrawerOpen] = useState(false);

//     // Use media query to determine if the screen is mobile
//     const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

//     // Function to toggle the drawer
//     const toggleDrawer = () => {
//         setIsDrawerOpen((prev) => !prev);
//     };

//     // Rendering based on the modalType
//     const renderModalContent = () => {

//         switch (modalType) {
//             case "VIEW_STOCK":
//                 return (
//                     <>
//                         <DialogContent className="max-w-xl">
//                             <DialogHeader>
//                                 <DialogTitle>Create Organization</DialogTitle>
//                             </DialogHeader>
//                             <DialogDescription>
//                                 Enter a title for your new organization.
//                             </DialogDescription>

//                             {children}

//                         </DialogContent>
//                     </>
//                 );

//                 return (
//                     <>
//                         <DialogContent className="z-[999] m-0 hidden gap-0 rounded-lg border-0 p-0 sm:max-w-[425px] md:flex md:max-w-[725px]">
//                             <Card className="m-0 h-auto w-full border-0 p-0">
//                                 <CardContent className="m-0 border-0 p-0">
//                                     <div className="flex h-fit flex-col md:flex-row">
//                                         {/* Left side content */}
//                                         <div className="w-full space-y-4 p-6 md:w-1/2">
//                                             <div className="flex items-center justify-between">
//                                                 <h2 className="text-xl font-bold md:text-2xl">
//                                                     Log in or sign up in seconds
//                                                 </h2>
//                                             </div>
//                                             <p className="text-sm text-muted-foreground">
//                                                 Use your email or another service to continue with Canva
//                                                 (it&apos;s free)!
//                                             </p>
//                                             <div className="space-y-3">
//                                                 {/* Google Button */}
//                                                 <Button
//                                                     variant="outline"
//                                                     className="w-full justify-start py-2"
//                                                     onClick={handleGoogleLogin}
//                                                 >
//                                                     <div className="flex w-full items-center justify-between">
//                                                         <div className="flex items-center gap-2">
//                                                             <FcGoogle className="h-5 w-5 md:h-6 md:w-6" />
//                                                             <span className="text-sm md:text-base">
//                                                                 Continue with Google
//                                                             </span>
//                                                         </div>
//                                                         {isLoggingIn.auth === "GOOGLE" &&
//                                                             isLoggingIn.isLoading && (
//                                                                 <Loading className="h-4 w-4 animate-spin" />
//                                                             )}
//                                                     </div>
//                                                 </Button>

//                                                 {/* Facebook Button */}
//                                                 <Button
//                                                     variant="outline"
//                                                     className="w-full justify-start py-2"
//                                                 >
//                                                     <div className="flex w-full items-center justify-between">
//                                                         <div className="flex items-center gap-2">
//                                                             <FaFacebook
//                                                                 className="h-5 w-5 md:h-6 md:w-6"
//                                                                 color="#1877F2"
//                                                             />
//                                                             <span className="text-sm md:text-base">
//                                                                 Continue with Facebook
//                                                             </span>
//                                                         </div>
//                                                         {isLoggingIn.auth === "FACEBOOK" &&
//                                                             isLoggingIn.isLoading && (
//                                                                 <Loading className="h-4 w-4 animate-spin" />
//                                                             )}
//                                                     </div>
//                                                 </Button>

//                                                 {/* Github Button */}
//                                                 <Button
//                                                     variant="outline"
//                                                     className="w-full justify-start py-2"
//                                                 >
//                                                     <div className="flex w-full items-center justify-between">
//                                                         <div className="flex items-center gap-2">
//                                                             <FaGithub className="h-5 w-5 md:h-6 md:w-6" />
//                                                             <span className="text-sm md:text-base">
//                                                                 Continue with Github
//                                                             </span>
//                                                         </div>
//                                                         {isLoggingIn.auth === "GITHUB" &&
//                                                             isLoggingIn.isLoading && (
//                                                                 <Loading className="h-4 w-4 animate-spin" />
//                                                             )}
//                                                     </div>
//                                                 </Button>
//                                             </div>

//                                             <Button
//                                                 variant="link"
//                                                 className="w-full text-sm md:text-base"
//                                             >
//                                                 Continue another way
//                                             </Button>
//                                             <p className="text-xs text-muted-foreground">
//                                                 By continuing, you agree to Canva&apos;s Terms of Use.
//                                                 Read our Privacy Policy.
//                                             </p>
//                                             <Button
//                                                 variant="link"
//                                                 className="w-full justify-start p-0 text-sm md:text-base"
//                                             >
//                                                 Sign up with your work email
//                                             </Button>
//                                         </div>
//                                         {/* Right side image */}
//                                         <div className="hidden w-full overflow-hidden md:flex md:h-auto md:w-1/2">
//                                             <Image
//                                                 src="https://images.unsplash.com/photo-1710875236077-24fdbe86b116?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwcm9maWxlLWxpa2VkfDJ8fHxlbnwwfHx8fHw%3D"
//                                                 alt="Person using laptop with 'Design with ease' on screen"
//                                                 className="h-full w-full rounded-b-lg object-cover md:rounded-r-lg md:rounded-bl-none"
//                                                 width={500}
//                                                 height={489}
//                                             />
//                                         </div>
//                                     </div>
//                                 </CardContent>
//                             </Card>
//                         </DialogContent>

//                         <div className="z-50 flex flex-col md:hidden">
//                             <Drawer open={isMobile && isOpen} onClose={onClose}>
//                                 <DrawerTrigger>Open</DrawerTrigger>
//                                 <DrawerContent className="z-50 m-0 flex flex-col rounded-t-lg p-0 md:hidden">
//                                     <Card className="z-[99] m-0 h-auto w-full border-0 p-0">
//                                         <CardContent className="m-0 border-0 p-0">
//                                             <div className="flex h-fit flex-col">
//                                                 <div className="w-full space-y-4 p-6">
//                                                     <div className="flex items-center justify-between">
//                                                         <h2 className="text-xl font-bold md:text-2xl">
//                                                             Log in or sign up in seconds
//                                                         </h2>
//                                                     </div>
//                                                     <p className="text-sm text-muted-foreground">
//                                                         Use your email or another service to continue with
//                                                         Canva (it&apos;s free)!
//                                                     </p>
//                                                     <div className="space-y-3">
//                                                         <Button
//                                                             variant="outline"
//                                                             className="w-full justify-start py-2"
//                                                             onClick={handleGoogleLogin}
//                                                         >
//                                                             <div className="flex w-full items-center justify-between">
//                                                                 <div className="flex items-center gap-2">
//                                                                     <FcGoogle className="h-5 w-5 md:h-6 md:w-6" />
//                                                                     <span className="text-sm md:text-base">
//                                                                         Continue with Google
//                                                                     </span>
//                                                                 </div>
//                                                                 {isLoggingIn.auth === "GOOGLE" &&
//                                                                     isLoggingIn.isLoading && (
//                                                                         <Loading className="h-4 w-4 animate-spin" />
//                                                                     )}
//                                                             </div>
//                                                         </Button>

//                                                         <Button
//                                                             variant="outline"
//                                                             className="w-full justify-start py-2"
//                                                         >
//                                                             <div className="flex w-full items-center justify-between">
//                                                                 <div className="flex items-center gap-2">
//                                                                     <FaFacebook
//                                                                         className="h-5 w-5 md:h-6 md:w-6"
//                                                                         color="#1877F2"
//                                                                     />
//                                                                     <span className="text-sm md:text-base">
//                                                                         Continue with Facebook
//                                                                     </span>
//                                                                 </div>
//                                                                 {isLoggingIn.auth === "FACEBOOK" &&
//                                                                     isLoggingIn.isLoading && (
//                                                                         <Loading className="h-4 w-4 animate-spin" />
//                                                                     )}
//                                                             </div>
//                                                         </Button>

//                                                         <Button
//                                                             variant="outline"
//                                                             className="w-full justify-start py-2"
//                                                         >
//                                                             <div className="flex w-full items-center justify-between">
//                                                                 <div className="flex items-center gap-2">
//                                                                     <FaGithub className="h-5 w-5 md:h-6 md:w-6" />
//                                                                     <span className="text-sm md:text-base">
//                                                                         Continue with Github
//                                                                     </span>
//                                                                 </div>
//                                                                 {isLoggingIn.auth === "GITHUB" &&
//                                                                     isLoggingIn.isLoading && (
//                                                                         <Loading className="h-4 w-4 animate-spin" />
//                                                                     )}
//                                                             </div>
//                                                         </Button>
//                                                     </div>

//                                                     <Button
//                                                         variant="link"
//                                                         className="w-full text-sm md:text-base"
//                                                     >
//                                                         Continue another way
//                                                     </Button>
//                                                     <p className="text-xs text-muted-foreground">
//                                                         By continuing, you agree to Canva&apos;s Terms of
//                                                         Use. Read our Privacy Policy.
//                                                     </p>
//                                                     <Button
//                                                         variant="link"
//                                                         className="w-full justify-start p-0 text-sm md:text-base"
//                                                     >
//                                                         Sign up with your work email
//                                                     </Button>
//                                                 </div>
//                                             </div>
//                                         </CardContent>
//                                     </Card>
//                                 </DrawerContent>
//                             </Drawer>
//                         </div>
//                     </>
//                 );

//             case "LOADING":
//                 return <Loading className="h-4 w-4 animate-spin" />;
//             default:
//                 return null;
//         }
//     };

//     return (
//         <Dialog open={isOpen} onOpenChange={onClose}>
//             {renderModalContent()}
//         </Dialog>
//     );
// };

// export default Modal;

"use client";

import React, { ReactNode } from "react"; // Import ReactNode
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { Input } from "../ui/input";

import { geistSans } from "@/lib/font";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { FaFacebook, FaGithub } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import Loading from "../global/loading";

import { useMediaQuery } from "react-responsive";
import { useRouter } from "next/navigation";
import { useToast } from "@/hook/use-toast";
import { useModal } from "@/hook/use-modal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/drawer";

interface ModalProps {
  children?: ReactNode;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({ children, className }) => {
  const { toast } = useToast();
  const [isLoggingIn, setIsLoggingIn] = useState<{
    isLoading: boolean;
  }>({
    isLoading: false,
  });
  const router = useRouter();
  const { data: sess, status } = useSession();

  const { isOpen, modalType, onClose, onOpen } = useModal();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  const toggleDrawer = () => {
    setIsDrawerOpen((prev) => !prev);
  };

  const renderModalContent = () => {
    switch (modalType) {
      case "VIEW_STOCK":
        return (
          <>
            <DialogContent
              className={cn(
                "z-[999] m-0 gap-0 rounded-lg border-0 p-0 sm:max-w-[425px] md:max-w-[725px]",
                className,
              )}
            >
              {children}
            </DialogContent>
          </>
        );

      case "LOADING":
        return <Loading className="h-4 w-4 animate-spin" />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {renderModalContent()}
    </Dialog>
  );
};

export default Modal;
