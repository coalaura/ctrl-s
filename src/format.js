const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
	days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function formatDate(date) {
	const month = months[date.getMonth()],
		dayName = days[date.getDay()],
		day = date.getDate(),
		daySuffix = day === 1 ? "st" : day === 2 ? "nd" : day === 3 ? "rd" : "th",
		year = date.getFullYear();

	return `${dayName} the ${day}${daySuffix} of ${month} ${year}`;
}

export function formatHour(hour) {
	hour = parseInt(hour, 10);

	if (hour === 0) {
		return "midnight";
	}

	if (hour === 12) {
		return "noon";
	}

	if (hour > 12) {
		return `${hour - 12} PM`;
	}

	return `${hour} AM`;
}

export function formatNTimes(times) {
	if (times === 0) {
		return "never";
	}

	if (times === 1) {
		return "once";
	}

	return `${formatNumber(times)} times`;
}

function roundFixed(number, decimals = 1) {
	return (Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals)).toFixed(decimals).replace(/\.?0+$/, "");
}

export function formatNumber(number, short = false) {
	if (short) {
		// Should be enough for most cases, lmao
		if (number >= 1e18) {
			return `${roundFixed(number / 1e18, 1)} quintillion`;
		}

		if (number >= 1e15) {
			return `${roundFixed(number / 1e15, 1)} quadrillion`;
		}

		if (number >= 1e12) {
			return `${roundFixed(number / 1e12, 1)} trillion`;
		}

		if (number >= 1e9) {
			return `${roundFixed(number / 1e9, 1)} billion`;
		}

		if (number >= 1e6) {
			return `${roundFixed(number / 1e6, 1)} million`;
		}

		if (number >= 1e3) {
			return `${roundFixed(number / 1e3, 1)} thousand`;
		}

		// Otherwise, default formatting
	}

	const formatter = new Intl.NumberFormat("en-US", {
		maximumFractionDigits: 0,
	});

	return formatter.format(number);
}
