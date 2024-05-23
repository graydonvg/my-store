export function formatCurrency(price: number) {
  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'ZAR',
  });
  const formattedCurrency = currencyFormatter.format(price);

  return formattedCurrency.replace('ZAR', 'R').replace('.00', '');
}
