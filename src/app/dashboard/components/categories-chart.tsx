'use client';

import { PieChart, ResponsiveContainer, } from "recharts";
import { Pie } from "recharts";
import type { ParsedCategory } from "@/src/server/get-dashboard-data";
import { Digits } from "@/src/global/components";

type ChartDataType = {
    index: number;
    color: string;
    label: string;
    value: number;
}

interface _props {
    categories: ParsedCategory[];
}

export default function CategoriesChart({ categories }: _props) {

    const transformedCategories: ChartDataType[] = categories.map(function (category, _index) {
        return {
            index: _index,
            color: `${category.color}`,
            fill: `${category.color}`,
            label: category.name,
            value: category.volume || 0,
        }
    });

    return (
        <div className="flex flex-col items-center gap-4 h-full w-full min-h-64 min-w-0">
            <ResponsiveContainer
                minHeight={256}
                width={"100%"}
            >
                <PieChart>
                    <Pie
                        data={transformedCategories}
                        innerRadius="75%"
                        strokeWidth={0}
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
                        key={category.index}
                        className="flex justify-between p-2 items-center text-sm">
                        <div className="flex gap-2 items-center">
                            <div style={{ background: `${category.color}` }} className="size-4 rounded-sm"></div>
                            <p> {category.label} </p>
                        </div>
                        <b> <Digits value={category.value.toFixed(2)} /> </b>
                    </div>
                );
            })}
        </div>
    );
}