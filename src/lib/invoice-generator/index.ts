import { transformXml } from "@/helpers/xml";
import { BaseXmlItem } from "@/types";

export const generateInvoiceHtml = async ({
  xsltPath,
  xmlString,
  xmlMockParams,
}: {
  xsltPath: string;
  xmlString: string;
  xmlMockParams?: BaseXmlItem;
}) => {
  const response = await fetch(xsltPath);
  const data = await response.text();
  console.log({ data });
  const transformedHtml = transformXml(data, xmlString, xmlMockParams);
  console.log({ transformedHtml, xmlString });
  return transformedHtml;
};
