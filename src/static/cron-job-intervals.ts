
const CRON_JOB_INTERVALS = {
    EVERY: {
        MINUTE: "* * * * *",
        HOUR: "0 * * * *",
        SIX_HOURS: "0 0,6,12,18 * * *",
        TWELVE_HOURS: "0 12,0 * * *",
        MIDNIGHT: "0 0 * * *",
    }
}

export default CRON_JOB_INTERVALS;