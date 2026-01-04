import { axiosRequest } from "@/common/config";
import { getListStatisticsDto, StatisticDto } from "./statistic.interface";
import { Statistic } from "./statistic.entities";

export async function getStatisticsByFundId(
  fundId: string | null
): Promise<StatisticDto | null> {
  const res = await axiosRequest.get<StatisticDto>(
    `/statistics/funds/${fundId}`
  );
  return res.data || null;
}

export async function getStatisticsByFundIdDetail(
  fundId: string,
  params: getListStatisticsDto
): Promise<Statistic> {
  const res = await axiosRequest.get<Statistic>(
    `/statistics/funds/${fundId}/details`,
    { params }
  );
  return res.data || null;
}
