import { Tooltip } from '@mui/material';
import { ReactElement } from 'react';

type Props = {
  title: string;
  children: ReactElement<unknown, any>;
};

export default function CustomTooltip({ title, children }: Props) {
  return (
    <Tooltip
      title={title}
      placement="top"
      arrow
      followCursor
      slotProps={{
        popper: {
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 0],
              },
            },
          ],
        },
      }}>
      {children}
    </Tooltip>
  );
}
