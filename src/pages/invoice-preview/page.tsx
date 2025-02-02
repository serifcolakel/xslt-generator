import { generateInvoiceHtml } from "@/lib/invoice-generator";
import { useRef, useState } from "react";
import {
  generateClientInfo,
  generateCompanyInfo,
  generateHeader,
  generateInvoiceInfo,
  generateInvoiceList,
} from "@/lib/mocks";
import { listToXml, objectToXml, variableToXml } from "@/helpers/xml";
import { getNow } from "@/helpers/date";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";

const documentTitle = "Invoice Preview";

export default function InvoicePreviewPage() {
  const [html, setHtml] = useState<string>("");
  const [isPrinting, setIsPrinting] = useState<boolean>(false);
  const componentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current!,
    documentTitle,
    onBeforePrint() {
      setIsPrinting(true);
    },
    onAfterPrint() {
      setIsPrinting(false);
    },
  });

  const handleSetHtml = async () => {
    const list = generateInvoiceList(5);
    const companyInfo = generateCompanyInfo();
    const clientInfo = generateClientInfo();
    const invoiceInfo = generateInvoiceInfo();
    const headerInfo = generateHeader();
    const now = getNow();
    const xmlString = `
        <Invoices>
            <Invoice>
                ${variableToXml("createDate", now)}
                ${objectToXml("companyInfo", companyInfo)}
                ${objectToXml("clientInfo", clientInfo)}
                ${objectToXml("headerInfo", headerInfo)}
                ${objectToXml("invoiceInfo", invoiceInfo)}
                ${listToXml("invoiceItems", "invoiceItem", list)}
            </Invoice>
            <Invoice>
                ${variableToXml("createDate", now)}
                ${objectToXml("companyInfo", companyInfo)}
                ${objectToXml("clientInfo", clientInfo)}
                ${objectToXml("headerInfo", headerInfo)}
                ${objectToXml("invoiceInfo", invoiceInfo)}
                ${listToXml("invoiceItems", "invoiceItem", list)}
            </Invoice>
        </Invoices>
    `;
    const html = await generateInvoiceHtml({
      xsltPath: "test.xslt",
      xmlString,
    });
    setHtml(html);
  };

  return (
    <div className="w-full mx-auto">
      <header className="flex justify-center space-x-4 mb-4">
        <Button
          disabled={isPrinting || !html}
          onClick={handlePrint}
          className=""
        >
          Print
        </Button>
        <Button onClick={handleSetHtml} className="">
          Generate HTML
        </Button>
      </header>
      <div ref={componentRef} className="flex flex-col items-center bg-white">
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}
