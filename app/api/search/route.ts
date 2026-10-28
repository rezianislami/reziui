import { source } from "@/lib/source";
import { createFromSource } from "fumadocs-core/search/server";

// Static export has no server to answer queries, so this route emits the whole
// index once at build and the client searches it locally (useStaticSearch).
export const dynamic = "force-static";

export const { staticGET: GET } = createFromSource(source);
