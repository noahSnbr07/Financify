import { systemLog } from "@/utils";
import { database } from "../configuration";
import { SubscriptionState, TransactionType } from "../generated/prisma/enums";
import getNextBillingDate from "./get-next-billing-date";
import { SystemLogGroup } from "@/utils/system-log";

interface BillingResult {
    processed: number;
    created: number;
    failed: number;
    errors: Array<{ subscriptionId: string; userId: string; error: string }>;
    usersProcessed: number;
}

async function createTransactionFromSubscriptionBilling(): Promise<BillingResult> {
    const result: BillingResult = {
        processed: 0,
        created: 0,
        failed: 0,
        errors: [],
        usersProcessed: 0,
    };

    try {
        // Get all users
        const users = await database.user.findMany();

        for (const user of users) {
            try {
                const subscriptions = await database.subscription.findMany({
                    where: {
                        userId: user.id,
                        state: SubscriptionState.active,
                        nextBillingDate: {
                            lte: new Date(),
                        },
                    },
                    include: {
                        account: true,
                        category: true,
                        user: true,
                    },
                });
                result.processed += subscriptions.length;

                for (const subscription of subscriptions) {
                    try {
                        await database.transaction.create({
                            data: {
                                value: subscription.value,
                                name: subscription.name,
                                received: false,
                                type: TransactionType.subscription,
                                userId: subscription.userId,
                                accountId: subscription.accountId,
                                categoryId: subscription.categoryId,
                                subscriptionId: subscription.id,
                            },
                        });

                        const nextBillingDate = await getNextBillingDate({
                            date: new Date(),
                            interval: subscription.interval,
                        });

                        await database.subscription.update({
                            where: { id: subscription.id },
                            data: {
                                lastBillingDate: new Date(),
                                nextBillingDate,
                            },
                        });

                        result.created++;
                    } catch (error) {
                        const errorMessage =
                            error instanceof Error ? error.message : String(error);
                        console.error(
                            `[CTFSB]: Failed to process subscription ${subscription.id}:`,
                            errorMessage
                        );
                        result.failed++;
                        result.errors.push({
                            subscriptionId: subscription.id,
                            userId: user.id,
                            error: errorMessage,
                        });
                    }
                }

                result.usersProcessed++;
            } catch (error) {
                const errorMessage =
                    error instanceof Error ? error.message : String(error);
                console.error(
                    `[CTFSB]: Error processing user ${user.id}:`,
                    errorMessage
                );
                result.errors.push({
                    subscriptionId: "N/A",
                    userId: user.id,
                    error: errorMessage,
                });
            }
        }
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : String(error);
        console.error("[CTFSB]: Fatal error in billing process:", errorMessage);
    }

    systemLog(
        `-----<[ ${new Date().toISOString()} ]>-----\n----------<[ BILLING CHECK ]>-----------\nUsers: ${result.usersProcessed}\nProcessed: ${result.processed}\nCreated: ${result.created}\nFailed: ${result.failed}\n`,
        SystemLogGroup.billing, true
    );

    return result;
}

export default createTransactionFromSubscriptionBilling;