/**
 * Public origin of the deployed site. Also baked into the registry URL that
 * consumers store in their components.json (see content/docs/installation.mdx),
 * so changing it breaks existing installs unless the old host keeps redirecting
 * /r/* to the new one.
 */
export const SITE_URL = "https://reziui.rezianislami.workers.dev";
