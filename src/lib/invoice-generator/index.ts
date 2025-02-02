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

  const transformedHtml = transformXml(data, xmlString, xmlMockParams);

  return transformedHtml;
};
