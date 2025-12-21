import { Box, styled } from '@mui/material';
import { STYLE } from '@/common/constant';
import { ImageElement } from '../elements/image/image.element';

export const ImageBrand = styled(ImageElement)(({ theme }) => ({
  height: STYLE.HEIGHT_ELEMENT_OTHER,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: STYLE.BORDER_RADIUS_ELEMENT,
  '&:hover': { boxShadow: theme.shadows[1] },
  padding: 8,
  backgroundColor: 'white',
  cursor: 'pointer',
  width: 100,
  objectFit: 'contain',
}));

export const ImageBorderDashboard = styled(ImageElement)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: STYLE.BORDER_RADIUS_ELEMENT,
  height: 50,
  width: 70,
}));

export const ImageEmpty = styled(Box)(({ theme }) => ({
  width: 'auto',
  minWidth: 50,
  height: 50,
  borderRadius: STYLE.BORDER_RADIUS_ELEMENT,
  border: `1px dashed ${theme.palette.divider}`,
}));
export const VideoEmpty = styled(Box)(({ theme }) => ({
  width: 'auto',
  minWidth: 50,
  height: 50,
  borderRadius: STYLE.BORDER_RADIUS_ELEMENT,
  border: `1px dashed ${theme.palette.divider}`,
}));
