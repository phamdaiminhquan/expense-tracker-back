import { SxProps, TableCell, TableHead, TableRow, Theme, Typography, useTheme } from '@mui/material';
import React, { JSX } from 'react';
import { STYLE } from '../../../common/constant';
import { Column } from '../table.interface';
import { StackRowJustEnd } from '../../styles/stack.style';
import { CheckboxElement } from '../../elements/check-box/check-box.element';

export interface TableHeadPartProps<R> {
  columns: Column<R>[];
  onSelectAllRow?: (checkedAll: boolean) => void;
  sx?: SxProps<Theme>;
}

type TableHeadPartType = <R>(props: TableHeadPartProps<R>) => JSX.Element;

export const TableHeadPart: TableHeadPartType = ({ columns, onSelectAllRow, sx = {} }) => {
  const { palette } = useTheme();

  return (
    <TableHead sx={sx}>
      <TableRow>
        {columns.map((column) => (
          <TableCell
            key={column.id}
            align={column.align}
            sx={{
              ...(typeof column.width === 'string'
                ? { width: `${column.width} !important`, minWidth: `${column.width} !important` }
                : column.width !== undefined
                  ? {
                      width: `${column.width}px !important`,
                      minWidth: `${column.width}px !important`,
                      maxWidth: `${column.width}px !important`,
                    }
                  : {}),
              fontWeight: 550,
              padding: STYLE.PADDING_GAP_ITEM,
              backgroundColor: 'transparent',
              verticalAlign: 'top',
              textAlign: column.alignHead ? column.alignHead : 'center',
              ...(column.stickyCss
                ? { position: 'sticky', backgroundColor: palette.background.paper, ...column.stickyCss }
                : {}),
              ...(column.sx ? column.sx : {}),
            }}
          >
            {column.label === 'Actions' && onSelectAllRow ? (
              <StackRowJustEnd>
                <Typography variant="subtitle1">{column.label}</Typography>
                <CheckboxElement onChange={(_, checked) => onSelectAllRow?.(checked)} />
              </StackRowJustEnd>
            ) : (
              <Typography variant="subtitle1">{column.label}</Typography>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};
