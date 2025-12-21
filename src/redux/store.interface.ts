import { GlobalAccountState } from './account/account.interface';
import { GlobalSystemState } from './system/system.interface';

export interface GlobalReduxState {
  account: GlobalAccountState;
  system: GlobalSystemState;
}
