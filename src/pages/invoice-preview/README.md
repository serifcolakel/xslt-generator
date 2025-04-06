# Modern Invoice Generation with XSLT and React: A Seamless Integration Guide

_Combine legacy XML transformations with modern web tools for robust document workflows._

This guide demonstrates how to integrate XSLT (Extensible Stylesheet Language Transformations) with React to create a modern invoice generation system. By leveraging XSLT's powerful transformation capabilities and React's dynamic UI rendering, you can build a flexible and scalable solution for generating invoices, reports, and other formatted documents.

---

## Links

- [GitHub Repository](https://github.com/serifcolakel/xslt-generator)
- [Live Demo](https://xslt-generator-tvlk.vercel.app/invoice-preview)

---

## Table of Contents

- [Introduction](#introduction)
- [Why XSLT Still Matters](#why-xslt-still-matters)
- [Setting Up Your React Environment](#setting-up-your-react-environment)
- [Integrating XSLT with React](#integrating-xslt-with-react)
- [Core Implementation](#core-implementation)
  - [XSLT Template (Invoice Engine)](#xslt-template-invoice-engine)
  - [React Component Example](#react-component-example)
- [Key Features](#key-features)
- [React Integration](#react-integration)
- [Architecture Benefits](#architecture-benefits)
- [Performance](#performance)
- [Maintainability](#maintainability)
- [When to Use This Stack](#when-to-use-this-stack)
- [Ready to Implement?](#ready-to-implement)
- [Conclusion](#conclusion)

## Introduction

Invoicing is a critical aspect of business operations, requiring accurate and efficient document generation. While modern web technologies have simplified many aspects of document workflows, XSLT remains a powerful tool for transforming XML data into formatted documents.

This guide explores how to integrate XSLT with React to create a seamless invoice generation system. By combining XSLT's transformation capabilities with React's dynamic UI rendering, you can build a flexible and scalable solution for generating invoices, reports, and other formatted documents.

## Why XSLT Still Matters

In an era dominated by JSON and REST APIs, XSLT (Extensible Stylesheet Language Transformations) remains unmatched for:

- 📄 Complex XML-to-HTML/PDF transformations
- 🖨️ Print-ready document workflows
- 🏢 Enterprise invoice systems
- 📱 Multi-format output from single sources

---

## Setting Up Your React Environment

To get started, ensure you have a React environment set up. You can use tools like Create React App to quickly bootstrap your project. Once your environment is ready, you can begin integrating XSLT for invoice generation.

## Integrating XSLT with React

1. XML and XSLT Files: Begin by creating your XML and XSLT files. The XML file will contain the data for your invoices, while the XSLT file will define how this data should be transformed into an HTML invoice.

- Example XML Structure:

```xml
   <Invoices>
     <Invoice>
       <companyInfo>
         <name>ABC Corp</name>
         <address>123 Main St</address>
       </companyInfo>
       <clientInfo>
         <name>John Doe</name>
         <address>456 Elm St</address>
       </clientInfo>
       <invoiceItems>
         <invoiceItem>
           <name>Product 1</name>
           <quantity>2</quantity>
           <price>50</price>
         </invoiceItem>
       </invoiceItems>
     </Invoice>
   </Invoices>
```

- Example XSLT Structure:

```xml
    <?xml version="1.0" encoding="UTF-8"?>
   <xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
     <xsl:output method="html" indent="yes" encoding="UTF-8" />
     <xsl:template match="/Invoices">
       <html>
         <body>
           <xsl:for-each select="Invoice">
             <div class="invoice">
               <h1>Invoice for <xsl:value-of select="clientInfo/name" /></h1>
               <p>Company: <xsl:value-of select="companyInfo/name" /></p>
               <p>Address: <xsl:value-of select="clientInfo/address" /></p>
               <table>
                 <tr>
                   <th>Product</th>
                   <th>Quantity</th>
                   <th>Price</th>
                 </tr>
                 <xsl:for-each select="invoiceItems/invoiceItem">
                   <tr>
                     <td><xsl:value-of select="name" /></td>
                     <td><xsl:value-of select="quantity" /></td>
                     <td><xsl:value-of select="price" /></td>
                   </tr>
                 </xsl:for-each>
               </table>
             </div>
           </xsl:for-each>
         </body>
       </html>
     </xsl:template>
   </xsl:stylesheet>
```

## Core Implementation

Transforming XML with XSLT in React: Use the DOMParser and XSLTProcessor APIs available in modern browsers to transform your XML data using the XSLT stylesheet.

_Full code available on [GitHub](#)_

### 1. XSLT Template (Invoice Engine)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" indent="yes"/>

  <xsl:template match="/Invoices">
    <xsl:for-each select="Invoice">
      <html>
        <body>
          <!-- Dynamic Table -->
          <table class="items">
            <xsl:for-each select="invoiceItems/invoiceItem">
              <tr>
                <td><xsl:value-of select="position()"/></td>
                <td><xsl:value-of select="name"/></td>
                <td><xsl:value-of select="quantity * basePrice"/></td>
                <td>
                  <xsl:choose>
                    <xsl:when test="totalNumber > 500">✅ Paid</xsl:when>
                    <xsl:otherwise>❌ Unpaid</xsl:otherwise>
                  </xsl:choose>
                </td>
              </tr>
            </xsl:for-each>
          </table>
        </body>
      </html>
    </xsl:for-each>
  </xsl:template>
</xsl:stylesheet>
```

### Key Features of XSLT

- Template-Based Transformation: XSLT uses templates to match specific parts of an XML document and transform them into the desired output format. Each template defines rules for how a particular XML element should be processed.

- XPath Integration: XSLT heavily relies on XPath (XML Path Language) to navigate and select nodes in an XML document. XPath expressions are used to locate elements and attributes within the XML structure.

- Declarative Language: XSLT is a declarative language, meaning you specify what the output should look like, rather than how to achieve it. This makes it different from procedural programming languages.

- Cross-Platform: XSLT is platform-independent and can be used in various environments, including web browsers, server-side applications, and standalone processors.

- Extensibility: XSLT can be extended with custom functions and elements, allowing developers to add specific functionality as needed.

### Basic Structure of an XSLT Document

An XSLT document is itself an XML document and typically includes the following components:

#### XSLT Cheat Sheet

[XSLT Cheat Sheet](https://cheatography.com/univer/cheat-sheets/xslt-2-0-cheat-sheet/)

- `xsl:template`: Define a template
- `xsl:for-each`: Loop over nodes
- `xsl:value-of`: Output node value
- `xsl:choose`: Conditional logic
- `xsl:when`: If condition is true
- `xsl:otherwise`: If condition is false
- `xsl:param`: Receive external data
- `xsl:variable`: Store temporary data
- `xsl:apply-templates`: Call another template
- `xsl:import`: Include another XSLT file
- `xsl:output`: Define output format
- `xsl:attribute`: Add an attribute
- `xsl:comment`: Add a comment
- `xsl:copy`: Copy a node
- `xsl:element`: Create a new element
- `xsl:if`: Conditional check
- `xsl:sort`: Sort nodes
- `xsl:text`: Add text content
- `xsl:processing-instruction`: Add processing instruction
- `xsl:strip-space`: Remove whitespace
- `xsl:preserve-space`: Preserve whitespace
- `xsl:include`: Include another XSLT file
- `xsl:key`: Define a key
- `xsl:number`: Add numbering
- `xsl:namespace-alias`: Define namespace alias
- `xsl:document`: Create a new document
- `xsl:decimal-format`: Define decimal format
- `xsl:sequence`: Create a sequence
- `xsl:function`: Define a function
- `xsl:result-document`: Create a new document
- `fn:escape-html(userContent)`: Escape HTML content
- `xsl:analyze-string`: Analyze a string
- `format-number()`: Format a number
- `current()`: Get current node
- `document()`: Load an external document
- `element-available()`: Check if element is available
- `function-available()`: Check if function is available
- `generate-id()`: Generate a unique ID
- `id()`: Get element by ID
- `not(invoiceItems)` : Check if node is empty

- `<xsl:stylesheet>`: The root element of an XSLT document, which defines the version of XSLT being used and the namespace for XSLT elements.

- `<xsl:template>`: Defines a template for transforming a specific part of the XML document. Each template has a match attribute that specifies the XPath expression to match elements in the XML.

- `<xsl:value-of>`: Extracts the value of a selected node and inserts it into the output.

- `<xsl:for-each>`: Iterates over a set of nodes, applying the transformation rules to each node.

- `<xsl:if>` and `<xsl:choose>`: Provide conditional logic to apply different transformations based on certain conditions.

- `<xsl:apply-templates>`: Calls another template to process the selected nodes.

- `<xsl:output>`: Specifies the output format of the transformed document, such as HTML, XML, or text.

- `<xsl:import>` and `<xsl:include>`: Allow you to include other XSLT files in your stylesheet.

- `<xsl:param>`: Receives external parameters that can be passed to the XSLT stylesheet during transformation.

- `<xsl:variable>`: Defines variables that can be used within the XSLT stylesheet.

- `<xsl:comment>`: Adds comments to the XSLT document.

- `<xsl:attribute>`: Adds attributes to elements in the output document.

- `<xsl:element>`: Creates new elements in the output document.

- `<xsl:copy>`: Copies nodes from the input document to the output document.

- `<xsl:sort>`: Sorts nodes based on specified criteria.

- `<xsl:number>`: Adds numbering to nodes in the output document.

## React Component Example:

```tsx
import React, { useState } from "react";

const InvoiceGenerator = () => {
  const [html, setHtml] = useState("");

  const transformXml = (xsltString, xmlString) => {
    const parser = new DOMParser();
    const xsltProcessor = new XSLTProcessor();

    const xsltDoc = parser.parseFromString(xsltString, "application/xml");
    const xmlDoc = parser.parseFromString(xmlString, "application/xml");

    xsltProcessor.importStylesheet(xsltDoc);
    const resultDocument = xsltProcessor.transformToDocument(xmlDoc);

    return new XMLSerializer().serializeToString(resultDocument);
  };

  const generateInvoice = async () => {
    const xsltResponse = await fetch("/path/to/your.xslt");
    const xsltString = await xsltResponse.text();

    const xmlString = `<Invoices>...</Invoices>`; // Your XML data here
    const transformedHtml = transformXml(xsltString, xmlString);
    setHtml(transformedHtml);
  };

  return (
    <div>
      <button onClick={generateInvoice}>Generate Invoice</button>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
};

export default InvoiceGenerator;
```

### Styling the Invoice:

Use CSS to style the generated HTML. You can create a separate CSS file or use inline styles within your React component.

```css
.invoice {
  font-family: Arial, sans-serif;
  border: 1px solid #ccc;
  padding: 20px;
  margin: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
}
```

## Key Features:

- `xsl:param`: Receives React data

- `position()`: Auto-numbered items

- `xsl:choose`: Payment status logic

---

### 2. React Integration

```tsx
// Generate mock data
const invoiceItems = Array(5)
  .fill()
  .map(() => ({
    name: faker.commerce.productName(),
    quantity: faker.number.int({ min: 1, max: 10 }),
    basePrice: faker.number.int({ min: 10, max: 1000 }),
  }));

// Convert to XML
const xmlString = `
  <Invoices>
    <Invoice>
      ${listToXml("invoiceItems", "invoiceItem", invoiceItems)}
    </Invoice>
  </Invoices>
`;

// Transform using XSLT
const html = await transformXml(xsltTemplate, xmlString);
```

- Key Helpers:
  - `faker`: Generate random data
  - `listToXml`: Convert array to XML
  - `transformXml`: XSLT transformation

```ts
// Convert object to XML
const objectToXml = (tagName: string, obj: object) =>
  `<${tagName}>${Object.entries(obj).map(
    ([k, v]) => `<${k}>${v}</${k}>`
  )}</${tagName}>`;
```

### Architecture Benefits

Separation of Concerns

- `XSLT`: Pure presentation logic

- `React`: Data management and workflow

- `CSS`: Print-optimized styling

### Performance

- Client-side processing reduces server load

- Cached XSLT templates for repeat use

### Maintainability

- Modify designs without touching React code

- Update data structures independently

## When to Use This Stack

✅ Legacy system integration
✅ High-volume PDF generation
✅ Complex document workflows
✅ Multi-channel output needs

### Ready to Implement?

1. **Clone the repo**:

   ```bash
   git clone
   ```

2. **Install dependencies**:
   ```bash
    npm install @faker-js/faker react-to-print
   ```
3. **Run the project**:
   ```bash
    npm run dev
   ```

---

## Conclusion

This implementation demonstrates XSLT's enduring power in modern web development. By combining its transformation capabilities with React's dynamic nature, we've created a robust invoice system that's:

- Style-independent through XSLT

- Data-agnostic via XML

- Print-optimized with CSS

- Easily extensible through modular design

- Web Development: Transforming XML data into HTML for web presentation.

- Data Conversion: Converting XML data into other formats, such as CSV or JSON.

- Document Generation: Creating formatted documents like invoices, reports, and letters from XML data.

- Data Integration: Transforming XML data to match the schema of another system for data exchange.

The complete code provides real-world patterns for XML generation, parameter handling, and cross-technology integration that can be adapted to various document processing needs.
