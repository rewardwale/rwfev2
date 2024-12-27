"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  Bell,
  UserCircle2,
  Upload,
  Settings,
  LogOut,
  SearchIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Sidebar } from "./sidebar";
import { useState } from "react";


interface searchProps {
  handleEnterPress: (e: any) => void;
  handleSearchOnClick: (e: any) => void;
  handleSearchInput: (value: string) => void;
}

export function Header({ handleEnterPress, handleSearchOnClick,handleSearchInput }: searchProps) {
  const router = useRouter();

  return (
    <header
      className="flex items-center justify-between px-4 h-16 border-b sticky top-0 bg-background
        z-50"
    >
      <div className="flex items-center gap-4">
        {/* <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
        </Button> */}
        <Sidebar />
      </div>

      <div className="flex items-center flex-1 max-w-2xl mx-4">
        <div className="flex items-center w-full">
          <div className="relative flex-1 flex">
            {/* <Input
              type="search"
              placeholder="Search"
              className="pr-10"
              style={{
                borderRadius: "18px",
              }}
              value={search}
              onChange={(e) => handleSearchResult(e.target.value)}
            /> */}

            <Input
              type="search"
              placeholder="Search"
              className="pr-10"
              style={{
                borderRadius: "18px",
              }}
              onKeyDown={(e) => handleEnterPress(e)}
              onChange={(e) => handleSearchInput(e.target.value)}
              required
            />
            <SearchIcon className="cursor-pointer"  onClick={(e) => handleSearchOnClick(e)}/>

           
          </div>
          {/* <Button size="icon" className="rounded-r-full px-4">
            <Search className="h-5 w-5" />
          </Button> */}
          {/* <Button variant="ghost" size="icon" className="ml-2">
            <Mic className="h-5 w-5" />
          </Button> */}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button> */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <UserCircle2 className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                localStorage.removeItem("uib");
                localStorage.removeItem("token");
                router.push("/");
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
