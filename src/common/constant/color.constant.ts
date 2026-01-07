/**
 * @deprecated This file is deprecated. Please use Tailwind CSS utility classes and CSS variables defined in src/index.css instead.
 * Example: Instead of COLOR_CONSTANT.main, use 'text-primary' or 'bg-primary'.
 */

interface ColorSystem {
  tag: Record<string, string>;
  button: Record<string, string>;
}

export const COLOR_CONSTANT = {
  error: '#FF4444',
  successLight: '#3CB353',
  success: '#3DAF42',
  main: '#07554B',
  mainLight: '#11B6AF',
  info: '#1570EF',
  warning: '#CA8A03',
  secondary: '#BF00E0',

  //Color system
  white: '#ffffff',

  gray: '#140e0eff',
  gray2: '#BEBEBE',
  gray3: '#7A7A7A',
  gray4: '#525252',
  gray5: '#4B5563',
  gray6: '#737373',
  gray7: '#221e1eff',
  gray8: '#E3E3E3',
  gray9: '#F4F4F7',
  gray10: '#FAFAFA',

  green: '#16A34A',
  green2: '#E6EEED',
  green3: '#008A77',
  green4: '#f2f6f5',

  blue: '#D08B0D',
  blue2: '#2D9CDB',

  red: '#961208e0',
  red2: '#F04438',

  black: '#0A0A0A',

  yellow: '#FFF59D',

  //ProjectStatus
  new: '#DFDFDF',
  pending: '#D08B0D',
  pending_submit: '#ec9f0fea',
  overDue: '#D44B00',
  primary: '#2563EB', // để tạm thời nếu dùng thì thay đổi sau
};
export const COLOR_SYSTEM: ColorSystem = {
  tag: {
    error: COLOR_CONSTANT.error,
    warning: COLOR_CONSTANT.warning,
    success: COLOR_CONSTANT.success,
    info: COLOR_CONSTANT.info,
    primary: COLOR_CONSTANT.main,
    secondary: COLOR_CONSTANT.secondary,
    // ACTIVE
    // [VideoBannerStatus.ACTIVE]: COLOR_CONSTANT.success,

  },

  button: {},
};

export const colorMap: Record<string, { backgroundColor: string; color: string }> = {
  success: { backgroundColor: COLOR_CONSTANT.success, color: COLOR_CONSTANT.white },
  error: { backgroundColor: COLOR_CONSTANT.error, color: COLOR_CONSTANT.white },
  cancel: { backgroundColor: COLOR_CONSTANT.gray2, color: COLOR_CONSTANT.white },
};
