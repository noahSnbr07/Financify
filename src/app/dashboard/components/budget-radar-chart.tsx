'use client';

import type { CategoryPercentage } from "@/src/server/get-dashboard-data";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from "recharts";

interface _props {
    categories: CategoryPercentage[];
}

export default function BudgetRadarChart({ categories }: _props) {

    const parsed = categories.map(category => {
        return {
            id: category.id,
            name: category.name,
            value: category.percentage,
            color: category.color,
        }
    });

    return (
        <div className="flex flex-col">
            <ResponsiveContainer
                minHeight={256}
                width={"100%"}
            >
                <RadarChart data={parsed}>
                    <PolarGrid opacity={.5} />
                    <PolarAngleAxis dataKey="name" fontSize={16} />
                    <Radar
                        dataKey={"value"}
                        stroke={"white"}
                        fill="white"
                        strokeWidth={2}
                        fillOpacity={0.25}
                    />
                </RadarChart>
            </ResponsiveContainer>
            <div className="grid gap-2 grid-cols-2 p-4">
                {categories.map((category) => (
                    <div
                        key={category.id}
                        className="flex gap-4 items-center">
                        <div
                            style={{ background: category.color }}
                            className="size-4 rounded-full"></div>
                        <div className="flex gap-1">
                            <p> {category.name}: </p>
                            <b> {category.percentage.toFixed(0)}% </b>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}