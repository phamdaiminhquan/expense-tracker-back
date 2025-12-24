import { HttpStatusCode } from 'axios';

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  createdById?: string;
}

export interface Error {
  message: string;
  statusCode: HttpStatusCode | number;
}

export interface PageOptionsDto<T> {
  orderType?: any;
  orderBy?: keyof T;
  page: number;
  take: number;
  search?: string;
  isRelations?: boolean;
  isDeleted?: boolean;
}

export interface DeleteOptional {
  soft: boolean | string;
}

export interface ResList<T> {
  total: number;
  data: T[];
}
