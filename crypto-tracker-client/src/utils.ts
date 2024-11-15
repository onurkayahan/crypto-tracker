export const formatPrice = (
  value: number,
  pair: string | null,
  isInverse: boolean
) => {
  const symbol = isInverse ? pair?.split("/")[0] : pair?.split("/")[1];
  const price = !isInverse ? value : 1 / value;
  return `${price.toLocaleString("en-US", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  })} ${symbol}`;
};

export function renderPairName(pair: string, isInverse: boolean) {
  return !isInverse ? pair : pair?.split("/").reverse().join("/");
}
