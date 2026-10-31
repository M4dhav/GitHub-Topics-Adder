import type { MetadataRoute } from "next";
import { siteUrl } from "./site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // No lastModified: a build-time `new Date()` is non-deterministic, which
    // would opt this route out of static generation under cacheComponents.
    {
      url: siteUrl,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
