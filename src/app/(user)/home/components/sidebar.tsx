"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Home,
  Library,
  Menu,
  Wallet,
  CircleEllipsis,
  UserRound,
  Bookmark,
  CircleHelp,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const router = useRouter();
  const SidebarContent = () => (
    <ScrollArea className="h-screen">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
            className="space-y-1 flex-col gap-12"
          >
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => router.push("/home")}
            >
              <Home className="mr-2 h-4 w-4" />
              Reviews
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => router.push("/post")}
            >
              <Library className="mr-2 h-4 w-4" />
              Post
            </Button>
            <Button variant="ghost" className="w-full justify-start" 
            onClick={() => router.push('/bookmark')}
            >
              <Bookmark className="mr-2 h-4 w-4" />
              Bookmarks
            </Button>
            {/* <Button variant="ghost" className="w-full justify-start">
              <Wallet className="mr-2 h-4 w-4" />
              Wallet
            </Button> */}
            {/* <Button variant="ghost" className="w-full justify-start">
              <CircleHelp className="mr-2 h-4 w-4" />
              FAQs
            </Button> */}
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => router.push("/profile/lokesh")}
            >
              <UserRound className="mr-2 h-4 w-4" />
              My Profile
            </Button>
            {/* <Button variant="ghost" className="w-full justify-start">
              <CircleEllipsis className="mr-2 h-4 w-4" />
              More
            </Button> */}
          </div>
        </div>
        <Separator />
        {/* <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Explore
          </h2>
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start">
              <Flame className="mr-2 h-4 w-4" />
              Trending
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Shopping
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Music2 className="mr-2 h-4 w-4" />
              Music
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Film className="mr-2 h-4 w-4" />
              Movies
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Radio className="mr-2 h-4 w-4" />
              Live
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Gamepad2 className="mr-2 h-4 w-4" />
              Gaming
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Newspaper className="mr-2 h-4 w-4" />
              News
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Trophy className="mr-2 h-4 w-4" />
              Sports
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Lightbulb className="mr-2 h-4 w-4" />
              Learning
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Shirt className="mr-2 h-4 w-4" />
              Fashion
            </Button>
          </div>
        </div> */}
      </div>
    </ScrollArea>
  );

  return (
    <>
      <aside className={cn("pb-12 w-64 hidden md:block", className)}>
        <SidebarContent />
      </aside>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
}
