"use client"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface searchProps {
  handleEnterPress: (e: any) => void;
  handleSearchOnClick: (e: any) => void;
  handleSearchInput: (value: string) => void;
}

export default function SearchInputBox({
  handleEnterPress,
  handleSearchOnClick,
  handleSearchInput,
}: searchProps) {
  return (
    <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <form>
        <div className="relative flex">
          {/* <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" /> */}
          <Input
            placeholder="Search Here"
            onKeyDown={(e) => handleEnterPress(e)}
            onChange={(e) => handleSearchInput(e.target.value)}
            required
          />

          <Button
            type="submit"
            className="text-white bg-purple-500 hover:bg-purple-600 
        focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-r-lg text-sm px-4 py-2
         dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800"
            onClick={(e) => handleSearchOnClick(e)}
          >
            Search
          </Button>
        </div>
      </form>
    </div>
  );
}
