import { createSlice } from '@reduxjs/toolkit';
import { ACTION_ACCOUNT } from '..';
import { GlobalAccountState } from './account.interface';
import { objectUtils } from '../../common/utils';

export const initialStateAccount: GlobalAccountState = {
  isLogin: false,
  user: null,
  accessToken: '',
  refreshToken: '',
  fcmToken: '',
  notificationCount: 0,
  userUnitPositionId: '',
  deviceId: '',

  // E-catalogue
  sidebarCountObj: {},
};

export const reducerAccount = createSlice({
  // Name Slice
  name: 'account',
  initialState: initialStateAccount,
  reducers: {},

  extraReducers: (builder) => {
    // Reset initial sate account
    builder.addCase(ACTION_ACCOUNT.resetInitialStateAccount.fulfilled, (state) => {
      Object.assign(state, objectUtils.omitProperties(initialStateAccount, ['deviceId']));
    });

    // Device
    builder.addCase(ACTION_ACCOUNT.verifyDevice.fulfilled, (state, action) => {
      const objectAssign = {
        ...action.payload,
        isLogin: true,
        userUnitPositionId: action.payload.user.userOrgUnitPositions[0].id,
      };
      Object.assign(state, objectAssign);
    });
    builder.addCase(ACTION_ACCOUNT.verifyDevice.rejected, (state) => {
      Object.assign(state, initialStateAccount);
    });

    // Logout
    builder.addCase(ACTION_ACCOUNT.logout.fulfilled, (state) => {
      Object.assign(state, initialStateAccount);
    });
    builder.addCase(ACTION_ACCOUNT.logout.rejected, (state) => {
      Object.assign(state, initialStateAccount);
    });

    // Refresh token
    builder.addCase(ACTION_ACCOUNT.refreshToken.fulfilled, (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    });
    builder.addCase(ACTION_ACCOUNT.refreshToken.rejected, (state) => {
      Object.assign(state, initialStateAccount);
    });

    // Subscribe Topic
    builder.addCase(ACTION_ACCOUNT.subscribeTopic.fulfilled, (state, action) => {
      state.fcmToken = action.payload.fcmToken;
    });
    builder.addCase(ACTION_ACCOUNT.subscribeTopic.rejected, (state) => {
      state.fcmToken = initialStateAccount.fcmToken;
    });

    // Change notification Count
    builder.addCase(ACTION_ACCOUNT.changeNotificationCount.fulfilled, (state, action) => {
      state.notificationCount = action.payload;
    });

    // Get account
    builder.addCase(ACTION_ACCOUNT.getAccount.fulfilled, (state, action) => {
      state.user = action.payload;
      state.userUnitPositionId = action.payload.userOrgUnitPositions[0].id;
    });
    builder.addCase(ACTION_ACCOUNT.getAccount.rejected, (state) => {
      Object.assign(state, initialStateAccount);
    });

    // Update position
    builder.addCase(ACTION_ACCOUNT.updatePositionOrgUnit.fulfilled, (state, action) => {
      state.userUnitPositionId = action.payload;
    });

    // Change sidebar count
    builder.addCase(ACTION_ACCOUNT.changeSidebarCount.fulfilled, (state, action) => {
      state.sidebarCountObj = {
        ...state.sidebarCountObj,
        [action.payload.sidebarPath]: (state.sidebarCountObj[action.payload.sidebarPath] || 0) + action.payload.count,
      };
    });
  },
}).reducer;
