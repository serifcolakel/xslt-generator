<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" indent="yes" encoding="UTF-8" />
  <xsl:param name="companyInfo" as="companyInfo" select="companyInfo"/>
  <xsl:param name="clientInfo" as="clientInfo" select="clientInfo"/>
  <xsl:param name="invoiceInfo" as="invoiceInfo" select="invoiceInfo"/>
  <xsl:param name="invoiceItems" as="invoiceItems" select="invoiceItems"/>
  <xsl:param name="createDate" as="createDate" select="createDate"/>
  
  
  <xsl:template match="/Invoices">
    <xsl:for-each select="Invoice">
      <html>
        <head>
          <title>Invoice</title>
          <link rel="stylesheet" type="text/css" href="invoice-style.css"/>
        </head>
        <body>
          <div class="invoice">
            <header class="invoice-header">
              <div class="invoice-header-logo">
                <img src="{headerInfo/logo}" alt="{headerInfo/companyName}" />
                <div class="invoice-header-info">
                  <h1><xsl:value-of select="headerInfo/address" /></h1>
                  <a href="{headerInfo/website}">
                    <span><xsl:value-of select="headerInfo/website" /></span>
                  </a>
                  <a href="mailto:{headerInfo/email}">
                    <span><xsl:value-of select="headerInfo/email" /></span>
                  </a>
                  <a href="tel:{headerInfo/phone}">
                    <span><xsl:value-of select="headerInfo/phone" /></span>
                  </a>
                </div>
              </div>
              
              <div class="invoice-page-number">
                <span><xsl:value-of select="headerInfo/email" /></span>
                <span><xsl:value-of select="headerInfo/address" /></span>
              </div>
            </header>
            
            <div class="invoice-details">
              <div class="invoice-details-wrapper">
                <div class="invoice-details-client">
                  <span>Billed to</span>
                  <br/>
                  <span>
                    <b><xsl:value-of select="clientInfo/name" /></b>
                  </span>
                  <span><xsl:value-of select="clientInfo/address" /></span>
                  <span><xsl:value-of select="clientInfo/phone" /></span>
                  <span><xsl:value-of select="clientInfo/email" /></span>
                  <div class="invoice-details-client-info">
                    <div class="card">
                      <h2>Location</h2>
                      <span><xsl:value-of select="clientInfo/clientState" /> / <xsl:value-of select="clientInfo/clientCity" /></span>
                    </div>
                    <div class="card">
                      <h2>ZIP</h2>
                      <span><xsl:value-of select="clientInfo/clientZip" /></span>
                    </div>
                  </div>
                </div>
                <div class="invoice-details-invoice-total-info">
                  <div class="card">
                    <h2>Total</h2>
                    <span><xsl:value-of select="clientInfo/clientState" /> / <xsl:value-of select="clientInfo/clientCity" /></span>
                  </div>
                </div>
                <div class="invoice-details-invoice-info">
                  <div class="card">
                    <h2>Invoice Number</h2>
                    <span>#INV-<xsl:value-of select="invoiceInfo/invoiceNumber" /></span>
                  </div>
                  <div class="card">
                    <h2>Invoice Date</h2>
                    <span><xsl:value-of select="invoiceInfo/invoiceDate" /></span>
                  </div>
                  <div class="card">
                    <h2>Invoice Due Date</h2>
                    <span><xsl:value-of select="invoiceInfo/dueDate" /></span>
                  </div>
                </div>
              </div>
              <div>
                <table class="invoice-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Product Name</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Subtotal</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <xsl:for-each select="invoiceItems/invoiceItem">
                      <tr>
                        <td><xsl:value-of select="position()" /></td>
                        <td><xsl:value-of select="name" /></td>
                        <td><xsl:value-of select="quantity" /></td>
                        <td><xsl:value-of select="price" /></td>
                        <td><xsl:value-of select="quantity * basePrice" /></td>
                        <td>
                          <xsl:value-of select="total" />
                          <xsl:choose>
                            <xsl:when test="totalNumber &gt; 500">
                              <span class="badge badge-success">Paid</span>
                            </xsl:when>
                            <xsl:otherwise>
                              <span class="badge badge-danger">Unpaid</span>
                            </xsl:otherwise>
                          </xsl:choose>
                        </td>
                      </tr>
                    </xsl:for-each>
                  </tbody>
                </table>
              </div>
            </div>
            
            <footer class="invoice-footer">
              <p><xsl:value-of select="createDate" /></p>
              <p>This is a computer-generated invoice and does not require a signature.</p>
              <p><xsl:value-of select="invoiceInfo/terms" /></p>
              <h2>Page: <xsl:value-of select="position()"/></h2>
            </footer>
          </div>
        </body>
      </html>
    </xsl:for-each>
  </xsl:template>
</xsl:stylesheet>