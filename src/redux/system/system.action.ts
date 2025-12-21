import { createAsyncThunk } from '@reduxjs/toolkit';
import { Mode } from '../../common/enums/mode.enum';
import { auditLogApi, GetListAuditLogDto } from '../../apis';

export const changeMode = createAsyncThunk('CHANGE_MODE', (currentMode: Mode) => {
  return currentMode === Mode.LIGHT ? Mode.DARK : Mode.LIGHT;
});

export const getListAuditLogGlobal = createAsyncThunk(
  'GET_LIST_AUDIT_LOG',
  async (params: GetListAuditLogDto, { rejectWithValue }) => {
    try {
      return await auditLogApi.getListAuditLog(params as GetListAuditLogDto);
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
