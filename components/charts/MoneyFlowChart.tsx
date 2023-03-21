import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { amountFormatter } from "utils/formatters";

interface IncomeExpensePeriod {
    startDate: string;
    endDate: string;
    income: number;
    expense: number;
}

interface IncomeExpenseBarChartProps {
    data: IncomeExpensePeriod[];
}

const IncomeExpenseBarChart: React.FC<IncomeExpenseBarChartProps> = ({
    data,
}) => {
    const formattedData = data.map((item, index) => {
        return {
            period: index === 0 ? "Base" : "Compare",
            income: item.income,
            expense: item.expense,
        };
    });

    return (
        <div className="flex items-center">
            <ResponsiveContainer width="40%" height={300}>
                <BarChart
                    width={600}
                    height={300}
                    data={formattedData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="income" fill="#8884d8" />
                    <Bar dataKey="expense" fill="#82ca9d" />
                </BarChart>
            </ResponsiveContainer>
            <div className="text-white flex-col flex gap-6">
                {formattedData.map((item) => (
                    <div key={item.period} className="flex flex-col">
                        <span className="text-neutral-300">{item.period}</span>
                        <span>Income: {amountFormatter(item.income)} PLN</span>
                        <span>Expenses: {amountFormatter(item.expense)} PLN</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default IncomeExpenseBarChart;
