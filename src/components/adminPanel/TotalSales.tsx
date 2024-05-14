'use client';

import Typography from '@mui/material/Typography';
import CardTitle from './CardTitle';
import { formatCurrency } from '@/utils/formatCurrency';

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
  const firstDayOfWeek = getFirstDayOfWeek();
  const lastDayOfWeek = getLastDayOfWeek();
  const formattedFirstDay = formatDay(firstDayOfWeek);
  const formattedLastDay = formatDay(lastDayOfWeek);
  const currentDate = formatDay(new Date());
  const currentMonth = getMonth();

  return (
    <>
      <CardTitle>{title}</CardTitle>
      <Typography
        component="p"
        variant="h4"
        fontSize={{ xs: 32, sm: 22, md: 22, lg: 36 }}
        noWrap
        sx={{
          fontSize: 36,
          '@container (max-width: 231px)': {
            fontSize: 30,
          },
          '@container (max-width: 195px)': {
            fontSize: 24,
          },
          '@container (max-width: 155px)': {
            fontSize: 22,
          },
        }}>
        {formatCurrency(amount)}
      </Typography>
      <Typography color={(theme) => theme.palette.text.secondary}>
        {type === 'daily' ? currentDate : null}
        {type === 'weekly' ? `${formattedFirstDay} - ${formattedLastDay}` : null}
        {type === 'monthly' ? currentMonth : null}
      </Typography>
    </>
  );
}