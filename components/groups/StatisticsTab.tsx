import SpendingsPieChart, {
    SpendingData,
} from "components/charts/SpendingsPieChart";
import { Button } from "components/common/Button/Button";
import { useRouter } from "next/router";
import { FunctionComponent, useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import { DateValueType } from "react-tailwindcss-datepicker/dist/types";
import useSWR from "swr";
import { getCurrentMonth, getPreviousMonth } from "utils/date";
import { formatDateTime } from "utils/formatters";
import { Icon } from "@iconify/react";
import MoneyFlowChart from "components/charts/MoneyFlowChart";
import { Label } from "components/common/Label/Label";

type StatisticsTabProps = {};

export const StatisticsTab: FunctionComponent<StatisticsTabProps> = ({}) => {
    const [filtersOpen, setFiltersOpen] = useState(false);

    const router = useRouter();
    const { groupId } = router.query;
    const currentMonth = getCurrentMonth();

    const previousMonth = getPreviousMonth();

    const [statsDate, setStatsDate] = useState<DateValueType>(currentMonth);
    const [compareDate, setCompareDate] =
        useState<DateValueType>(previousMonth);

    const { data: categoriesData } = useSWR<SpendingData>(
        `/api/expenses/statistics/category?groupId=${groupId}&statsStartDate=${statsDate?.startDate}&statsEndDate=${statsDate?.endDate}&compareStartDate=${compareDate?.startDate}&compareEndDate=${compareDate?.endDate}`
    );

    const { data: moneyData } = useSWR(
        `/api/expenses/statistics/moneyflow?groupId=${groupId}&statsStartDate=${statsDate?.startDate}&statsEndDate=${statsDate?.endDate}&compareStartDate=${compareDate?.startDate}&compareEndDate=${compareDate?.endDate}`
    );

    return (
        <div>
            <Button onClick={() => setFiltersOpen(true)}>Change dates</Button>
            {filtersOpen && (
                <div className="fixed top-5 left-5 right-5 z-10 rounded bg-black/95 p-4 shadow-lg">
                    <div className="flex flex-col gap-6 py-4">
                        <div>
                            <Label>Base date range</Label>
                            <Datepicker
                                value={statsDate}
                                onChange={(value) => setStatsDate(value)}
                            />
                        </div>
                        <div>
                            <Label>Compare date range</Label>
                            <Datepicker
                                value={compareDate}
                                startFrom={compareDate?.startDate as Date}
                                onChange={(value) => setCompareDate(value)}
                            />
                        </div>
                    </div>
                    <Button onClick={() => setFiltersOpen(false)}>Close</Button>
                </div>
            )}
            <div className="pt-2 text-neutral-400">
                <span className="leading-2">
                    Statistics from{" "}
                    <span className="inline whitespace-nowrap rounded bg-black py-1 px-2 font-medium text-neutral-300">
                        <Icon
                            icon="mdi:calendar"
                            className="inline"
                            inline={true}
                        />{" "}
                        {formatDateTime(statsDate?.startDate as Date)} -{" "}
                        {formatDateTime(statsDate?.endDate as Date)}
                    </span>{" "}
                    compared to{" "}
                    <span className="inline whitespace-nowrap rounded bg-black py-1 px-2 font-medium text-neutral-300">
                        <Icon
                            icon="mdi:calendar"
                            className="inline"
                            inline={true}
                        />{" "}
                        {formatDateTime(compareDate?.startDate as Date)} -{" "}
                        {formatDateTime(compareDate?.endDate as Date)}
                    </span>
                </span>
            </div>
            {categoriesData && (
                <div className="mt-4 rounded-md bg-black/80 p-2">
                    <h1 className="text-xl text-white">
                        Spendings by categories
                    </h1>
                    <SpendingsPieChart data={categoriesData} />
                </div>
            )}
            {moneyData && (
                <div className="mt-4 rounded-md bg-black/80 p-2">
                    <h1 className="mb-4 text-xl text-white">
                        Income and spending
                    </h1>
                    <MoneyFlowChart data={moneyData} />
                </div>
            )}
        </div>
    );
};
