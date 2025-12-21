import {
  Box,
  Fade,
  FormControl,
  Stack,
  useTheme,
  FormHelperText,
  BaseTextFieldProps,
  SxProps,
  Theme,
} from '@mui/material';
import React, { useRef } from 'react';
import { ButtonUploadFileElement } from '../button/button-upload-file.element';
import { STYLE } from '../../../common/constant';
import { IconElement } from '../icon/icon.element';
import { ImageEmpty } from '../../styles/image.style';
import { InputLabelCustom } from '../../styles/input.style';
import { StackLabel } from '../../styles/stack.style';
import { ChangeEventCustom } from '../../../common/interfaces/change-event-custom.interface';
import { FileWithPreview, FileWithPreviewOrUrl } from '../../../common/interfaces/file.interface';

export interface TextFieldUploadImagesElementProps extends BaseTextFieldProps {
  iconLabel?: string;
  direction?: 'row' | 'column';
  error?: any;
  values?: FileWithPreviewOrUrl[];
  isBorderRadiusImage?: boolean;
  onChange?: (event: ChangeEventCustom<FileWithPreview[]>) => void;
  sxImage?: SxProps<Theme>;
  accept?: string;
}

export const TextFieldUploadImagesElement: React.FC<TextFieldUploadImagesElementProps> = ({
  name,
  label,
  iconLabel = 'home_storage',
  required = false,
  direction = 'column',
  error = '',
  values,
  helperText,
  isBorderRadiusImage,
  onChange,
  sx,
  sxImage,
  accept,
}) => {
  const { palette } = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);

  const change = (files: FileWithPreview[]) => onChange?.({ target: { name, value: files } });

  const resolvePreview = (v: FileWithPreviewOrUrl): string | undefined => {
    if (!v) return undefined;
    if (typeof v === 'string') return v;
    if (Array.isArray(v)) {
      const first = v[0];
      if (!first) return undefined;
      return typeof first === 'string' ? first : (first as FileWithPreview).preview;
    }
    return (v as FileWithPreview).preview;
  };

  return (
    <FormControl error={Boolean(error)} variant="outlined" sx={{ ...sx }}>
      <InputLabelCustom shrink required={required}>
        <StackLabel>
          <IconElement icon={iconLabel} sx={{ fontSize: STYLE.TEXT_FIELD.FONT_SIZE_LABEL }} />
          {label}
        </StackLabel>
      </InputLabelCustom>

      <Stack
        direction={direction}
        className="scroll-x"
        onClick={() => inputRef.current?.click()}
        sx={{
          alignItems: 'center',
          gap: '14px',
          padding: '14px',
          border: `1px solid ${error ? palette.error.main : palette.divider}`,
          borderRadius: STYLE.BORDER_RADIUS_ELEMENT,
          '&:hover': {
            borderColor: error ? palette.error.main : palette.text.primary,
          },
          '&:focus-within': {
            borderColor: palette.primary.main,
            boxShadow: `0 0 0 2px ${palette.primary.light}`,
          },
          overflow: 'auto',
        }}
      >
        {values?.length ? (
          values.map((value, index) => (
            <Fade in={true} key={index} timeout={index * 300}>
              <Stack>
                <Box
                  component="img"
                  src={resolvePreview(value) || '/images/diamond.png'}
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
          ))
        ) : (
          <ImageEmpty sx={{ ...sxImage }} />
        )}
        <Box onClick={(e) => e.stopPropagation()}>
          <ButtonUploadFileElement accept={accept} multiple onChange={change} inputRef={inputRef} />
        </Box>
      </Stack>

      {(error || helperText) && <FormHelperText error={Boolean(error)}>{error || helperText}</FormHelperText>}
    </FormControl>
  );
};
