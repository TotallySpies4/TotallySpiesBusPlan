function formatDelay(delay) {
    return Math.floor(delay / 60);
}

function convertUnixTimeToReadable(time) {
    const date = new Date(time * 1000);
    return date.toLocaleString();
}