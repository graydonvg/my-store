'use client';

import Typography from '@mui/material/Typography';
import CardTitleAdminView from './CardTitleAdminView';
import { formatCurrency } from '@/utils/formatCurrency';
import useColorPalette from '@/hooks/useColorPalette';

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function getFirstDayOfWeek() {
  const currentDate = new Date();
  const currentDay = currentDate.getDay();
  const diff = currentDate.getDate() - currentDay + (currentDay == 0 ? -6 : 1);
  const firstDay = new Date(currentDate.setDate(diff));

  return firstDay;
}

function getLastDayOfWeek() {
  const firstDay = getFirstDayOfWeek();
  const lastDay = new Date(firstDay);
  lastDay.setDate(firstDay.getDate() + 6);

  return lastDay;
}

function getMonth() {
  const currentDate = new Date();
  const monthIndex = currentDate.getMonth();
  const month = monthNames[monthIndex];

  return month;
}

function formatDay(date: Date) {
  let day = date.getDate();
  const monthIndex = date.getMonth();
  const month = monthNames[monthIndex];

  if (day < 10) {
    day = Number('0' + day);
  }

  return `${day} ${month}`;
}

type Props = {
  title: string;
  type: 'daily' | 'weekly' | 'monthly';
  amount: number;
};

export default function TotalSales({ title, type, amount }: Props) {
  const colorPalette = useColorPalette();
  const firstDayOfWeek = getFirstDayOfWeek();
  const lastDayOfWeek = getLastDayOfWeek();
  const formattedFirstDay = formatDay(firstDayOfWeek);
  const formattedLastDay = formatDay(lastDayOfWeek);
  const currentDate = formatDay(new Date());
  const currentMonth = getMonth();
  let amountFontSize = { xs: 32, sm: 28, md: 30, lg: 36 };

  if (amount >= 100000000) {
    amountFontSize = { xs: 32, sm: 22, md: 22, lg: 36 };
  } else if (amount >= 10000000) {
    amountFontSize = { xs: 32, sm: 24, md: 26, lg: 36 };
  }

  return (
    <>
      <CardTitleAdminView>{title}</CardTitleAdminView>
      <Typography
        component="p"
        variant="h4"
        fontSize={amountFontSize}>
        {formatCurrency(amount)}
      </Typography>
      <Typography
        color={colorPalette.typographyVariants.grey}
        sx={{ flex: 1 }}>
        {type === 'daily' ? currentDate : null}
        {type === 'weekly' ? `${formattedFirstDay} - ${formattedLastDay}` : null}
        {type === 'monthly' ? currentMonth : null}
      </Typography>
    </>
  );
}
