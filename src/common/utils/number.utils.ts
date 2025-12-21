export const formatNumber = (value: any, decimalPlaces?: number) => {
  const number = Number(value);
  if (!Number.isFinite(number)) return value;

  return new Intl.NumberFormat('en-US', {
    ...(decimalPlaces !== undefined && {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    }),
  }).format(number);
};

export const round5000 = (number: number) => {
  const thousands = number % 10000;
  const base = number - thousands;
  return thousands < 5000 ? base : base + 10000;
};
