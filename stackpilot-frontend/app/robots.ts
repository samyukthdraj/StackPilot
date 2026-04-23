import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  // Use environment variable for base URL if available, fallback to production
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://stackpilot-jext.onrender.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/admin/", "/profile/", "/settings/", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
