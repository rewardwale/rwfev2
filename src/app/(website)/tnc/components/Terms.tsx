import React from "react";

import MerchantTerm from "./MerchantTerm";
import UserTerm from "./UserTerm";

export default function Terms() {


    return (
        <section className="bg-white dark:bg-zinc-900 min-h-screen md:border md:rounded-lg flex flex-col justify-center md:mx-20 lg:mx-40 shadow-lg shadow-violet-200 text-neutral-100">
            <UserTerm />
            <MerchantTerm />
        </section>
    );
}
