import { PageOptionsDto } from "@/common/interfaces/api.interface";
import { Statistic } from "./statistic.entities";
import { Range } from "./statistic.enum";

export interface StatisticDto {
  fundId: string;
  totalSpend: number | null;
  totalEarn: number | null;
  net: number | null;
}

export interface getCategoriesStatisticDto {
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  amount: number;
  percentage: number;
  transactionCount: number;
}

export interface getListStatisticsDto extends PageOptionsDto<Statistic> {
  range: Range;
}
