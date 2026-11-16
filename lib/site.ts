/**
 * Public origin of the deployed site. Also baked into the registry URL that
 * consumers store in their components.json (see content/docs/installation.mdx),
 * so changing it breaks existing installs unless the old host keeps redirecting
 * /r/* to the new one.
 */
export const SITE_URL = "https://ui.rezianislami.com";

/** The Rezi UI repo, linked from the docs header, the landing "Star on GitHub" button and the footer. */
export const GITHUB_URL = "https://github.com/rezianislami/reziui";

/**
 * The form every page is served at: next.config sets `trailingSlash: true`, so
 * /docs/x 308s to /docs/x/. Sitemap entries and canonical links use this form
 * so neither points Google at a redirect.
 */
export const withTrailingSlash = (path: string) => (path.endsWith("/") ? path : `${path}/`);
