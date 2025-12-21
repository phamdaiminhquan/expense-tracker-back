import {
  BaseTextFieldProps,
  Box,
  Fade,
  FormControl,
  FormHelperText,
  Stack,
  SxProps,
  Theme,
  useTheme,
} from '@mui/material';
import React, { useRef } from 'react';
import { STYLE } from '../../../common/constant';
import { ImageEmpty } from '../../styles/image.style';
import { InputLabelCustom } from '../../styles/input.style';
import { StackLabel } from '../../styles/stack.style';
import { ButtonUploadFileElement } from '../button/button-upload-file.element';
import { IconElement } from '../icon/icon.element';
import { ChangeEventCustom } from '../../../common/interfaces/change-event-custom.interface';
import { FileWithPreview, FileWithPreviewOrUrl } from '../../../common/interfaces/file.interface';

export interface TextFieldUploadImageElementProps extends Omit<BaseTextFieldProps, 'error'> {
  iconLabel?: string;
  direction?: 'row' | 'column';
  error?: string | boolean;
  value?: FileWithPreviewOrUrl;
  isBorderRadiusImage?: boolean;
  onChange?: (event: ChangeEventCustom<FileWithPreview>) => void;
  sxImage?: SxProps<Theme>;
  disabled?: boolean;
  accept?: string;
}

export const TextFieldUploadImageElement: React.FC<TextFieldUploadImageElementProps> = ({
  name,
  label,
  iconLabel = 'home_storage',
  required = false,
  direction = 'row',
  error = '',
  value,
  helperText,
  isBorderRadiusImage,
  onChange,
  sxImage,
  disabled = false,
  accept,
  sx,
}) => {
  const { palette } = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);

  const change = (files: FileWithPreview[]) => onChange?.({ target: { name, value: files[0] } });

  const resolvePreviewSingle = (v: FileWithPreviewOrUrl): string => {
    if (!v) return '';
    if (typeof v === 'string') return v;
    if (Array.isArray(v)) {
      const first = v[0];
      if (!first) return '';
      return typeof first === 'string' ? first : (first as FileWithPreview).preview || '';
    }
    return (v as FileWithPreview).preview || '';
  };

  return (
    <FormControl error={Boolean(error)} variant="outlined" sx={{ ...sx }} disabled={disabled}>
      <InputLabelCustom shrink required={required}>
        <StackLabel>
          <IconElement icon={iconLabel} sx={{ fontSize: STYLE.TEXT_FIELD.FONT_SIZE_LABEL }} />
          {label}
        </StackLabel>
      </InputLabelCustom>

      <Stack
        direction={direction}
        className="scroll-x"
        onClick={() => !disabled && inputRef.current?.click()}
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '14px',
          padding: '14px',
          border: `1px solid ${error ? palette.error.main : palette.divider}`,
          borderRadius: STYLE.BORDER_RADIUS_ELEMENT,
          cursor: disabled ? 'default' : 'pointer',
          '&:hover': {
            borderColor: error ? palette.error.main : palette.text.primary,
          },
          '&:focus-within': {
            borderColor: palette.primary.main,
            boxShadow: `0 0 0 2px ${palette.primary.light}`,
          },
          overflow: 'auto',
          height: '100%',
        }}
      >
        {value ? (
          <Fade in={true} timeout={300}>
            <Stack>
              <Box
                component="img"
                src={resolvePreviewSingle(value)}
                sx={{
                  width: 'auto',
                  minWidth: 50,
                  height: 50,
                  borderRadius: isBorderRadiusImage ? STYLE.BORDER_RADIUS_ELEMENT : 'none',
                  objectFit: 'contain',
                  ...sxImage,
                }}
              />
            </Stack>
          </Fade>
        ) : (
          <ImageEmpty sx={{ ...sxImage }} />
        )}
        <Box onClick={(e) => e.stopPropagation()}>
          <ButtonUploadFileElement accept={accept} onChange={change} disabled={disabled} inputRef={inputRef} />
        </Box>
      </Stack>

      {(error || helperText) && <FormHelperText error={Boolean(error)}>{error || helperText}</FormHelperText>}
    </FormControl>
  );
};
