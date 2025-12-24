import { axiosRequest } from "@/common/config"
import { StatisticDto } from "./statistic.interface"

export async function getStatisticsByFundId(fundId: string | null): Promise<StatisticDto | null> {
  const res = await axiosRequest.get<StatisticDto>(`/funds/${fundId}/statistics`)
  return res.data || null
}