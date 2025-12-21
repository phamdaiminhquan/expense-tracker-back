import { User } from '../../apis/user/user.entities';
export interface GlobalAccountState {
  isLogin: boolean;
  user: User | null;
  accessToken: string;
  refreshToken: string;
  fcmToken: string;
  notificationCount: number;
  userUnitPositionId: string;
  deviceId: string;

  // E-catalogue
  sidebarCountObj: any; // Record<string, Record<string, number>>
}
