import { getFormattedCurrency } from "@/helpers/currency";
import { InvoiceLineItem } from "@/types";
import { faker } from "@faker-js/faker";

export const generateInvoiceList = (length: number): InvoiceLineItem[] => {
  return Array.from({ length }).map(() => ({
    id: crypto.randomUUID().toString(),
    name: faker.commerce.productName(),
    description: faker.commerce.productName(),
    quantity: faker.number.int({ min: 1, max: 10 }),
    basePrice: faker.number.int({ min: 1, max: 1000 }),
    price: getFormattedCurrency(faker.number.int({ min: 1, max: 1000 })),
    total: getFormattedCurrency(faker.number.int({ min: 1, max: 1000 })),
    totalNumber: faker.number.int({ min: 1, max: 1000 }),
  }));
};

export const generateCompanyInfo = () => {
  return {
    companyName: faker.company.name(),
    companyAddress: faker.location.streetAddress(),
    companyCity: faker.location.city(),
    companyState: faker.location.state(),
    companyZip: faker.location.zipCode(),
  };
};

export const generateClientInfo = () => {
  return {
    name: faker.company.name(),
    address: faker.location.streetAddress(),
    email: faker.internet.email(),
    phone: faker.phone.number({ style: "international" }),
    clientCity: faker.location.city(),
    clientState: faker.location.state(),
    clientZip: faker.location.zipCode(),
  };
};

export const generateInvoiceInfo = () => {
  return {
    invoiceNumber: faker.commerce.isbn(),
    invoiceDate: faker.date.recent().toISOString(),
    dueDate: faker.date.future().toISOString(),
    terms: faker.lorem.words({
      max: 15,
      min: 10,
    }),
    total: getFormattedCurrency(faker.number.int({ min: 1, max: 10000 })),
  };
};

export const generateHeader = () => {
  return {
    logo: faker.image.avatar(),
    companyName: faker.company.name(),
    website: window.location.origin,
    email: faker.internet.email(),
    phone: faker.phone.number({ style: "international" }),
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    taxId: faker.phone.imei(),
  };
};
