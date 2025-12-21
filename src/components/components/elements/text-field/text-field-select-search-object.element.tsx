/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import TextField, { BaseTextFieldProps } from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { STYLE } from '@/common/constant';
import { IconElement } from '../icon/icon.element';
import { EmptyComponent } from '../../empty/empty.component';
import { LoadingComponent } from '../../loading/loading.component';
import { PaperSelect } from '../../styles/paper.style';
import { StackLabel } from '../../styles/stack.style';
import { Chip } from '@mui/material';

export interface TextFieldSelectSearchObjectElementProps extends BaseTextFieldProps {
  openTest?: boolean;
  iconLabel?: string;
  error?: any;
  multiple?: boolean;
  loading?: boolean;
  options?: any[];
  onChange?: (event: React.ChangeEvent<HTMLInputElement> | any) => void;
  onInputChange?: (event: React.SyntheticEvent, newInputValue: string, reason: string) => void;
  renderOption?: (option: any) => React.ReactNode;
  isOptionEqualToValue?: (option: any, value: any) => boolean;
  getOptionLabel?: (option: any) => any;
  getOptionKey?: (option: any) => string | number;
  getOptionDisabled?: (option: any) => boolean;
  freeSolo?: boolean;
}

export const TextFieldSelectSearchObjectElement: React.FC<TextFieldSelectSearchObjectElementProps> = ({
  name,
  openTest = false,
  label,
  iconLabel = 'checklist',
  error = '',
  placeholder = 'Tìm kiếm...',
  value,
  multiple = false,
  loading,
  disabled = false,
  fullWidth = true,
  helperText,
  options,
  onInputChange,
  renderOption,
  onChange,
  isOptionEqualToValue,
  getOptionLabel,
  getOptionKey,
  getOptionDisabled,
  sx = {},
  freeSolo = false,
  ...restInput
}) => {
  const change = (_: any, value: any) => {
    onChange?.({ target: { name, value } });
  };

  // Filter out disabled options
  const filteredOptions = options?.filter((option) => !getOptionDisabled?.(option)) || [];

  return (
    <Autocomplete
      openOnFocus
      options={filteredOptions}
      sx={{
        ...sx,
        '& .MuiChip-root': {
          borderRadius: STYLE.BORDER_RADIUS_ELEMENT,
          padding: '0 4px',
          margin: '0px 1px',
          height: '24px',
          '& .MuiChip-deleteIcon': { fontSize: '18px', marginRight: '0px' },
          '& .MuiChip-label': { paddingLeft: '1px', transform: 'translateY(0.5px)', paddingRight: 1.5 },
          '&.Mui-disabled': { opacity: 1 },
          '& .MuiAutocomplete-option.Mui-disabled': {
            opacity: 1,
            pointerEvents: 'none',
          },
        },
      }}
      {...(openTest && { open: openTest })}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            {...getTagProps({ index })}
            label={getOptionLabel ? getOptionLabel(option) : option?.label || option}
            size="small"
            disabled={disabled}
          />
        ))
      }
      getOptionLabel={getOptionLabel}
      getOptionDisabled={getOptionDisabled}
      getOptionKey={getOptionKey}
      value={value || (multiple ? [] : null)}
      disabled={disabled}
      freeSolo={freeSolo}
      onChange={change}
      onInputChange={(event, newInputValue, reason) => {
        if (reason === 'input') onInputChange?.(event, newInputValue, reason);
      }}
      renderOption={(props, option) => {
        const { key, ...restProps } = props as any;
        return (
          <li key={key} {...restProps}>
            {renderOption ? renderOption(option) : getOptionLabel!(option)}
          </li>
        );
      }}
      multiple={multiple}
      disableCloseOnSelect={multiple}
      fullWidth={fullWidth}
      loading={loading}
      clearIcon={<IconElement icon="close_small" />}
      popupIcon={<IconElement icon="arrow_drop_down" />}
      isOptionEqualToValue={isOptionEqualToValue}
      noOptionsText={<EmptyComponent />}
      loadingText={<LoadingComponent />}
      renderInput={(params) => (
        <TextField
          {...params}
          InputLabelProps={{ shrink: true, sx: { display: 'flex' } }}
          label={
            <StackLabel>
              <IconElement icon={iconLabel} sx={{ fontSize: STYLE.TEXT_FIELD.FONT_SIZE_LABEL }} />
              {label}
            </StackLabel>
          }
          error={Boolean(error)}
          name={name}
          placeholder={placeholder}
          helperText={error || helperText}
          {...restInput}
        />
      )}
      PaperComponent={({ children }) => <PaperSelect>{children}</PaperSelect>}
    />
  );
};
