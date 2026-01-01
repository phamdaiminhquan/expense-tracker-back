import { Stack, styled } from '@mui/material';
import { STYLE } from '@/common/constant';

export const StackRow = styled(Stack)(() => ({
  flexDirection: 'row',
}));

export const StackHaveImage = styled(Stack)(() => ({
  height: STYLE.HEIGHT_IMAGE_DEFAULT,
  gap: 0,
  justifyContent: 'space-between',
}));

export const StackWrap = styled(Stack)(() => ({
  flexDirection: 'row',
  flexWrap: 'wrap',
}));

export const StackTabs = styled(Stack)(({ theme }) => ({
  borderRadius: STYLE.BORDER_RADIUS_ELEMENT_WRAPPER,
  padding: '6px',
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
  width: 'fit-content',
  gap: 'unset',
}));

export const StackRowAlignCenter = styled(Stack)(() => ({
  flexDirection: 'row',
  alignItems: 'center',
}));

export const StackRowAlignEnd = styled(Stack)(() => ({
  flexDirection: 'row',
  alignItems: 'flex-end',
}));

export const StackRowJustCenter = styled(Stack)(() => ({
  flexDirection: 'row',
  justifyContent: 'center',
}));

export const StackRowJustAround = styled(Stack)(() => ({
  flexDirection: 'row',
  justifyContent: 'space-around',
}));

export const StackRowAlignJustCenter = styled(Stack)(() => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const StackRowAlignCenterJustEnd = styled(Stack)(() => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-end',
}));

export const StackRowJustEnd = styled(Stack)(() => ({
  flexDirection: 'row',
  justifyContent: 'flex-end',
}));

export const StackRowJustBetween = styled(Stack)(() => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
}));

export const StackRowAlignCenterJustBetween = styled(Stack)(() => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

export const StackRowAlignStartJustBetween = styled(Stack)(() => ({
  flexDirection: 'row',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
}));

export const StackBgDefaultBorRadLayCol = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: STYLE.PADDING_GAP_LAYOUT,
  borderRadius: STYLE.BORDER_RADIUS_ELEMENT,
}));

export const StackBgPaperBorRadLayCol = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: STYLE.PADDING_GAP_LAYOUT,
  borderRadius: STYLE.BORDER_RADIUS_ELEMENT,
}));

export const StackLabel = styled(Stack)(() => ({
  flexDirection: 'row',
  alignItems: 'center',
  marginRight: STYLE.PADDING_GAP_ITEM_SMALL,
  gap: STYLE.PADDING_GAP_ITEM_SMALL,
}));
