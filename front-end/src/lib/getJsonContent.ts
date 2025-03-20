import type { JSONContent } from "./types";

export const getJsonContent = (json: JSONContent) =>
    json.content[0].content[0].text
