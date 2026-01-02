import { BaseEntity } from "../../common/interfaces/api.interface";
import { TransactionType } from "./statistic.enum";
import { getCategoriesStatisticDto } from "./statistic.interface";

export interface Statistic extends BaseEntity {
  fundId: string;
  totalAmount: number;
  currency: string;
  transactionType: TransactionType;
  categories: getCategoriesStatisticDto[];
}
