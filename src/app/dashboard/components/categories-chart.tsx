'use client';

import { PieChart, ResponsiveContainer, } from "recharts";
import { Pie } from "recharts";

type ChartDataType = {
    color: string;
    label: string;
    value: number;
}

interface _props {
    categories: {
        volume: number | null;
        color: string;
        name: string;
        id: string;
        created: Date;
        updated: Date;
        userId: string;
    }[];
}

export default function CategoriesChart({ categories }: _props) {

    const transformedCategories: ChartDataType[] = categories.map(function (category) {
        return {
            color: `${category.color}`,
            fill: `${category.color}`,
            label: category.name,
            value: category.volume || 0,

        }
    });

    return (
        <div className="flex flex-col items-center h-full w-full min-h-64 min-w-0">
            <ResponsiveContainer minHeight={256}>
                <PieChart
                    margin={{ bottom: 24, left: 16, right: 16, top: 16, }}>
                    <Pie
                        data={transformedCategories}
                        innerRadius="75%"
                        outerRadius="100%"
                        cornerRadius="100%"
                        fill="rgba(127, 127, 127, .5)"
                        paddingAngle={5}
                        dataKey="value"
                    />
                </PieChart>
            </ResponsiveContainer>
            <CustomLegend categories={transformedCategories} />
        </div>
    );
}

interface CustomLegendProps {
    categories: ChartDataType[];
}

function CustomLegend({ categories }: CustomLegendProps) {

    return (
        <div className="grid grid-cols-2 xl:grid-cols-3 bg-stack gap-1 w-full rounded-md">
            {categories.map(function (category) {

                return (
                    <div
                        key={category.color}
                        className="flex justify-between p-2 items-center text-sm">
                        <div className="flex gap-2 items-center">
                            <div style={{ background: `${category.color}` }} className="size-4 rounded-sm"></div>
                            <p> {category.label} </p>
                        </div>
                        <b> {category.value.toFixed(2)} </b>
                    </div>
                );
            })}
        </div>
    );
}