import { BaseXmlItem } from "@/types";

/**
 * Transforms an XML string using an XSLT string, with optional parameters.
 * @param {string} xsltString The XSLT string.
 * @param {string} xmlString The XML string.
 * @param {BaseXmlItem} params Optional parameters to pass to the XSLT.
 * @returns The transformed HTML string.
 */
export function transformXml(
  xsltString: string,
  xmlString: string,
  params: BaseXmlItem = {}
): string {
  const parser = new DOMParser();
  const xsltProcessor = new window.XSLTProcessor();

  const xsltDoc = parser.parseFromString(xsltString, "application/xml");
  const xmlDoc = parser.parseFromString(xmlString, "application/xml");

  xsltProcessor.importStylesheet(xsltDoc);

  Object.entries(params).forEach(([key, value]) => {
    xsltProcessor.setParameter(null, key, value);
  });

  xsltProcessor.setParameter(
    null,
    "create-date",
    new Intl.DateTimeFormat("en-US", {
      dateStyle: "full",
      timeStyle: "long",
    }).format(new Date())
  );

  // const date = xsltProcessor.getParameter(null, "create-date");

  const resultDocument = xsltProcessor.transformToDocument(xmlDoc);

  return new XMLSerializer().serializeToString(resultDocument);
}

/**
 * @description Converts a list of items to an XML string.
 * @param {string} tagName The name of the root tag.
 * @param {string} itemName The name of the item tag.
 * @param {BaseXmlItem[]} items The items to convert to XML.
 * @returns {string} The XML string.
 */
export function listToXml(
  tagName: string,
  itemName: string,
  items: BaseXmlItem[]
): string {
  return `<${tagName}>${items
    .map(
      (item) =>
        `<${itemName}>
            ${Object.entries(item).map(
              ([key, value]) => `<${key}>${value}</${key}>`
            )}
        </${itemName}>`
    )
    .join("")}</${tagName}>`;
}

/**
 * @description Converts an object to an XML string.
 * @param {string} tagName The name of the root tag.
 * @param {BaseXmlItem} obj The object to convert to XML.
 * @returns {string} The XML string.
 */
export function objectToXml(tagName: string, obj: BaseXmlItem): string {
  return `<${tagName}>
    ${Object.entries(obj).map(([key, value]) => `<${key}>${value}</${key}>`)}
  </${tagName}>`;
}

export const variableToXml = (name: string, value: string) => {
  return `<${name}>${value}</${name}>`;
};
