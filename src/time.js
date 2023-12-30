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