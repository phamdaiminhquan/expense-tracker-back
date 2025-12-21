import { createAsyncThunk } from '@reduxjs/toolkit';
import { authApi, userApi } from '../../apis';
import { LogoutDto, RefreshTokenDto, SubscribeTopicDto, VerifyDeviceDto } from '../../apis/auth/auth.interface';
import { deleteToken } from 'firebase/messaging';
import { messaging } from '../../common/config/firebase.config';

export const resetInitialStateAccount = createAsyncThunk('RESET_INITIAL_STATE_ACCOUNT', async () => {
  return await deleteToken(messaging);
});

export const verifyDevice = createAsyncThunk('VERIFY_DEVICE', async (params: VerifyDeviceDto, { rejectWithValue }) => {
  try {
    return await authApi.verifyDevice(params);
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const logout = createAsyncThunk('LOGOUT', async (params: LogoutDto, { rejectWithValue }) => {
  try {
    return await Promise.all([authApi.logout(params), deleteToken(messaging)]);
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const refreshToken = createAsyncThunk('REFRESH_TOKEN', async (params: RefreshTokenDto, { rejectWithValue }) => {
  try {
    return await authApi.refreshToken(params);
  } catch (error) {
    return rejectWithValue(error);
  }
});

// FCM
export const subscribeTopic = createAsyncThunk(
  'SUBSCRIBE_TOPIC',
  async (params: SubscribeTopicDto, { rejectWithValue }) => {
    try {
      await authApi.subscribeTopic(params);
      return { fcmToken: params.fcmToken };
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const changeNotificationCount = createAsyncThunk('CHANGE_NOTIFICATION_COUNT', (notificationCount: number) => {
  return notificationCount;
});

export const changeSidebarCount = createAsyncThunk(
  'CHANGE_SIDEBAR_COUNT',
  (params: { sidebarPath: string; count: number }) => {
    return params;
  },
);

export const getAccount = createAsyncThunk('GET_ACCOUNT', async (id: string, { rejectWithValue }) => {
  try {
    return await userApi.getUser(id);
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const updatePositionOrgUnit = createAsyncThunk('UPDATE_POSITION_ORG_UNIT', (userUnitPositionId: string) => {
  return userUnitPositionId;
});
