import { SxProps, TableContainer, Theme, useTheme } from '@mui/material';
import React, { ReactElement } from 'react';
import { STYLE } from '../../../common/constant';
import { StackBgPaperBorRadLayCol } from '../../styles/stack.style';

export interface TableContainerPartProps {
  children: ReactElement;
  sx?: SxProps<Theme>;
}

export const TableContainerPart: React.FC<TableContainerPartProps> = ({ children, sx = {} }) => {
  const { palette } = useTheme();

  return (
    <StackBgPaperBorRadLayCol
      sx={{
        border: `1px solid ${palette.divider}`,
        borderRadius: STYLE.BORDER_RADIUS_ELEMENT,
        padding: STYLE.PADDING_GAP_ITEM,
        overflowY: 'auto',
        flex: 1,
      }}
    >
      <TableContainer sx={{ flex: 1, ...sx }}>{children}</TableContainer>
    </StackBgPaperBorRadLayCol>
  );
};
