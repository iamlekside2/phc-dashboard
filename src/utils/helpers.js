export const formatNumber = (n) => {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n?.toLocaleString?.() ?? n;
};

export const getNestedValue = (obj, key) =>
  key.split('.').reduce((o, k) => o?.[k], obj);
