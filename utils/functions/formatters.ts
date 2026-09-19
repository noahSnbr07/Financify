const formatBytes = (bytes: number): string => {
    const units = ["B", "KB", "MB", "GB", "TB"];
    let value = bytes;
    let unitIndex = 0;

    while (value >= 1024 && unitIndex < units.length - 1) {
        value /= 1024;
        unitIndex += 1;
    }

    const decimals = value >= 10 ? 1 : 2;
    return `${value.toFixed(decimals)} ${units[unitIndex]}`;
};

const formatUptime = (seconds: number): string => {
    const safeSeconds = Math.max(0, Math.floor(seconds));
    const days = Math.floor(safeSeconds / 86400);
    const hours = Math.floor((safeSeconds % 86400) / 3600);
    const minutes = Math.floor((safeSeconds % 3600) / 60);
    const remainingSeconds = safeSeconds % 60;

    return [days, hours, minutes, remainingSeconds]
        .map((value) => value.toString().padStart(2, "0"))
        .join(":");
};

const formatCpu = (microseconds: number): string => {
    const seconds = microseconds / 1_000_000;

    if (seconds >= 60) return `${(seconds / 60).toFixed(2)} min`;
    if (seconds >= 1) return `${seconds.toFixed(2)} s`;
    return `${(seconds * 1000).toFixed(0)} ms`;
};

export {
    formatBytes,
    formatCpu,
    formatUptime,
}