export interface FileFromApi {
  url: string;
  name: string;
  status?: string;
}

// Unified interface for all file types
export interface FileItem extends Partial<File> {
  url?: string;
  preview?: string;
  name: string;
  status?: string;
}

export type FileWithPreviewOrUrl = FileWithPreview | FileFromApi | FileItem | string | undefined;

export interface FileWithPreview extends File {
  preview: string;
}

export interface AttachmentDto {
  url: string;
  name: string;
}
