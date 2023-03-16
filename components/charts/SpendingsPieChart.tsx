import React from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

export type SpendingData = {
    baseCategories: {
        _sum: {
            amount: number;
        };
        categoryId: string;
    }[];
    compareCategories: {
        _sum: {
            amount: number;
        };
        categoryId: string;
    }[];
};

type SpendingsPieChartProps = {
    data: SpendingData;
};

const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#FF2222",
    "#8A2BE2",
];

const SpendingsPieChart: React.FC<SpendingsPieChartProps> = ({ data }) => {
    if (!data.baseCategories || !data.compareCategories) return null;

    const baseSummary = data.baseCategories.reduce(
        (acc, item) => acc + item._sum.amount,
        0
    );

    const basePieChartData = data.baseCategories.map((item) => {
        return {
            name: item.categoryId,
            value: Math.round(item._sum.amount * 100) / 100,
        };
    });

    const compareSummary = data.compareCategories.reduce(
        (acc, item) => acc + item._sum.amount,
        0
    );

    const mergedData = data.baseCategories.map((baseItem) => {
        const compareItem = data.compareCategories.find(
            (item) => item.categoryId === baseItem.categoryId
        );
        return {
            name: baseItem.categoryId,
            baseValue: Math.round(baseItem._sum.amount * 100) / 100,
            compareValue: compareItem
                ? Math.round(compareItem._sum.amount * 100) / 100
                : null,
        };
    });

    return (
        <div className="flex items-center">
            <ResponsiveContainer width="50%" height={300}>
                <PieChart width={400} height={400}>
                    <Pie
                        data={basePieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.baseCategories.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                            />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-4">
                {mergedData.map((item, index) => (
                    <div key={index}>
                        <div className="flex items-center gap-4 text-white">
                            <div
                                className="h-4 w-4"
                                style={{ backgroundColor: COLORS[index] }}
                            />
                            <div>{item.name}</div>
                            <div className="ml-auto">{item.baseValue} PLN</div>
                        </div>
                        <div>
                            <div className="flex items-center gap-4 text-sm text-neutral-400">
                                <div className="ml-auto">
                                    Previously {item.compareValue || 0} PLN
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                <div>
                    <div className="flex items-center gap-4 text-white">
                        <div className="h-4 w-4" />
                        <div>Summary</div>
                        <div className="ml-auto">{baseSummary} PLN</div>
                    </div>
                    <div>
                        <div className="flex items-center gap-4 text-sm text-neutral-400">
                            <div className="ml-auto">
                                Previously {compareSummary} PLN
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SpendingsPieChart;
