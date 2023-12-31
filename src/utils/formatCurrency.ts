export function formatCurrency(price: number) {
  const roundedPrice = Math.round(price);
  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'ZAR',
  });
  const formattedCurrency = currencyFormatter.format(roundedPrice);

  return formattedCurrency.replace('ZAR', 'R').replace('.00', '');
}
