const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const num = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

export const formatCurrency = (value: number) => usd.format(value);
export const formatNumber = (value: number) => num.format(value);
