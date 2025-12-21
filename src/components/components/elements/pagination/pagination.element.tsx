import { SxProps, TablePagination, Theme } from '@mui/material';
import React, { useEffect } from 'react';
import { ButtonIconCircleElement } from '../button/button-icon-circle.element';
import { StackRowAlignCenter } from '../../styles/stack.style';
import { PADDING_GAP_ITEM_SMALL } from '../../../common/constant/style.constant';

export interface PaginationElementProps {
  total?: number;
  page: number;
  take: number;
  openRowsPerPage?: boolean;
  onChange: (pagination: { page: number; take: number }) => void;
  sx?: SxProps<Theme>;
}

const CustomPaginationActions = ({
  count,
  page,
  rowsPerPage,
  onPageChange,
}: {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
}) => {
  return (
    <StackRowAlignCenter gap={1}>
      <ButtonIconCircleElement
        icon="chevron_left"
        onClick={(event) => onPageChange(event, page - 1)}
        disabled={page === 0}
        size="small"
      />

      <ButtonIconCircleElement
        icon="chevron_right"
        onClick={(event) => onPageChange(event, page + 1)}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        size="small"
      />
    </StackRowAlignCenter>
  );
};

export const PaginationElement: React.FC<PaginationElementProps> = ({
  total = 0,
  page,
  take,
  openRowsPerPage = false,
  onChange,
  sx = {},
}) => {
  const [pageInternal, setPageInternal] = React.useState(page - 1);
  const [rowsPerPage, setRowsPerPage] = React.useState(take);

  useEffect(() => {
    setPageInternal(page - 1);
    setRowsPerPage(take);
  }, [page, take]);

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const tempTake = parseInt(event.target.value, 10);
    setRowsPerPage(tempTake);
    setPageInternal(0);
    onChange({ page: 1, take: tempTake });
  };

  return (
    <TablePagination
      component="div"
      count={total}
      page={pageInternal}
      rowsPerPage={rowsPerPage}
      onPageChange={(_, newPage) => {
        setPageInternal(newPage);
        onChange({ page: newPage + 1, take: rowsPerPage });
      }}
      onRowsPerPageChange={handleChangeRowsPerPage}
      rowsPerPageOptions={openRowsPerPage ? [5, 10, 25, 50] : []}
      ActionsComponent={CustomPaginationActions}
      sx={{
        '& .MuiToolbar-root': {
          padding: 0,
          minHeight: 'unset',
          height: 40,
          gap: PADDING_GAP_ITEM_SMALL,
        },
        width: 'unset !important',
        ...sx,
      }}
      labelDisplayedRows={({ from, to, count }) => `${from} - ${to} / ${count !== -1 ? count : `more than ${to}`}`}
    />
  );
};
