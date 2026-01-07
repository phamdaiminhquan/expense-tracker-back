import { ThemeOptions } from '@mui/material';
import { Mode } from '../enums/mode.enum';

export const dark = {
  palette: {
    mode: Mode.DARK,
    primary: {
      main: '#388e8e', // Sáng và dễ nhìn
      light: '#1de9b6', // Tươi sáng và dễ phân biệt
      dark: '#00796b', // Xanh đậm, sáng và rõ nét
      contrastText: '#0c0c0c', //
    },
    secondary: {
      main: '#D433FF', // Sáng hơn main gốc
      light: '#DC4BFF', // Sáng hơn light gốc
      dark: '#BE29E6', // Sáng hơn dark gốc
      contrastText: '#0c0c0c', //
    },
    error: {
      main: '#FF4444', // Màu đỏ tươi nổi bật
      light: '#FF6666', // Màu đỏ nhạt hơn để tạo sự cân bằng
      dark: '#CC0000', // Màu đỏ đậm nhưng vẫn giữ độ rực rỡ
      contrastText: '#0c0c0c', //
    },
    warning: {
      main: '#ffc107', //
      light: '#ffc71f', //
      dark: '#e5ad06', //
      contrastText: '#0c0c0c', //
    },
    info: {
      main: '#3096F0', // Sáng hơn main gốc
      light: '#5FAAF0', // Sáng hơn light gốc
      dark: '#2A88E0', // Sáng hơn dark gốc
      contrastText: '#0c0c0c', //
    },
    success: {
      main: '#3DAF42', // Sáng hơn main gốc
      light: '#55BB5A', // Sáng hơn light gốc
      dark: '#379D3A', // Sáng hơn dark gốc
      contrastText: '#0c0c0c', //
    },

    text: {
      primary: '#fdfdfd', // Text
      secondary: '#b4b4b4', // Label bên trên textfield //
      disabled: '#606060', // Màu disable của content textfield
    },
    divider: '#545454', // Border //
    action: {
      active: '#b4b4b4', // Icon đổ xuống ở TextField select //
      hover: '#0c0c0c', //
      hoverOpacity: 0.05, // Độ mờ khi hover vào button outlined
      selected: 'rgba(255, 255, 255, 0.16)',
      selectedOpacity: 'none', // Độ mờ khi select rồi nhưng hover tiếp
      disabled: '#2f2f2f', // Border textfield, content button when disable
      disabledBackground: '#414141', // Background button
      disabledOpacity: 0,
      focus: 'rgba(0, 0, 0, 0.12)',
      focusOpacity: 0,
      activatedOpacity: 0,
    },
    background: {
      paper: '#1e1e1e', //
      default: '#010101', //
    },
  },
  shadows: [
    'none',
    'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
    'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
    'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
    'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
    'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
    'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
    'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
    'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
    'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
    'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
    'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
    'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
    'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
    'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
    'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
    'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
    'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
    'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
    'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
    'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
    'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
    'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
    'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
    'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
  ],
};

export const light = {
  palette: {
    mode: Mode.LIGHT,
    primary: {
      main: '#07554b',
      light: '#018775',
      dark: '#043731',
      contrastText: '#fdfdfd', //
    },
    secondary: {
      main: '#bf00e0', //
      light: '#c519e3', //
      dark: '#ab00c9', //
      contrastText: '#fdfdfd', //
    },
    error: {
      main: '#BB0000', //
      light: '#DD0000', //
      dark: '#9A0000', //
      contrastText: '#fdfdfd', //
    },
    warning: {
      main: '#b38600', // đậm hơn #e6ac00
      light: '#b38f00', // đậm hơn #e6b800
      dark: '#996600', // đậm hơn #cc9900
      contrastText: '#fdfdfd', //
    },
    info: {
      main: '#105089', //
      light: '#276194', //
      dark: '#0e487b', //
      contrastText: '#fdfdfd', //
    },
    success: {
      main: '#2e7d32', //
      light: '#428a46', //
      dark: '#29702d', //
      contrastText: '#fdfdfd', //
    },

    text: {
      primary: '#0c0c0c', // Text
      secondary: '#242424', // Label bên trên textfield
      disabled: '#a7a7a7', // Màu disable của content textfield
    },

    divider: '#cfcfcf', // Border

    action: {
      active: '#242424', // Icon đổ xuống ở TextField select
      hover: '#eaeaea', // Màu hover
      hoverOpacity: 0.05, // Độ mờ khi hover vào button outlined
      selected: 'rgba(0, 0, 0, 0.08)',
      selectedOpacity: 'none', // Độ mờ khi select rồi nhưng hover tiếp
      disabled: '#d4d4d4', // Border textfield, content button when disable
      disabledBackground: '#b7b7b7', // Background button
      disabledOpacity: 0,
      focus: 'rgba(0, 0, 0, 0.12)',
      focusOpacity: 0,
      activatedOpacity: 0,
    },

    background: {
      paper: '#fafafa', //
      default: '#ffffff', //
    },
  },
  shadows: [
    'none',
    'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px',
    'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px',
    'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px',
    'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px',
    'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px',
    'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px',
    'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px',
    'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px',
    'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px',
    'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px',
    'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px',
    'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px',
    'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px',
    'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px',
    'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px',
    'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px',
    'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px',
    'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px',
    'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px',
    'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px',
    'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px',
    'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px',
    'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px',
    'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px',
  ],
};

export const OTHER: ThemeOptions = {
  typography: {
    fontFamily: '"Inter", sans-serif',
    fontWeightRegular: 400,
    fontWeightMedium: 550,
    fontWeightBold: 600,
    h1: {
      fontWeight: 900,
      fontSize: 40,
    },
    h2: {
      fontWeight: 700,
      fontSize: 35,
    },
    h3: {
      fontWeight: 600,
      fontSize: 30,
    },
    h4: {
      fontWeight: 600,
      fontSize: 25,
    },
    h5: {
      fontSize: 22,
      fontWeight: 600,
    },
    h6: {
      fontSize: 18,
      fontWeight: 550,
    },
    subtitle2: {
      fontSize: 15,
      fontWeight: 550,
    },
    subtitle1: {
      fontWeight: 550,
      fontSize: 14,
    },
    body2: {
      fontWeight: 500,
      fontSize: 14,
    },
    body1: {
      fontWeight: 400,
      fontSize: 14,
    },
    caption: {
      fontSize: 12,
      fontWeight: 300,
    },
    overline: {
      textTransform: 'none',
      fontSize: 12,
      fontWeight: 300,
    },
  },
};
