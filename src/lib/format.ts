export function formatUsd(value: string | number): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

export function formatPercent(value: string | number): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return (num * 100).toFixed(4) + "%";
}

export function formatNumber(value: string | number, decimals = 2): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

export function formatVolume(value: string | number): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (num >= 1_000_000_000) return "$" + (num / 1_000_000_000).toFixed(2) + "B";
  if (num >= 1_000_000) return "$" + (num / 1_000_000).toFixed(2) + "M";
  if (num >= 1_000) return "$" + (num / 1_000).toFixed(2) + "K";
  return "$" + num.toFixed(2);
}
