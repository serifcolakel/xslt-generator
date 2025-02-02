export type BaseXmlItem = Record<string, string | number | boolean>;

export type InvoiceLineItem = {
  id: string;
  name: string;
  description: string;
  quantity: number;
  price: string;
  basePrice: number;
  total: string;
  totalNumber: number;
};
