import { Palette, SxProps, Theme } from '@mui/material';
import { TableActions } from './table.enum';
import { STYLE } from '@/common/constant';
import { Column } from './table.interface';
import { OPACITY } from '@/common/constant/opacity.constant';

export const DISABLED_DEFAULT = Object.keys(TableActions).reduce(
  (r, key) => {
    r[key as keyof typeof TableActions] = false;
    return r;
  },
  {} as Record<keyof typeof TableActions, boolean>,
);

export const getStyleCell = (column: Column<any>, palette: Palette, disableRow?: boolean): SxProps<Theme> => {
  const widthCss =
    typeof column.width === 'string'
      ? { width: `${column.width} !important`, minWidth: `${column.width} !important` }
      : column.width !== undefined
        ? { width: `${column.width}px !important`, minWidth: `${column.width}px !important` }
        : {};
  return {
    ...widthCss,
    padding: STYLE.PADDING_GAP_ITEM,
    verticalAlign: 'middle',
    color: disableRow ? palette.divider : 'none',
    ...(column.stickyCss
      ? {
          position: 'sticky',
          backgroundColor: palette.background.paper,
          ...column.stickyCss,
        }
      : {}),
    ...(column.sx ? column.sx : {}),
  };
};

export const getStyleRow = (
  hasOnClick: boolean,
  palette: Palette,
  index: number,
  sxRow: { [key: number]: SxProps<Theme> },
  indexLoadingRow?: number,
): SxProps<Theme> => {
  return {
    cursor: hasOnClick ? 'pointer' : 'default',
    '&:hover .MuiTableCell-root': {
      backgroundColor: 'inherit !important', // Đồng bộ màu nền khi hover
    },
    ...(sxRow[index] ? sxRow[index] : {}),
    ...(indexLoadingRow === index
      ? {
          background: `linear-gradient(270deg, ${palette.primary.light + OPACITY[90]}, ${palette.action.hover},  ${palette.background.paper})`,
          backgroundSize: '600% 600%',
          animation: 'loading-gradient-row-table 0.75s ease infinite',
        }
      : {}),
  };
};
