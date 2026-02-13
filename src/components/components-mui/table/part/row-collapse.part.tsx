/* eslint-disable @typescript-eslint/no-explicit-any */
import { Collapse, Fade, Stack, SxProps, TableCell, TableRow, Theme, useTheme } from '@mui/material';
import React, { JSX, useState } from 'react';
import { IconContentElement } from '../../elements/icon/icon-content.element';
import { StackRowAlignJustCenter } from '../../styles/stack.style';
import { TableComponent } from '../table.component';
import { DISABLED_DEFAULT, getStyleCell, getStyleRow } from '../table.constant';
import { CollapseProps, Column, OnClickRow, OnDisabled } from '../table.interface';
import { ButtonIconElement } from '../../elements/button/button-icon.element';
import { getErrorMessage } from '@/common/utils/string.utils';
import { STYLE } from '@/common/constant';
import { useSnackbar, SnackbarType } from '@/hooks/use-snackbar';

export interface RowCollapsePartProps<R, RC> {
  columns: Column<R>[];
  row: R;
  indexRow: number;
  indexLoadingRow?: number;
  collapse: CollapseProps<R, RC>;
  isStickyActions?: boolean;
  sxRow?: { [key: number]: SxProps<Theme> };
  collapseTableWidth?: number;

  onClickRow?: OnClickRow<R>;
  onDisabled?: OnDisabled<R>;

  // end row
  onDeleteRow?: OnClickRow<R>;
  onInfoRow?: OnClickRow<R>;
  onHistoryRow?: OnClickRow<R>;
  onCopyRow?: OnClickRow<R>;
  onUpdateRow?: OnClickRow<R>;
}

type RowCollapsePartType = <R, RC>(props: RowCollapsePartProps<R, RC>) => JSX.Element;

export const RowCollapsePart: RowCollapsePartType = ({
  columns,
  row,
  indexRow,
  indexLoadingRow,
  collapse,
  sxRow = {},
  collapseTableWidth,

  onClickRow,
  onDisabled,

  // end row
  onDeleteRow,
  onInfoRow,
  onHistoryRow,
  onCopyRow,
  onUpdateRow,
}) => {
  const { showSnackbar } = useSnackbar();
  const { palette } = useTheme();

  const [open, setOpen] = React.useState(false);
  const [state, setState] = useState();
  const [loading, setLoading] = useState(false);

  const toggleCollapse = async (row: any, indexRow: number) => {
    setOpen(!open);

    if (!collapse.onOpenCollapse || state) return;

    setLoading(true);

    try {
      const data = await collapse.onOpenCollapse(row, indexRow);

      setState(collapse.property ? data[collapse.property!] : data);
    } catch (error) {
      showSnackbar({ message: getErrorMessage(error), type: SnackbarType.ERROR });
    } finally {
      setLoading(false);
    }
  };

  // Add render vào column actions
  columns[columns.length - 1].render = (row, index) => {
    const disabled = onDisabled ? onDisabled(row, index) : { ...DISABLED_DEFAULT };

    const disabledByParent = disabled.DISABLED_ROW || disabled.DISABLED_ALL_ACTIONS;

    return (
      <StackRowAlignJustCenter gap={2}>
        {onDeleteRow && (
          <ButtonIconElement
            icon="delete"
            onClick={() => onDeleteRow(row, index)}
            disabled={disabledByParent || disabled.DELETE}
            color="error"
            variant="outlined"
          />
        )}
        {onInfoRow && (
          <ButtonIconElement
            icon="view_cozy"
            onClick={() => onInfoRow(row, index)}
            disabled={disabledByParent || disabled.INFO}
            color="info"
            variant="outlined"
          />
        )}
        {onHistoryRow && (
          <ButtonIconElement
            icon="source_notes"
            onClick={() => onHistoryRow(row, index)}
            disabled={disabledByParent || disabled.HISTORY}
            color="warning"
            variant="outlined"
          />
        )}

        {onCopyRow && (
          <ButtonIconElement
            icon="content_copy"
            onClick={() => onCopyRow(row, index)}
            disabled={disabledByParent || disabled.COPY}
            color="primary"
            variant="outlined"
          />
        )}
        {onUpdateRow && (
          <ButtonIconElement
            icon="edit_document"
            onClick={() => onUpdateRow(row, index)}
            disabled={disabledByParent || disabled.UPDATE}
            color="success"
            variant="outlined"
          />
        )}
        <ButtonIconElement
          onClick={() => toggleCollapse(row, indexRow)}
          icon={open ? 'keyboard_arrow_down' : 'keyboard_arrow_up'}
          disabled={disabledByParent || disabled.COLLAPSE}
          color="secondary"
          variant="outlined"
        />
      </StackRowAlignJustCenter>
    );
  };

  const disabled = onDisabled ? onDisabled(row, indexRow) : { ...DISABLED_DEFAULT };

  return (
    <React.Fragment>
      <Fade in={true} timeout={indexRow * 120}>
        <TableRow
          hover
          tabIndex={-1}
          onClick={() => onClickRow && onClickRow(row, indexRow)}
          sx={getStyleRow(Boolean(onClickRow), palette, indexRow, sxRow, indexLoadingRow)}
        >
          {columns.map((column) => (
            <TableCell key={column.id} align={column.align} sx={getStyleCell(column, palette, disabled.DISABLED_ROW)}>
              {column.render ? column.render(row, indexRow) : (row as any)[column.id]}
            </TableCell>
          ))}
        </TableRow>
      </Fade>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={columns.length + 2}>
          <Stack
            sx={{
              display: 'flex',
              overflowX: 'auto',
              maxWidth: '100%',
              width: (collapseTableWidth || 0) - parseInt(STYLE.PADDING_GAP_LAYOUT, 10) * 2 || 'auto',
            }}
          >
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Stack
                sx={{
                  padding: STYLE.PADDING_GAP_LAYOUT,
                  borderRadius: STYLE.BORDER_RADIUS_ELEMENT,
                  backgroundColor: palette.background.default,
                }}
              >
                <IconContentElement icon={collapse.iconTitle || 'filter_list'} content={collapse.title} size="medium" />

                <TableComponent
                  loading={loading}
                  columns={collapse.columns}
                  isStickyActions={collapse.isStickyActions}
                  rowSpanProperty={collapse.rowSpanProperty}
                  //
                  rows={collapse.onOpenCollapse ? state : (row as any)[collapse.property!]}
                  onClickRow={collapse.onClickRow}
                  onDisabled={collapse.onDisabled}
                  //
                  onDeleteRow={collapse.onDeleteRow}
                  onInfoRow={collapse.onInfoRow}
                  onHistoryRow={collapse.onHistoryRow}
                  onCopyRow={collapse.onCopyRow}
                  onUpdateRow={collapse.onUpdateRow}
                />
              </Stack>
            </Collapse>
          </Stack>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};
