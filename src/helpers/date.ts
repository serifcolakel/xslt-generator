export const getFormattedDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeStyle: "long",
  }).format(date);
};

export const getFormattedTime = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    timeStyle: "long",
  }).format(date);
};

export const getFormattedDateOnly = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
  }).format(date);
};

export const getNow = () => {
  return getFormattedDate(new Date());
};
