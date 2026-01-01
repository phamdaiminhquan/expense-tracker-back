import { alpha, Fade, SxProps, Table, TableBody, TableCell, TableRow, Theme, useTheme } from '@mui/material';
import React, { JSX } from 'react';
import { EmptyComponent } from '../empty/empty.component';
import { LoadingComponent } from '../loading/loading.component';
import { StackRowAlignJustCenter } from '../styles/stack.style';
import { TableContainerPart } from './part/table-container.part';
import { TableHeadPart } from './part/table-head.part';
import { DISABLED_DEFAULT, getStyleCell, getStyleRow } from './table.constant';
import { Column, OnClickRow, OnDisabled } from './table.interface';
import { CheckboxElement } from '../elements/check-box/check-box.element';
import { ButtonIconElement } from '../elements/button/button-icon.element';
import { TooltipOnHoverElement } from '../elements/tooltip/tooltip-on-hover.element';

export interface TableComponentProps<R> {
  loading?: boolean;
  columns: Column<R>[];
  rows?: R[];
  indexLoadingRow?: number;
  isStickyActions?: boolean;
  sx?: SxProps<Theme>;
  sxHead?: SxProps<Theme>;
  sxBody?: SxProps<Theme>;
  sxRow?: { [key: number]: SxProps<Theme> };
  rowSpanProperty?: string;
  idsSelectedObj?: Record<string, R>;

  onClickRow?: OnClickRow<R>;
  onDisabled?: OnDisabled<R>;

  onSelectAllRow?: (checkedAll: boolean) => void;

  // end row
  onSelectRow?: OnClickRow<R>;
  onDeleteRow?: OnClickRow<R>;
  onInfoRow?: OnClickRow<R>;
  onHistoryRow?: OnClickRow<R>;
  onCopyRow?: OnClickRow<R>;
  onUpdateRow?: OnClickRow<R>;
  onRestoreRow?: OnClickRow<R>;
  onDisabledRow?: OnClickRow<R>;
  onTooltipRow?: (row: R, index: number) => string | React.ReactElement;
  getDisabledIcon?: (row: R, index: number) => string;
  getDisabledTooltip?: (row: R, index: number) => boolean;
  // alignment for actions column header/cells (optional)
  actionsAlign?: 'right' | 'left' | 'center';
}

type TableComponentType = <R>(props: TableComponentProps<R>) => JSX.Element;

export const TableComponent: TableComponentType = ({
  loading = false,
  rows = [],
  columns: initialColumns,
  indexLoadingRow,
  isStickyActions = false,
  sx = {},
  sxHead = {},
  sxBody = {},
  sxRow = {},
  rowSpanProperty,
  idsSelectedObj = {},

  onClickRow,
  onDisabled,

  onSelectAllRow,

  // end row
  onSelectRow,
  onDeleteRow,
  onInfoRow,
  onHistoryRow,
  onCopyRow,
  onUpdateRow,
  onRestoreRow,
  onDisabledRow,
  onTooltipRow,
  getDisabledIcon,
  getDisabledTooltip,
  actionsAlign,
}) => {
  if (rows.length && onSelectRow && !(rows[0] as any)?.id)
    throw new Error('Vui lòng sử dụng rows có id để dùng chức năng onSelectRow!');
  if (onSelectAllRow && !onSelectRow) throw new Error('Vui lòng thêm onSelectRow để dùng chức năng onSelectAllRow!');

  const { palette } = useTheme();

  const lengthActions = [
    onSelectRow,
    onDeleteRow,
    onInfoRow,
    onHistoryRow,
    onDisabledRow,
    onCopyRow,
    onUpdateRow,
    onRestoreRow,
    onTooltipRow,
  ].filter(Boolean).length;
  const widthActions = lengthActions * 37.13 + (lengthActions - 1) * 16 + 16;

  const columns = React.useMemo(() => {
    const updateColumns = [...initialColumns];

    if (
      onSelectRow ||
      onDeleteRow ||
      onInfoRow ||
      onHistoryRow ||
      onCopyRow ||
      onUpdateRow ||
      onRestoreRow ||
      onTooltipRow ||
      onDisabledRow
    )
      updateColumns.push({
        id: 'actions',
        label: 'Actions',
        width: widthActions > 70 ? widthActions : 70,
        alignHead: actionsAlign ?? (onSelectAllRow ? 'center' : 'center'),
        stickyCss: isStickyActions ? { right: 0 } : undefined,
        render: (row, index) => {
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
              {onDisabledRow && (
                <ButtonIconElement
                  icon={getDisabledIcon ? getDisabledIcon(row, index) : 'visibility_off'}
                  onClick={() => onDisabledRow(row, index)}
                  disabled={disabledByParent || disabled.UPDATE}
                  color="secondary"
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
                  onClick={() => {
                    onCopyRow(row, index);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={disabledByParent || disabled.COPY}
                  color="primary"
                  variant="outlined"
                />
              )}
              {onUpdateRow && (
                <ButtonIconElement
                  icon="edit_document"
                  onClick={() => {
                    onUpdateRow(row, index);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={disabledByParent || disabled.UPDATE}
                  color="success"
                  variant="outlined"
                />
              )}
              {onRestoreRow && (
                <ButtonIconElement
                  icon="Restore"
                  onClick={() => {
                    onRestoreRow(row, index);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={disabledByParent || disabled.UPDATE}
                  color="warning"
                  variant="outlined"
                />
              )}
              {onTooltipRow && (
                <TooltipOnHoverElement
                  disabled={disabledByParent || getDisabledTooltip?.(row, index)}
                  content={onTooltipRow(row, index)}
                >
                  <ButtonIconElement
                    icon="schedule"
                    disabled={disabledByParent || getDisabledTooltip?.(row, index)}
                    color="secondary"
                    variant="outlined"
                  />
                </TooltipOnHoverElement>
              )}
              {onSelectRow && (
                <CheckboxElement
                  isSameButton
                  checked={Boolean(idsSelectedObj[(row as any).id])}
                  onClick={() => onSelectRow(row, index)}
                  disabled={disabledByParent || disabled.SELECT}
                  color="secondary"
                  sx={{
                    border: `1px solid ${disabledByParent || disabled.SELECT ? palette.divider : palette.secondary.main}`,
                    backgroundColor: 'transparent',
                    color: palette.secondary.main,
                    '&:hover': {
                      backgroundColor: alpha(palette.secondary.main, palette.action.hoverOpacity),
                      color: palette.secondary.main,
                    },
                    '&.Mui-checked': { color: palette.secondary.main },
                  }}
                />
              )}
            </StackRowAlignJustCenter>
          );
        },
      });

    return updateColumns;
  }, [
    initialColumns,
    onSelectRow,
    onDeleteRow,
    onInfoRow,
    onHistoryRow,
    onCopyRow,
    onUpdateRow,
    onRestoreRow,
    onTooltipRow,
    onDisabledRow,
    actionsAlign,
  ]);

  return (
    <TableContainerPart sx={sx}>
      <Table sx={{ height: loading || rows.length === 0 ? '100%' : 'none', borderCollapse: 'separate !important' }}>
        <TableHeadPart columns={columns} sx={sxHead} onSelectAllRow={onSelectAllRow} />
        <TableBody sx={sxBody}>
          {loading ? (
            <TableRow>
              <TableCell colSpan={columns.length}>
                <LoadingComponent />
              </TableCell>
            </TableRow>
          ) : rows.length ? (
            rows.map((row, index) => {
              const disabled = onDisabled ? onDisabled(row, index) : { ...DISABLED_DEFAULT };

              if (rowSpanProperty) {
                const rowSpan = (row as any)[rowSpanProperty].length;
                return (row as any)[rowSpanProperty].map((item: any, indexI: number) => {
                  return (
                    <Fade in={true} key={`${index}-${indexI}`} timeout={index * 120}>
                      <TableRow
                        hover
                        tabIndex={-1}
                        key={`${index}-${indexI}`}
                        onClick={() => onClickRow && onClickRow(row, index)}
                        sx={getStyleRow(Boolean(onClickRow), palette, index, sxRow, indexLoadingRow)}
                      >
                        {columns.map((column) => {
                          if (column.isRowSpan) {
                            if (indexI !== 0) return null;
                            return (
                              <TableCell
                                key={column.id}
                                align={column.align}
                                rowSpan={rowSpan}
                                sx={{
                                  ...getStyleCell(column, palette, disabled.DISABLED_ROW),
                                  verticalAlign: 'middle',
                                }}
                              >
                                {column.render ? column.render(row, index) : (row as any)[column.id]}
                              </TableCell>
                            );
                          } else
                            return (
                              <TableCell
                                key={column.id}
                                align={column.align}
                                sx={{
                                  ...getStyleCell(column, palette, disabled.DISABLED_ROW),
                                  verticalAlign: 'middle',
                                }}
                              >
                                {column.render
                                  ? column.render(item, indexI)
                                  : column.id
                                      .split('.')
                                      .slice(1)
                                      .reduce((obj: any, key) => obj?.[key], item)}
                              </TableCell>
                            );
                        })}
                      </TableRow>
                    </Fade>
                  );
                });
              } else
                return (
                  <Fade in={true} key={index} timeout={index * 120}>
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={index}
                      onClick={() => onClickRow && onClickRow(row, index)}
                      sx={getStyleRow(Boolean(onClickRow), palette, index, sxRow, indexLoadingRow)}
                    >
                      {columns.map((column) => {
                        return (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            sx={{
                              ...getStyleCell(column, palette, disabled.DISABLED_ROW),
                              verticalAlign: 'middle',
                            }}
                          >
                            {column.render ? column.render(row, index) : (row as any)[column.id]}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  </Fade>
                );
            })
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
