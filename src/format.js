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

export function formatNumber(number, short = false) {
    if (short) {
        // Should be enough for most cases, lmao
        if (number >= 10e17) {
            return `${(Math.round(number / 10e16) / 10).toFixed(1)} quintillion`;
        } else if (number >= 10e14) {
            return `${Math.round(number / 10e13) / 10} quadrillion`;
        } else if (number >= 10e11) {
            return `${Math.round(number / 10e10) / 10} trillion`;
        } else if (number >= 10e9) {
            return `${Math.round(number / 10e8) / 10} billion`;
        } else if (number >= 10e6) {
            return `${Math.round(number / 10e5) / 10} million`;
        } else if (number >= 10e3) {
            return `${Math.round(number / 10e2) / 10} thousand`;
        }

        // Otherwise, default formatting
    }

    const formatter = new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 0
    });

    return formatter.format(number);
}