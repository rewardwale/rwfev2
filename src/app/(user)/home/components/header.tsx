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
  Handshake,
  MapPin,
  Wallet,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Sidebar } from "./sidebar";
import { useEffect, useState } from "react";
import SearchInputContainer from "../../search/components/search-Input-component";
import { useIsMobile } from "@/hooks/use-mobile";
import { logout } from "@/apis/home";
import { isUserLoggedIn } from "@/lib/utils";

import whiteLogo from "../../../../../public/brand_logo/PNG/RW_White_Name.png";
import blackLogo from "../../../../../public/brand_logo/PNG/RW_Black_Name.png";

import Image from "next/image";
import { ThemeModeToggle } from "@/components/theme-mode-toggle";
import { LocationModal } from "./location-modal";
import { WalletModal } from "./wallet-modal";

interface LocationData {
  city: string;
  state: string;
  country: string;
  lat: number;
  lng: number;
  formatted_address: string;
}
export function Header() {
  const isMobile = useIsMobile();
  const router = useRouter();
  const isLoggedIn = isUserLoggedIn();
  const isHome = window.location.pathname === "/";
  const [location, setLocation] = useState<{
    city: string;
    state: string;
    country: string;
  } | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);

  const userDataString = localStorage.getItem("uib");

  const getCityFromCoordinates = async (
    lat: number,
    lng: number,
  ): Promise<LocationData | null> => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
      );
      const data = await response.json();

      if (data.status === "OK" && data.results.length > 0) {
        const result = data.results[0];
        const addressComponents = result.address_components;

        let city = "";
        let state = "";
        let country = "";

        for (const component of addressComponents) {
          if (component.types.includes("locality")) {
            city = component.long_name;
          } else if (
            component.types.includes("administrative_area_level_2") &&
            !city
          ) {
            city = component.long_name;
          } else if (component.types.includes("administrative_area_level_1")) {
            state = component.long_name;
          } else if (component.types.includes("country")) {
            country = component.long_name;
          }
        }

        return {
          city: city || "Unknown",
          state,
          country,
          lat,
          lng,
          formatted_address: result.formatted_address || "",
        };
      }
      return null;
    } catch (error) {
      console.error("Error fetching location:", error);
      return null;
    }
  };

  // Load location on component mount
  useEffect(() => {
    const loadLocation = async () => {
      try {
        const lat = localStorage.getItem("loc_lat");
        const lng = localStorage.getItem("loc_lng");

        if (lat && lng) {
          const locationData = await getCityFromCoordinates(
            parseFloat(lat),
            parseFloat(lng),
          );
          setLocation(locationData);
        }
      } catch (error) {
        console.error("Error loading location:", error);
      } finally {
        setLoadingLocation(false);
      }
    };

    if (isLoggedIn) {
      loadLocation();
    } else {
      setLoadingLocation(false);
    }
  }, [isLoggedIn]);

  const handleLocationUpdate = (newLocation: LocationData) => {
    // Update localStorage with new coordinates
    localStorage.setItem("loc_lat", newLocation.lat.toString());
    localStorage.setItem("loc_lng", newLocation.lng.toString());

    // Update local state
    setLocation({
      city: newLocation.city,
      state: newLocation.state,
      country: newLocation.country,
    });
  };

  return (
    <>
      <header
        className="flex items-center justify-between lg:px-6 h-16 sticky top-0 bg-background z-50"
        style={{
          paddingTop: "12px",
          paddingBottom: "12px",
          // marginBlockEnd: "8px",
        }}
      >
        <div className="flex items-center gap-4">
          {/* <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
        </Button> */}
          {isMobile && <Sidebar />}
        </div>
        {!isMobile && (
          <div
            onClick={() => router.push("/")}
            onKeyUp={(e) => {
              if (e.key === "Enter") router.push("/");
            }}
            tabIndex={0}
            role="button"
          >
            <Image
              alt="Rewardwale"
              src={whiteLogo}
              className="w-[160px] hidden dark:inline"
            />
            <Image
              alt="Rewardwale"
              src={blackLogo}
              className="w-[160px] inline dark:hidden"
            />
          </div>
        )}
        {
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 text-sm hover:text-foreground"
            onClick={() => setShowLocationModal(true)}
          >
            <MapPin className="h-8 w-8" />
            {loadingLocation ? (
              <span>Loading...</span>
            ) : location ? (
              <span>{location.city}</span>
            ) : (
              <span>Set location</span>
            )}
          </Button>
        }
        <div className={"flex items-center w-[100%] justify-center"}>
          <SearchInputContainer />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowWalletModal(true)}
          >
            <Wallet className="h-8 w-8" />
          </Button>
          <div className="hidden md:flex items-center space-x-4">
            <ThemeModeToggle />
          </div>
          {!isHome && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <UserCircle2 className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("createBusiness")}>
                  <Handshake className="mr-2 h-4 w-4" />
                  Create Business Profile
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={async () => {
                    await logout();
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
          )}
          {isHome && (
            <Button
              onClick={() => {
                isLoggedIn ? router.push("/home") : router.push("/login");
              }}
              className="px-4 py-2 rounded-md hover:bg-blue-700"
            >
              {isLoggedIn ? "Home" : "Log In"}
            </Button>
          )}
        </div>
      </header>
      {/* Location Modal */}
      <LocationModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        currentLocation={location}
        onLocationUpdate={handleLocationUpdate}
      />
      <WalletModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
      />
    </>
  );
}
