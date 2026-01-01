import { SxProps, Table, TableBody, TableCell, TableRow, Theme } from '@mui/material';
import React, { JSX, useEffect, useRef, useState } from 'react';
import { EmptyComponent } from '../empty/empty.component';
import { LoadingComponent } from '../loading/loading.component';
import { StackRowAlignJustCenter } from '../styles/stack.style';
import { RowCollapsePart } from './part/row-collapse.part';
import { TableContainerPart } from './part/table-container.part';
import { TableHeadPart } from './part/table-head.part';
import { DISABLED_DEFAULT } from './table.constant';
import { CollapseProps, Column, OnClickRow, OnDisabled } from './table.interface';
import { ButtonIconElement } from '../elements/button/button-icon.element';

export interface TableCollapseComponentProps<R, RC> {
  loading: boolean;
  rows?: R[];
  columns: Column<R>[];
  indexLoadingRow?: number;
  collapse: CollapseProps<R, RC>;
  isStickyActions?: boolean;
  sx?: SxProps<Theme>;
  sxHead?: SxProps<Theme>;
  sxBody?: SxProps<Theme>;
  sxRow?: { [key: number]: SxProps<Theme> };

  onClickRow?: OnClickRow<R>;
  onDisabled?: OnDisabled<R>;

  // end row + 1 icon collapse
  onDeleteRow?: OnClickRow<R>;
  onInfoRow?: OnClickRow<R>;
  onHistoryRow?: OnClickRow<R>;
  onCopyRow?: OnClickRow<R>;
  onUpdateRow?: OnClickRow<R>;
}

type TableCollapseComponentType = <R, RC>(props: TableCollapseComponentProps<R, RC>) => JSX.Element;

export const TableCollapseComponent: TableCollapseComponentType = ({
  loading,
  rows,
  columns: initialColumns,
  indexLoadingRow,
  collapse,
  isStickyActions = false,
  sx = {},
  sxHead = {},
  sxBody = {},
  // sxRow = {},

  onClickRow,
  onDisabled,

  // end row + 1 icon collapse
  onDeleteRow,
  onInfoRow,
  onHistoryRow,
  onCopyRow,
  onUpdateRow,
}) => {
  rows = rows || [];

  const lengthActions = [onDeleteRow, onInfoRow, onHistoryRow, onCopyRow, onUpdateRow].filter(Boolean).length + 1; // + 1 do collapse icon
  const widthActions = lengthActions * 37.13 + (lengthActions - 1) * 16;

  const lengthCollapseActions = [
    collapse.onDeleteRow,
    collapse.onInfoRow,
    collapse.onHistoryRow,
    collapse.onCopyRow,
    collapse.onUpdateRow,
  ].filter(Boolean).length;

  const widthCollapseActions = lengthCollapseActions * 37.13 + (lengthCollapseActions - 1) * 16;

  const columns = React.useMemo(() => {
    const updateColumns = [...initialColumns];

    // Update trước để render head vì dồn collapse vào đây. Chắc chắn cột này sẽ có.
    // Vào trong RowCollapsePart update thêm hàm render
    updateColumns.push({
      id: 'actions',
      label: 'Actions',
      width: widthActions > 70 ? widthActions : 70,
      align: 'center',
      stickyCss: isStickyActions ? { right: 0 } : undefined,
    });

    return updateColumns;
  }, [initialColumns, widthActions, isStickyActions]);

  const collapseColumns = React.useMemo(() => {
    const updateCollapseColumns = [...collapse.columns];

    if (
      collapse.onDeleteRow ||
      collapse.onInfoRow ||
      collapse.onHistoryRow ||
      collapse.onCopyRow ||
      collapse.onUpdateRow
    ) {
      updateCollapseColumns.push({
        id: 'collapseActions',
        label: 'Actions',
        width: widthCollapseActions > 70 ? widthCollapseActions : 70,
        align: 'center',
        stickyCss: collapse.isStickyActions ? { right: 0 } : undefined,
        render: (row, index) => {
          const disabled = collapse.onDisabled ? collapse.onDisabled(row, index) : { ...DISABLED_DEFAULT };

          const disabledByParent = disabled.DISABLED_ROW || disabled.DISABLED_ALL_ACTIONS;

          return (
            <StackRowAlignJustCenter gap={2}>
              {collapse.onDeleteRow && (
                <ButtonIconElement
                  icon="delete"
                  onClick={() => collapse.onDeleteRow && collapse.onDeleteRow(row, index)}
                  disabled={disabledByParent || disabled.DELETE}
                  color="error"
                  variant="contained"
                />
              )}
              {collapse.onInfoRow && (
                <ButtonIconElement
                  icon="view_cozy"
                  onClick={() => collapse.onInfoRow && collapse.onInfoRow(row, index)}
                  disabled={disabledByParent || disabled.INFO}
                  color="info"
                  variant="contained"
                />
              )}
              {collapse.onHistoryRow && (
                <ButtonIconElement
                  icon="source_notes"
                  onClick={() => collapse.onHistoryRow && collapse.onHistoryRow(row, index)}
                  disabled={disabledByParent || disabled.HISTORY}
                  color="warning"
                  variant="contained"
                />
              )}
              {collapse.onCopyRow && (
                <ButtonIconElement
                  icon="content_copy"
                  onClick={() => collapse.onCopyRow && collapse.onCopyRow(row, index)}
                  disabled={disabledByParent || disabled.COPY}
                  color="primary"
                  variant="contained"
                />
              )}
              {collapse.onUpdateRow && (
                <ButtonIconElement
                  icon="edit_document"
                  onClick={() => collapse.onUpdateRow && collapse.onUpdateRow(row, index)}
                  disabled={disabledByParent || disabled.UPDATE}
                  color="success"
                  variant="contained"
                />
              )}
            </StackRowAlignJustCenter>
          );
        },
      });
    }

    return updateCollapseColumns;
  }, [collapse, widthCollapseActions]);

  const ref = useRef<HTMLTableElement | null>(null);
  const [widthTable, setWidthTable] = useState(0);

  useEffect(() => {
    if (ref.current) setWidthTable(ref.current.clientWidth);
  }, []);

  return (
    <TableContainerPart sx={sx}>
      <Table sx={{ height: loading || rows.length === 0 ? '100%' : 'none' }}>
        <TableHeadPart columns={columns} sx={sxHead} />
        <TableBody sx={sxBody}>
          {loading ? (
            <TableRow>
              <TableCell colSpan={columns.length}>
                <LoadingComponent />
              </TableCell>
            </TableRow>
          ) : rows.length ? (
            rows.map((row, index) => (
              <RowCollapsePart
                columns={columns}
                row={row}
                indexRow={index}
                key={index}
                onDisabled={onDisabled}
                indexLoadingRow={indexLoadingRow}
                collapse={{ ...collapse, columns: collapseColumns }}
                collapseTableWidth={widthTable}
                //
                onInfoRow={onInfoRow}
                onHistoryRow={onHistoryRow}
                onClickRow={onClickRow}
                onUpdateRow={onUpdateRow}
                onCopyRow={onCopyRow}
                onDeleteRow={onDeleteRow}
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length}>
                <EmptyComponent />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainerPart>
  );
};
