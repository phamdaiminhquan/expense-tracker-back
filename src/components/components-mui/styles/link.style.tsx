import { styled } from '@mui/material';
import { STYLE } from '@/common/constant';
import { LinkElement } from '../elements/link/link.element';

export const LinkWrapProductRow = styled(LinkElement)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  borderRadius: STYLE.BORDER_RADIUS_ELEMENT,
  border: `1px solid ${theme.palette.divider}`,
  padding: STYLE.PADDING_GAP_ITEM,
  gap: STYLE.PADDING_GAP_ITEM,
  backgroundColor: theme.palette.background.default,
}));
