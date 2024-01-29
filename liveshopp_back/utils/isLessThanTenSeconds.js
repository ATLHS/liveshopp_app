module.exports = {
    isLessThanTenSeconds: (timer) => {
        // Split the timer into minutes and seconds
        const [minutes, seconds] = timer.split(':').map(Number);
        // Convert the total time to seconds
        const totalTimeInSeconds = minutes * 60 + seconds;
        // Compare with 5 seconds
        return totalTimeInSeconds < 10;
    },
};
