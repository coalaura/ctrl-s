const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'
];

const days = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

export function formatDate(date) {
    const month = months[date.getMonth()],
        dayName = days[date.getDay()],
        day = date.getDate(),
        daySuffix = day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th',
        year = date.getFullYear();

    return `${dayName} the ${day}${daySuffix} of ${month} ${year}`;
}

export function formatHour(hour) {
    hour = parseInt(hour);

    if (hour === 0) {
        return 'midnight';
    } else if (hour === 12) {
        return 'noon';
    } else if (hour > 12) {
        return `${hour - 12} PM`;
    }

    return `${hour} AM`;
}

export function formatNTimes(times) {
    if (times === 0) {
        return 'never';
    } else if (times === 1) {
        return 'once';
    }

    return `${formatNumber(times)} times`;
}

function roundFixed(number, decimals = 1) {
    return (Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals)).toFixed(decimals).replace(/\.?0+$/, '');
}

export function formatNumber(number, short = false) {
    if (short) {
        // Should be enough for most cases, lmao
        if (number >= 1e17) {
            return `${roundFixed(number / 1e17, 1)} quintillion`;
        } else if (number >= 1e14) {
            return `${roundFixed(number / 1e14, 1)} quadrillion`;
        } else if (number >= 1e11) {
            return `${roundFixed(number / 1e11, 1)} trillion`;
        } else if (number >= 1e9) {
            return `${roundFixed(number / 1e9, 1)} billion`;
        } else if (number >= 1e6) {
            return `${roundFixed(number / 1e6, 1)} million`;
        } else if (number >= 1e3) {
            return `${roundFixed(number / 1e3, 1)} thousand`;
        }

        // Otherwise, default formatting
    }

    const formatter = new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 0
    });

    return formatter.format(number);
}