// Absolute base URL for robots.txt, sitemap.xml and metadata. Set
// NEXT_PUBLIC_SITE_URL in your host's environment once the site has a domain.
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/+$/, "");

export const repoUrl = "https://github.com/M4dhav/GitHub-Topics-Adder";
export const authorUrl = "https://github.com/M4dhav";
