import { ReactNode } from "react";
import SearchInputContainer from "../components/search-Input-component";

interface Layout {
  Review: ReactNode;
  User: ReactNode;
  Merchant: ReactNode;
  // children: ReactNode;
}

export default function SearchLayout({
  Review,
  User,
  Merchant,
}: // children,
Layout) {
  return (
    <main className="h-full w-[100%] ">
      {/* <div className=" justify-center flex">
        <SearchInputContainer />
      </div> */}
      <section className="p-2">{Review}</section>
      <section className="p-2">{User}</section>
      <section className="p-2">{Merchant}</section>

      {/* {children} */}
    </main>
  );
}
