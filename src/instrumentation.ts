export async function register() {
    if (process.env.NEXT_RUNTIME !== "nodejs") {
        return;
    }

    const { initializeCron, stopCron } =
        await import("./jobs/subscriptions-billing");

    initializeCron();

    const gracefulShutdown = () => {
        stopCron();
        if (typeof process.exit === "function") {
            process.exit(0);
        }
    };

    if (typeof process.on === "function") {
        process.on("SIGTERM", gracefulShutdown);
        process.on("SIGINT", gracefulShutdown);
    }
}