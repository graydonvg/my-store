import { ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionProps, AccordionSummary, Typography } from '@mui/material';
import { ReactNode } from 'react';

type Props = {
  title: string;
  children: ReactNode;
} & AccordionProps;

export default function AccordionComponent({ title, children, ...props }: Props) {
  return (
    <Accordion
      elevation={0}
      disableGutters
      sx={{
        backgroundColor: 'transparent',
        borderBottom: (theme) => `1px solid ${theme.palette.custom.border}`,
        borderRadius: '0 !important',
        '&:before': {
          display: 'none',
        },
      }}
      {...props}>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography
          component="h2"
          fontSize={24}
          fontWeight={400}>
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
}
