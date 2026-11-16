/**
 * Public origin of the deployed site. Also baked into the registry URL that
 * consumers store in their components.json (see content/docs/installation.mdx),
 * so changing it breaks existing installs unless the old host keeps redirecting
 * /r/* to the new one.
 */
export const SITE_URL = "https://ui.rezianislami.com";

/** The Rezi UI repo, linked from the docs header, the landing "Star on GitHub" button and the footer. */
export const GITHUB_URL = "https://github.com/rezianislami/reziui";
