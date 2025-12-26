import { createSlice } from '@reduxjs/toolkit';
import { Mode } from '../../common/enums/mode.enum';
import { ACTION_SYSTEM } from '..';
import { GlobalSystemState } from './system.interface';

export const initialStateSystem: GlobalSystemState = {
  mode: Mode.LIGHT,
};

export const slice = createSlice({
  // Name Slice
  name: 'system',
  initialState: initialStateSystem,
  reducers: {},

  extraReducers: (builder) => {
    // ChangeMode
    builder.addCase(ACTION_SYSTEM.changeMode.fulfilled, (state, action) => {
      state.mode = action.payload;
    });
  },
});

export const reducerSystem = slice.reducer;
