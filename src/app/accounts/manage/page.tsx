import { database } from "@/src/configuration";
import { getAuth } from "@/src/server";
import { redirect } from "next/navigation";
import { AccountsList } from "../components";
import { Account } from "@/src/generated/prisma/client";

export type AccountsListAccountTypeParsed = Account & { total: number; };

async function page() {

    const auth = await getAuth();
    if (!auth) redirect("/authentication");

    const accounts = await database.account.findMany({
        where: {
            user: {
                id: auth.id
            },
        },
        include: {
            transactions: {
                select: {
                    value: true,
                    received: true,
                }
            },
            transfersFrom: {
                select: {
                    value: true,
                    destinationAccountId: true,
                }
            },
            transfersTo: {
                select: {
                    value: true,
                    originAccountId: true,
                }
            }
        }
    });

    const parsed: AccountsListAccountTypeParsed[] = accounts.map(({ transactions, transfersFrom, transfersTo, ...account }) => {
        const transactionTotal = transactions.reduce((acc, curr) => (
            curr.received ? acc + Number(curr.value) : acc - Number(curr.value)
        ), 0);

        const incomingTransfers = transfersTo.reduce((acc, curr) => acc + Number(curr.value), 0);
        const outgoingTransfers = transfersFrom.reduce((acc, curr) => acc + Number(curr.value), 0);

        return {
            ...account,
            total: Math.floor(transactionTotal + incomingTransfers - outgoingTransfers),
        };
    })

    return (
        <>
            <AccountsList accounts={parsed} />
        </>
    );
}

export default page;