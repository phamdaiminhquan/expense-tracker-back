import { createTheme, Theme } from '@mui/material';
import { MODE, STYLE } from '../constant';
import { Mode } from '../enums/mode.enum';
import { getLimitLineCss } from './other.utils';
import { OPACITY } from '../constant/opacity.constant';

export const getTheme = (mode = Mode.LIGHT) => {
  return createTheme({
    ...MODE[mode],
    ...MODE.OTHER,
    components: {
      MuiStack: {
        styleOverrides: { root: { gap: STYLE.PADDING_GAP_LAYOUT } },
      },
      MuiButton: {
        defaultProps: { size: 'medium', fullWidth: true },
        styleOverrides: {
          root: {
            '&.Mui-disabled': {
              borderColor: MODE[mode].palette.divider,
            },
            fontWeight: 400,
            lineHeight: 'unset',
            height: STYLE.HEIGHT_DEFAULT_TEXT_FIELD_BUTTON,
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: MODE[mode].palette.background.paper,
            color: MODE[mode].palette.text.primary,
            boxShadow: MODE[mode].shadows[1],
            padding: STYLE.PADDING_GAP_ITEM,
            margin: `5px !important`,
            borderRadius: STYLE.BORDER_RADIUS_ELEMENT_WRAPPER,
            maxWidth: 'none',
          },
        },
      },
      MuiTextField: {
        defaultProps: { variant: 'outlined', size: 'small', fullWidth: true },
        styleOverrides: {
          root: {
            '& fieldset': {
              borderColor: MODE[mode].palette.divider,
              borderRadius: STYLE.BORDER_RADIUS_ELEMENT,
            },
            '& .MuiFormHelperText-root': { ...getLimitLineCss(1) },
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: { borderColor: `${MODE[mode].palette.divider}${OPACITY[30]}` },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            fontWeight: 'unset',
            boxShadow: 'none',
            border: 'none',
            '&:first-of-type': {
              borderTopLeftRadius: STYLE.BORDER_RADIUS_ELEMENT,
              borderBottomLeftRadius: STYLE.BORDER_RADIUS_ELEMENT,
            },
            '&:last-of-type': {
              borderTopRightRadius: STYLE.BORDER_RADIUS_ELEMENT,
              borderBottomRightRadius: STYLE.BORDER_RADIUS_ELEMENT,
            },
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          '*::-webkit-scrollbar': {
            width: '6px',
            height: '6px',
          },
          '*::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '*::-webkit-scrollbar-thumb': {
            borderRadius: '8px',
            backgroundClip: 'content-box',
            backgroundColor: 'rgba(0,0,0,0.25)',
            transition: 'background-color 0.3s',
          },
          '*:hover::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,0.45)',
          },
        },
      },
    },
  } as unknown as Theme);
};
