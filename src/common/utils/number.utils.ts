export const formatNumber = (value: any, decimalPlaces?: number) => {
  const number = Number(value);
  if (!Number.isFinite(number)) return value;

  const formatted = new Intl.NumberFormat("en-US", {
    ...(decimalPlaces !== undefined && {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    }),
  }).format(number);
  return formatted.replace(/,/g, ".");
};

export const round5000 = (number: number) => {
  const thousands = number % 10000;
  const base = number - thousands;
  return thousands < 5000 ? base : base + 10000;
};

export const formatVND = (val: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(val));
