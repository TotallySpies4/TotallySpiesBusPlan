function formatDelay(delay) {
    const minutes = Math.floor(delay / 60);
    const seconds = delay % 60;
    return `${minutes} Minuten und ${seconds} Sekunden`;
}

function convertUnixTimeToReadable(time) {
    const date = new Date(time * 1000);
    return date.toLocaleString();
}