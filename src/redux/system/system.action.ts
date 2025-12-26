import { createAsyncThunk } from '@reduxjs/toolkit';
import { Mode } from '../../common/enums/mode.enum';

export const changeMode = createAsyncThunk('CHANGE_MODE', (currentMode: Mode) => {
  return currentMode === Mode.LIGHT ? Mode.DARK : Mode.LIGHT;
});
