'use client';

interface TotalBalanceProps {
    balance: number;
}

export default function TotalBalance({ balance }: TotalBalanceProps) {

    return (
        <div className="flex-1 bg-stack grid place-content-center min-h-20 rounded-lg">
            <b className="text-5xl"> ${balance.toFixed(2)} </b>
        </div>
    );
}