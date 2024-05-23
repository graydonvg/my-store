'use client';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  List,
  ListItem,
  Typography,
  accordionSummaryClasses,
  listItemClasses,
} from '@mui/material';
import { ExpandMore, LocalShippingOutlined } from '@mui/icons-material';
import { constants } from '@/constants';
import HeadingBottomProductDetails from './HeadingBottomProductDetails';
import { Product } from '@/types';

type Props = {
  product: Product;
};

export default function BottomProductDetails({ product }: Props) {
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          paddingY: { xs: 1, sm: 2 },
        }}>
        <HeadingBottomProductDetails>Shipping</HeadingBottomProductDetails>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, paddingLeft: 1 }}>
          <LocalShippingOutlined />
          <Typography
            component="p"
            variant="body1">
            {product.deliveryInfo}
          </Typography>
        </Box>
      </Box>
      <Divider />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          paddingY: { xs: 1, sm: 2 },
        }}>
        <HeadingBottomProductDetails>Returns</HeadingBottomProductDetails>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, paddingLeft: 1 }}>
          <Typography
            component="p"
            variant="body1">
            {product.returnInfo}
          </Typography>
        </Box>
      </Box>
      <Divider />
      <Accordion
        elevation={0}
        disableGutters
        defaultExpanded={true}
        sx={{ borderRadius: constants.borderRadius, backgroundColor: 'transparent' }}>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          sx={{
            padding: 0,
            minHeight: 'unset',
            paddingY: { xs: 1, sm: 2 },
            [`& .${accordionSummaryClasses.content}`]: { margin: '0' },
          }}>
          <HeadingBottomProductDetails>Product Details</HeadingBottomProductDetails>
        </AccordionSummary>
        <AccordionDetails sx={{ padding: 0 }}>
          <List
            sx={{
              listStyleType: 'disc',
              paddingLeft: 3,
              [`& .${listItemClasses.root}`]: { display: 'list-item' },
            }}>
            {product.details.split(',').map((detail, index) => (
              <ListItem
                key={index}
                sx={{ padding: 0, paddingBottom: 1 }}>
                <Typography component="p">{detail}</Typography>
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
    </>
  );
}
