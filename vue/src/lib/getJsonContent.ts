import type { CustomShowMetadata, JSONContent } from "./types";

import { generateHTML, generateText, type JSONContent as TipTapJsonContent } from "@tiptap/core"
import { parse } from "yaml";
import Document from "@tiptap/extension-document"
import Bold from "@tiptap/extension-bold"
import BlockQuote from "@tiptap/extension-blockquote"
import Strike from "@tiptap/extension-strike";
import Italic from "@tiptap/extension-italic";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import ListItem from "@tiptap/extension-list-item";
import HardBreak from "@tiptap/extension-hard-break";

const extensions = [
    Document,
    Bold,
    BlockQuote,
    Strike,
    Italic,
    Paragraph,
    Text,
    ListItem,
    HardBreak
]

export const getBasicJsonContent = (json: JSONContent) =>
    json.content[0].content[0].text


export const getHtmlFromTipTapJson = (doc: TipTapJsonContent, removeBlockQuote = true) => {
    if(removeBlockQuote) {
        if(doc.content) {
            doc.content = doc.content?.filter(content => 
                content.type !== "blockquote"
            )
        }
    }

    return generateHTML(doc, extensions)
}

export const getYamlFromTipTapJson = (doc: TipTapJsonContent): CustomShowMetadata | null => {
    if(doc.content) {
        const blockQuote = doc.content?.find(content => 
            content.type === "blockquote"
        )

        if(!blockQuote) { return null }

        const yamlString = generateText(blockQuote, extensions)

        try {
            const yaml = parse(yamlString)
            return yaml
            
        }
        catch(_) {
            return null
        }
    }

    return null
}