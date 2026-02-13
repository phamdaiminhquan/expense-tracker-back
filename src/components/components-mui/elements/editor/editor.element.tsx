// import React from 'react';
// import {
//   SxProps,
//   FormControl,
//   InputLabel,
//   Box,
//   Input,
//   Button,
//   Stack,
//   FormHelperText,
//   useTheme,
//   Theme,
// } from '@mui/material';
// import { fileApi } from '../../../apis';
// import { FileTypeEnum } from '../../../common/enums/file-type.enum';
// import { checkUploadFile } from '../../../common/utils/file.utils';
// import { SnackbarType, useSnackbar } from '../../../hooks/use-snackbar';
// import { PADDING_GAP_ITEM } from '@/common/constant/style.constant';
// import { toolbarFull } from './ckeditor.constant';
// import { STYLE } from '@/common/constant';
// import { getErrorMessage } from '@/common/utils/string.utils';
// import { LoadingComponent } from '../../loading/loading.component';
// import { StackLabel } from '../../styles/stack.style';
// import { IconElement } from '../icon/icon.element';

// export interface EditorElementProps {
//   name?: string;
//   label: string;
//   iconLabel?: string;
//   required?: boolean;
//   minHeight?: number;
//   error?: string;
//   placeholder?: string;
//   value?: any;
//   isResetData?: boolean;
//   helperText?: string;
//   onChange?: (event: React.ChangeEvent<HTMLInputElement> | any) => void;
//   sx?: SxProps<Theme>;
//   toolbar?: string[];
//   loading?: boolean;
//   autosave?: boolean;
//   uploadVideo?: boolean;
//   readOnly?: boolean;
//   disabled?: boolean;
// }

// export const EditorElement: React.FC<EditorElementProps> = ({
//   name,
//   label,
//   iconLabel = 'blur_on',
//   required = false,
//   minHeight = 260,
//   error = '',
//   placeholder = 'Nhập nội dung...',
//   value,
//   isResetData,
//   helperText,
//   onChange,
//   toolbar = toolbarFull,
//   loading,
//   autosave,
//   uploadVideo,
//   readOnly,
//   disabled,
// }) => {
//   const { palette } = useTheme();
//   const editorInstanceRef = React.useRef<any | null>(null);

//   const { showSnackbar } = useSnackbar();

//   const change = (data: any) => onChange?.({ target: { name, value: data } });

//   const uploadAdapter = (loader: any) => {
//     return {
//       upload: async () => {
//         try {
//           const file = await loader.file;

//           const maxSizeBytes = 1024 * 1024;
//           if (file.size > maxSizeBytes) {
//             return Promise.reject(
//               showSnackbar({
//                 type: SnackbarType.ERROR,
//                 message: `Kích thước hình ảnh vượt quá giới hạn 1 MB.`,
//               }),
//             );
//           }

//           const url = await checkUploadFile(file);

//           return { default: url };
//         } catch (error) {
//           showSnackbar({ type: SnackbarType.ERROR, message: getErrorMessage(error) });
//           return { default: '' };
//         }
//       },
//     };
//   };

//   const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file: any = e.target.files?.[0];
//     if (file && file.type.startsWith('video/')) {
//       try {
//         const maxVideoSizeMB = 500;
//         if (file.size > maxVideoSizeMB * 1024 * 1024) {
//           showSnackbar({
//             type: SnackbarType.ERROR,
//             message: `Kích thước video vượt quá giới hạn ${maxVideoSizeMB} MB.`,
//           });
//           e.target.value = '';
//           return;
//         }
//         showSnackbar({ message: 'Đang upload video...', type: SnackbarType.INFO });

//         // Gọi trực tiếp fileApi.createFile để nhận full response
//         const response = await fileApi.createFile({
//           file,
//           type: FileTypeEnum.VIDEO,
//           generateThumbnail: true,
//         });

//         const editor = editorInstanceRef.current;
//         if (editor) {
//           // Sử dụng thumbnailUrl để hiển thị trong editor, nhưng lưu videoUrl vào data-video-url
//           const videoUrl = response.url;
//           const thumbnailUrl = response.thumbnailUrl || videoUrl;

//           const viewFragment = editor.data.processor.toView(
//             `<figure class="image">
//               <img src="${thumbnailUrl}" alt="${videoUrl}" data-is-video="true" data-video-url="${videoUrl}" />
//             </figure>`,
//           );
//           const modelFragment = editor.data.toModel(viewFragment);

//           // INSERT VÀO VỊ TRÍ CON TRỎ
//           editor.model.insertContent(modelFragment, editor.model.document.selection);

//           showSnackbar({ message: 'Upload video thành công!', type: SnackbarType.SUCCESS });
//         }
//       } catch (error) {
//         showSnackbar({ type: SnackbarType.ERROR, message: getErrorMessage(error) });
//       } finally {
//         e.target.value = '';
//       }
//     }
//   };

//   React.useEffect(() => {
//     if (!isResetData) return;
//     const editorInstance = editorInstanceRef.current;
//     try {
//       editorInstance?.setData('');
//     } catch {
//       //
//     }
//   }, [isResetData]);

//   return (
//     <FormControl fullWidth error={Boolean(error)} variant="outlined">
//       <InputLabel
//         disabled={disabled}
//         shrink
//         required={required}
//         sx={{
//           display: 'flex',
//           backgroundColor: palette.background.paper,
//           paddingLeft: '8px',
//           paddingRight: `9px`,
//           transform: `translate(10px, -9px) scale(0.75)`,
//           '& .MuiFormLabel-asterisk': {
//             color: 'red',
//           },
//         }}
//       >
//         <StackLabel>
//           <IconElement icon={iconLabel} sx={{ fontSize: STYLE.TEXT_FIELD.FONT_SIZE_LABEL }} />
//           {label}
//         </StackLabel>
//       </InputLabel>
//       {uploadVideo && (
//         <Box sx={{ mb: 1, mt: PADDING_GAP_ITEM }}>
//           <Input
//             type="file"
//             inputProps={{ accept: '.mp4,.avi,.mov,.mkv,.webm' }}
//             onChange={handleVideoUpload}
//             sx={{ display: 'none' }}
//             id={`video-upload-${name}`}
//             disabled={disabled}
//           />
//           <Button
//             variant="outlined"
//             size="small"
//             startIcon={<IconElement icon="videocam" />}
//             onClick={() => document.getElementById(`video-upload-${name}`)?.click()}
//             disabled={disabled}
//           >
//             Tải video lên (mp4, mov, webm, mkv)
//           </Button>
//         </Box>
//       )}
//       <Stack
//         sx={{
//           flex: 1,
//           '--ck-font-size-base': '12.5px',
//           '--ck-color-base-foreground': 'red',
//           '--ck-color-base-background': palette.background.default,
//           '--ck-color-base-border': palette.divider,
//           '--ck-color-base-action': 'red',
//           '--ck-color-base-focus': 'red',
//           '--ck-color-base-text': palette.text.primary,
//           '--ck-color-base-active': 'red',
//           '--ck-color-base-active-focus': 'red',
//           '--ck-color-base-error': palette.error.main,
//           '--ck-color-focus-border-coordinates': '0, 0%, 50%',
//           '--ck-color-focus-border': 'hsl(var(--ck-color-focus-border-coordinates))',
//           '--ck-color-focus-outer-shadow': 'transparent',
//           '--ck-color-focus-disabled-shadow': 'red',
//           '--ck-color-focus-error-shadow': 'red',
//           '--ck-color-text': 'var(--ck-color-base-text)',
//           '--ck-color-shadow-drop': 'red',
//           '--ck-color-shadow-drop-active': 'red',
//           '--ck-color-shadow-inner': 'rgba(0, 0, 0, .1)',
//           '--ck-color-button-default-background': 'transparent',
//           '--ck-color-button-default-hover-background': palette.action.hover,
//           '--ck-color-button-default-active-background': palette.primary.dark,
//           '--ck-color-button-default-disabled-background': 'transparent',
//           '--ck-color-button-on-background': palette.primary.main,
//           '--ck-color-button-on-hover-background': palette.primary.main,
//           '--ck-color-button-on-active-background': 'red',
//           '--ck-color-button-on-disabled-background': 'red',
//           '--ck-color-button-on-color': palette.text.primary,
//           '--ck-color-button-action-background': 'var(--ck-color-base-action)',
//           '--ck-color-button-action-hover-background': '#4d9d30',
//           '--ck-color-button-action-active-background': '#4d9d30',
//           '--ck-color-button-action-disabled-background': '#7ec365',
//           '--ck-color-button-action-text': 'var(--ck-color-base-background)',
//           '--ck-color-button-save': '#008a00',
//           '--ck-color-button-cancel': palette.text.primary,
//           '--ck-color-switch-button-off-background': 'red',
//           '--ck-color-switch-button-off-hover-background': 'red',
//           '--ck-color-switch-button-on-background': 'var(--ck-color-button-action-background)',
//           '--ck-color-switch-button-on-hover-background': '#4d9d30',
//           '--ck-color-switch-button-inner-background': 'var(--ck-color-base-background)',
//           '--ck-color-switch-button-inner-shadow': 'red',
//           '--ck-color-dropdown-panel-background': 'var(--ck-color-base-background)',
//           '--ck-color-dropdown-panel-border': 'var(--ck-color-base-border)',
//           '--ck-color-input-background': 'var(--ck-color-base-background)',
//           '--ck-color-input-border': 'var(--ck-color-base-border)',
//           '--ck-color-input-error-border': 'var(--ck-color-base-error)',
//           '--ck-color-input-text': 'var(--ck-color-base-text)',
//           '--ck-color-input-disabled-background': 'red',
//           '--ck-color-input-disabled-border': 'var(--ck-color-base-border)',
//           '--ck-color-input-disabled-text': 'red',
//           '--ck-color-list-background': 'var(--ck-color-base-background)',
//           '--ck-color-list-button-hover-background': 'var(--ck-color-button-default-hover-background)',
//           '--ck-color-list-button-on-background': palette.action.hover,
//           '--ck-color-list-button-on-background-focus': palette.action.hover,
//           '--ck-color-list-button-on-text': palette.text.primary,
//           '--ck-color-panel-background': 'var(--ck-color-base-background)',
//           '--ck-color-panel-border': 'var(--ck-color-base-border)',
//           '--ck-color-toolbar-background': 'var(--ck-color-base-background)',
//           '--ck-color-toolbar-border': 'var(--ck-color-base-border)',
//           '--ck-color-tooltip-background': 'var(--ck-color-base-text)',
//           '--ck-color-tooltip-text': 'var(--ck-color-base-background)',
//           '--ck-color-engine-placeholder-text': palette.text.primary,
//           '--ck-color-upload-bar-background': 'red',
//           '--ck-color-link-default': 'red',
//           '--ck-color-link-selected-background': 'red',
//           '--ck-color-link-fake-selection': 'red',
//           '--ck-color-highlight-background': 'red',
//           '--ck-disabled-opacity': '.5',
//           '--ck-focus-outer-shadow-geometry': '0 0 0 3px',
//           '--ck-focus-outer-shadow': 'var(--ck-focus-outer-shadow-geometry) var(--ck-color-focus-outer-shadow)',
//           '--ck-focus-disabled-outer-shadow':
//             'var(--ck-focus-outer-shadow-geometry) var(--ck-color-focus-disabled-shadow)',
//           '--ck-focus-error-outer-shadow': 'var(--ck-focus-outer-shadow-geometry) var(--ck-color-focus-error-shadow)',
//           '--ck-focus-ring': '1px solid var(--ck-color-focus-border)',
//           '--ck-line-height-base': '1.84615',
//           '--ck-font-face': 'Helvetica, Arial, Tahoma, Verdana, Sans-Serif',
//           '--ck-font-size-tiny': '0.7em',
//           '--ck-font-size-small': '0.75em',
//           '--ck-font-size-normal': '1em',
//           '--ck-font-size-big': '1.4em',
//           '--ck-font-size-large': '1.8em',
//           '--ck-ui-component-min-height': '2.3em',

//           '& .ck.ck-toolbar': {
//             borderTopRightRadius: `${STYLE.BORDER_RADIUS_ELEMENT} !important`,
//             borderTopLeftRadius: `${STYLE.BORDER_RADIUS_ELEMENT} !important`,
//             borderColor: `${error ? palette.error.main : palette.divider} !important`,
//           },
//           '& .ck.ck-content': {
//             borderBottomRightRadius: `${STYLE.BORDER_RADIUS_ELEMENT} !important`,
//             borderBottomLeftRadius: `${STYLE.BORDER_RADIUS_ELEMENT} !important`,
//             borderColor: `${error ? palette.error.main : palette.divider} !important`,
//             // '& figure.image, & figure': {
//             //   maxWidth: '100% !important',
//             //   margin: '0 auto !important',
//             // },
//             // '& figure.image img': {
//             //   maxWidth: '100% !important',
//             //   display: 'block !important',
//             // },
//             '& img': {
//               width: '100%',
//             },
//             '& .ck-widget': {
//               width: '100% !important',
//             },
//             // Style cho video thumbnail trong editor
//             '& figure.image img[data-is-video="true"]': {
//               backgroundColor: '#000',
//               minHeight: '200px',
//               objectFit: 'cover',
//               position: 'relative',

//               '&::before': {
//                 content: '"▶"',
//                 position: 'absolute',
//                 top: '50%',
//                 left: '50%',
//                 transform: 'translate(-50%, -50%)',
//                 fontSize: '60px',
//                 color: 'white',
//                 textShadow: '0 2px 8px rgba(0,0,0,0.5)',
//                 zIndex: 1,
//               },

//               '&::after': {
//                 content: '"📹 VIDEO"',
//                 position: 'absolute',
//                 top: '8px',
//                 left: '8px',
//                 background: 'rgba(0,0,0,0.8)',
//                 color: 'white',
//                 padding: '6px 12px',
//                 borderRadius: '4px',
//                 fontSize: '11px',
//                 fontWeight: 'bold',
//                 zIndex: 2,
//               },
//             },
//           },
//         }}
//       >
//         {loading && (
//           <Box
//             sx={{
//               position: 'absolute',
//               top: '50%',
//               left: '50%',
//               transform: 'translate(-50%, -50%)',
//               zIndex: 10,
//               pointerEvents: 'none',
//             }}
//           >
//             <LoadingComponent />
//           </Box>
//         )}
       
//       </Stack>
//       {(error || helperText) && <FormHelperText error={Boolean(error)}>{error || helperText}</FormHelperText>}
//     </FormControl>
//   );
// };
