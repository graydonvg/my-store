import { ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import { ReactNode } from 'react';

type AccordionProps = {
  title: string;
  defaultExpanded: boolean;
  children: ReactNode;
};

export default function AccordionComponent({ title, defaultExpanded, children }: AccordionProps) {
  return (
    <Accordion
      elevation={0}
      disableGutters
      defaultExpanded={defaultExpanded}
      sx={{
        backgroundColor: 'transparent',
        borderBottom: (theme) => `1px solid ${theme.palette.custom.border}`,
        borderRadius: '0 !important',
        '&:before': {
          display: 'none',
        },
      }}>
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
