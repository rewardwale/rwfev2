"use client";
import { ReactNode, useEffect, useState } from "react";
import SearchInputBox from "./search-Input";

export default function SearchInputContainer() {
  const [input, setinput] = useState<string | null>("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paramInput = params.get("i");
    setinput(paramInput);
  }, []);

  const handleEnterPress = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // router.push("/search?i=" + input);
      location.href = "/searchNew/dashBoard?i=" + input;
    }
  };

  const handleSearchOnClick = (e: any) => {
    e.preventDefault();
    // router.push("/search?i=" + input);
    location.href = "/searchNew/dashBoard?i=" + input;
  };

  return (
    <SearchInputBox
      handleEnterPress={handleEnterPress}
      handleSearchOnClick={handleSearchOnClick}
      handleSearchInput={(value: string) => setinput(value)}
    />
  );
}
