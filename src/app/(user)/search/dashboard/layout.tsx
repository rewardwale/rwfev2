import { ReactNode } from "react";

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
    <main className="h-screen w-[100%] ">
      <div>
  
      </div>
      <section className="  p-2">{Review}</section>
      <section className="  p-2">{User}</section>
      <section className="  p-2">{Merchant}</section>

      {/* {children} */}
    </main>
  );
}
