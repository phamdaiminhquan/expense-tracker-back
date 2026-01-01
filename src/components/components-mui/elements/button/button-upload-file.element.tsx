import React, { useEffect, useRef, useState } from 'react';
import { ButtonProps, Stack } from '@mui/material';
import { ButtonIconElement } from './button-icon.element';
import { FileWithPreview } from '@/common/interfaces/file.interface';

export interface ButtonUploadFileElementProps extends Omit<ButtonProps, 'onChange'> {
  multiple?: boolean;
  onChange: (files: FileWithPreview[]) => void;
  accept?: string;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

export const ButtonUploadFileElement: React.FC<ButtonUploadFileElementProps> = ({
  multiple = false,
  onChange,
  accept = 'image/*,video/*',
  inputRef,
  ...rest
}) => {
  const [files, setFiles] = useState<FileWithPreview[]>();

  const internalRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = inputRef || internalRef;

  const change = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesTemp = Array.from(event.target.files).map((file: File) =>
        Object.assign(file, { preview: URL.createObjectURL(file) }),
      );
      setFiles(filesTemp);
      onChange(filesTemp);
    }
  };

  useEffect(() => {
    return () =>
      files?.forEach((file) => {
        URL.revokeObjectURL(file.preview);
      });
  }, [files]);

  return (
    <React.Fragment>
      <Stack sx={{ width: 'fit-content', height: 'fit-content' }}>
        <ButtonIconElement
          {...rest}
          icon="drive_folder_upload"
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
        />
      </Stack>
      <input type="file" accept={accept} hidden multiple={multiple} ref={fileInputRef} onChange={change} />
    </React.Fragment>
  );
};
