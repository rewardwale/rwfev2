import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const env = process.env.NEXT_PUBLIC_ENV;

  if (env === "production") {
    return {
      rules: {
        userAgent: "*",
        allow: "/",
      },
      sitemap: "https://rewardwale.com/sitemap.xml",
    };
  } else {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
      sitemap: "https://rw-uat.xyz/sitemap.xml",
    };
  }
}
