export const formatNumber = (value: any) => {
  const number = Number(value);
  if (!Number.isFinite(number)) return value;

  return Math.round(number).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export const round5000 = (number: number) => {
  const thousands = number % 10000;
  const base = number - thousands;
  return thousands < 5000 ? base : base + 10000;
};

export const formatVND = (val: number) =>
  `${Math.round(Number(val)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} ₫`;
