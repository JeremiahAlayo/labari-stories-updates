const isGithubPages = process.env.GITHUB_PAGES === "true";
const githubPagesBasePath = "/labari-stories-updates";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: isGithubPages ? githubPagesBasePath : undefined,
  assetPrefix: isGithubPages ? githubPagesBasePath : undefined,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
