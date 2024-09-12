import { Accordion, AccordionDetails, AccordionSummary, accordionClasses } from '@mui/material';
import { GridExpandMoreIcon } from '@mui/x-data-grid';
import { ReactNode } from 'react';

type Props = {
  label: string;
  defaultExpanded: boolean;
  children: NonNullable<ReactNode> & ReactNode;
};

export default function ProductsSidebarAccordion({ label, defaultExpanded, children }: Props) {
  return (
    <Accordion
      defaultExpanded={defaultExpanded}
      elevation={0}
      sx={{
        [`&.${accordionClasses.expanded}`]: {
          margin: 0,
        },
        [`&.${accordionClasses.expanded}::before`]: {
          display: 'none',
        },
        [`&.${accordionClasses.root}::before`]: {
          display: 'none',
        },
        backgroundColor: (theme) => theme.palette.background.default,
      }}>
      <AccordionSummary
        expandIcon={<GridExpandMoreIcon />}
        sx={{
          color: (theme) => theme.palette.custom.navbar.lower.text,
          '&.Mui-expanded': {
            color: (theme) => theme.palette.text.primary,
            fontWeight: 'bold',
          },
        }}>
        {label}
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
}
