import { createTheme, Theme } from '@mui/material';
import { Mode } from '@/common/enums/mode.enum';
import { dark, light, OTHER } from '@/common/constant/mode.constant';

export const MODE = {
  [Mode.LIGHT]: light,
  [Mode.DARK]: dark,
  OTHER,
};

export const createAppTheme = (mode: Mode): Theme => {
  return createTheme({
    ...MODE[mode],
    ...MODE.OTHER,
    components: {
      MuiButton: {
        defaultProps: {
          size: 'medium',
          fullWidth: true,
        },
        styleOverrides: {
          root: {
            '&.Mui-disabled': {
              borderColor: MODE[mode].palette.divider,
            },
            fontWeight: 400,
            lineHeight: 'unset',
            textTransform: 'none',
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: MODE[mode].palette.background.paper,
            color: MODE[mode].palette.text.primary,
            boxShadow: MODE[mode].shadows[1],
            padding: '8px 12px',
            borderRadius: '8px',
            maxWidth: 'none',
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: 'outlined',
          size: 'small',
          fullWidth: true,
        },
        styleOverrides: {
          root: {
            '& fieldset': {
              borderColor: MODE[mode].palette.divider,
              borderRadius: '8px',
            },
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: MODE[mode].palette.divider,
          },
        },
      },
    },
  } as any);
};