"use client";

import {
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { useUser } from "@/hook/useUser";
import { TUser } from "@/type";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { P } from "./ui/typography";

const UserAvatar = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleNavigation = (route: string) => {
    router.push(route);
  };

  const { user } = useUser();

  return (
    <div className="hidden md:flex ">
      {session && status === "authenticated" ? (
        <Tooltip>
          <TooltipTrigger>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer ">
                  <div className="group relative h-10 w-10 overflow-hidden rounded-full  ">
                    <AvatarImage
                      src={session.user?.image as string}
                      alt={session.user?.name as string}
                      className="hover:shine-effect relative"
                    />{" "}
                    <div className="absolute inset-0 rotate-45 scroll-smooth bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition-all group-hover:animate-shine group-hover:opacity-100" />
                  </div>
                  <AvatarFallback className="absolute inset-0">
                    <div className="h-full w-full rounded-full bg-gradient-to-br from-rose-600 via-purple-800 to-blue-800" />
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mr-4 mt-2 w-56 border-[0.1px] border-zinc-700/50 md:mr-20 lg:mr-16 xl:mr-44">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() =>
                      handleNavigation(`/u/${user?.id.toString()}`)
                    }
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleNavigation("/billing")}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Billing</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleNavigation("/settings")}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/login" })}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TooltipTrigger>
          {/* <TooltipContent>
            <div className="flex flex-col items-start justify-start gap-0.5">
              <P className="mt-0">{session.user?.name}</P>
              <P className="mt-0">{session.user?.email}</P>
            </div>
          </TooltipContent> */}
        </Tooltip>
      ) : null}
    </div>
  );
};

export default UserAvatar;
