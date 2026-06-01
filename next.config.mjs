import { withSentryConfig } from "@sentry/nextjs"

/** @type {import('next').NextConfig} */
const nextConfig = {}

export default withSentryConfig(nextConfig, {
  // Source map upload requires SENTRY_AUTH_TOKEN. Until that's wired up,
  // we ship without uploads — stack traces will be minified in Sentry but
  // errors still arrive.
  silent: true,
  dryRun: !process.env.SENTRY_AUTH_TOKEN,
  hideSourceMaps: true,
})
