import { database } from "../configuration";
import getAuth from "./get-auth";

export interface GetForecastProps {
    nextWeek: number;
    nextMonth: number;
    nextYear: number;
}

async function getForecast(): Promise<GetForecastProps> {

    const auth = await getAuth();
    if (!auth) return { nextMonth: 0, nextWeek: 0, nextYear: 0 };

    const transactions = await database.transaction.findMany({ where: { userId: auth.id }, orderBy: { created: "asc" } });

    //extract values
    const rawTransactionValues = transactions.map((transaction) =>
        transaction.received ? transaction.value.toNumber() : -transaction.value.toNumber());

    function holtLinear(values: number[], alpha: number, beta: number, steps: number): number {
        if (values.length < 2) return values[0] ?? 0;

        //calculate trend from difference
        let level = values[0];
        let trend = values[1] - values[0];

        // some math magic i do not understand
        for (let i = 1; i < values.length; i++) {
            const prevLevel = level;
            level = alpha * values[i] + (1 - alpha) * (level + trend);
            trend = beta * (level - prevLevel) + (1 - beta) * trend;
        }

        return Math.round(level + trend * steps);
    }

    //smoothing the curve
    const alpha = 0.25;
    const beta = 0.25;

    const results = {
        nextWeek: holtLinear(rawTransactionValues, alpha, beta, 7),
        nextMonth: holtLinear(rawTransactionValues, alpha, beta, 30),
        nextYear: holtLinear(rawTransactionValues, alpha, beta, 365),
    }

    return results;
}

export default getForecast;