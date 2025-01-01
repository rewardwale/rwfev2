"use client";

import { useEffect, useState } from "react";
import { fetchLandingPageData } from "../apis/landing-page";
import LandingPage from "@/home/landing-page";


export default function Home() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const getData = async () => {
      const landingPageData = await fetchLandingPageData();
      if (landingPageData) {
        setData(landingPageData);
      }
    };
    getData();
  }, []);

  const localData = localStorage.getItem("ubi")
  // const parsedData = JSON.parse(localData)

  console.log("checking for data", localData);

  return (
    <div className="!scroll-smooth">
      <main>
        <ol
          className="list-inside list-decimal text-sm text-center sm:text-left
            font-[family-name:var(--font-geist-mono)]"
        >
          <div>
            <LandingPage categoriesData={data} />
          </div>
        </ol>
      </main>
    </div>
  );
}
