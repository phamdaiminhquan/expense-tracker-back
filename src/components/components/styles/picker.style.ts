import { Palette, SxProps, Theme } from '@mui/material';
import { STYLE } from '@/common/constant';
import { OPACITY } from '@/common/constant/opacity.constant';

export const getPickerSx = (palette: Palette, sx: SxProps<Theme>) => ({
  '& fieldset legend': { maxWidth: '100% !important' },
  '& .MuiPickersInputBase-root': {
    borderColor: palette.divider,
    borderRadius: STYLE.BORDER_RADIUS_ELEMENT,
    height: STYLE.HEIGHT_DEFAULT_TEXT_FIELD_BUTTON,
  },
  '&.MuiPickersTextField-root': { ...(sx as any) },
});

export const getPopperProps = () => ({
  sx: { boxShadow: 1, overflow: 'hidden' },
  modifiers: [
    {
      name: 'customStyle',
      enabled: true,
      phase: 'beforeWrite',
      fn: ({ state }: any) => {
        Object.assign(state.elements.popper.style, {
          borderRadius: STYLE.BORDER_RADIUS_ELEMENT_WRAPPER,
          overflow: 'hidden',
        });
      },
    },
  ],
});

export const getActionBarSx = (palette: Palette) => ({
  '& button': { textTransform: 'none', width: 100 },
  '& button:nth-of-type(1)': {
    border: `1px solid ${palette.primary.main}`,
    color: palette.primary.main,
    background: 'transparent',
    borderRadius: STYLE.BORDER_RADIUS_ELEMENT,
    '&:hover': { backgroundColor: palette.divider + OPACITY[20] },
  },
  '& button:nth-of-type(2)': {
    background: palette.primary.main,
    color: palette.primary.contrastText,
    borderRadius: STYLE.BORDER_RADIUS_ELEMENT,
    '&:hover': { backgroundColor: palette.primary.dark },
  },
});
