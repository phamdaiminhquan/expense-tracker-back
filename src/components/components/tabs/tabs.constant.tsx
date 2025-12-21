import { Theme } from '@emotion/react';
import { SxProps } from '@mui/system';
import { STYLE } from '@/common/constant';

export const TAB_STYLES: SxProps<Theme> = {
  height: 'auto',
  position: 'relative',
  padding: `6px ${STYLE.PADDING_GAP_ITEM}`,
  cursor: 'pointer',
};

export const TAB_BACKGROUND_STYLES: SxProps<Theme> = {
  width: '100%',
  height: '100%',
  position: 'absolute',
  borderRadius: STYLE.BORDER_RADIUS_ELEMENT,
  top: 0,
  left: 0,
};
