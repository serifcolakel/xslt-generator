export const getFormattedCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export const getFormattedNumber = (amount: number) => {
  return new Intl.NumberFormat("en-US").format(amount);
};

export const getFormattedPercent = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
  }).format(amount);
};
