import { AuditLog } from '../../apis';
import { Mode } from '../../common/enums/mode.enum';
import { ResList } from '../../common/interfaces/api.interface';

export interface GlobalSystemState {
  mode: Mode;
  auditLogs: ResList<AuditLog> | undefined;
  auditLogLoading: boolean;
}
