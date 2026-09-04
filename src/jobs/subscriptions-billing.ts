import cron, { ScheduledTask } from 'node-cron';
import { createTransactionFromSubscriptionBilling } from '../server';
import { CRON_JOB_INTERVALS } from '../static';

const cronJobs: ScheduledTask[] = [];

export function initializeCron() {
    const billingTask = cron.schedule(CRON_JOB_INTERVALS.EVERY.SIX_HOURS, async () => {
        try {
            await createTransactionFromSubscriptionBilling();
        } catch (error) {
            console.error('[CRON]: Billing error:', error);
        }
    });

    cronJobs.push(billingTask);
}

export function stopCron() {
    cronJobs.forEach(job => job.stop());
}