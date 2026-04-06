import vscode from "vscode";

import { formatDate, formatNumber } from "./format.js";
import { clearSaves, getSavesFromState } from "./save-tracker.js";

/**
 * @param {vscode.ExtensionContext} context
 */
export function registerSaveCommands(context) {
	const provider = new (class {
		constructor() {
			this.onDidChangeEmitter = new vscode.EventEmitter();
			this.onDidChange = this.onDidChangeEmitter.event;
		}

		provideTextDocumentContent() {
			return buildStatisticsString();
		}

		update(uri) {
			this.onDidChangeEmitter.fire(uri);
		}
	})();

	context.subscriptions.push(vscode.workspace.registerTextDocumentContentProvider("ctrl-s", provider));

	vscode.commands.registerCommand(
		"ctrl-s.showStatistics",
		() => {
			const uri = vscode.Uri.parse("ctrl-s:statistics.txt");

			provider.update(uri);

			vscode.workspace.openTextDocument(uri).then(document => {
				vscode.languages.setTextDocumentLanguage(document, "text");
				vscode.window.showTextDocument(document, { preview: true });
			});
		},
		null,
		context.subscriptions
	);

	vscode.commands.registerCommand(
		"ctrl-s.resetStatistics",
		() => {
			vscode.window.showInformationMessage("Are you sure you want to reset your statistics?", "Yes", "No").then(answer => {
				if (answer === "Yes") {
					clearSaves();
				}
			});
		},
		null,
		context.subscriptions
	);
}

function buildStatisticsString() {
	const saves = getSavesFromState();

	let totalSaves = 0,
		days = {},
		hours = {},
		languages = {};

	for (const timestamp in saves) {
		const date = new Date(timestamp * 1000),
			day = date.toLocaleDateString(),
			hour = date.getHours();

		if (!days[day]) {
			days[day] = 0;
		}

		if (!hours[hour]) {
			hours[hour] = 0;
		}

		for (const languageId in saves[timestamp]) {
			if (!languages[languageId]) {
				languages[languageId] = 0;
			}

			const count = saves[timestamp][languageId];

			days[day] += count;
			hours[hour] += count;
			languages[languageId] += count;

			totalSaves += count;
		}
	}

	if (totalSaves === 0) {
		return "You have not saved any files yet.\n";
	}

	const earliestSave = new Date(Math.min(...Object.keys(saves).map(timestamp => timestamp * 1000))),
		daysSinceStart = Math.max(1, Math.ceil((Date.now() - earliestSave.getTime()) / (1000 * 60 * 60 * 24))),
		averageSavesPerDay = Math.round(totalSaves / daysSinceStart);

	const getTop5 = obj =>
		Object.entries(obj)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 5);

	const topLanguages = getTop5(languages);

	let output = createHeader("CTRL + S Statistics");

	output += `Total Saves    : ${formatNumber(totalSaves)}\n`;
	output += `Daily Average  : ~${formatNumber(averageSavesPerDay)} saves/day\n`;
	output += `Tracking Since : ${formatDate(earliestSave)}\n\n`;

	output += createHeader("Top 5 Languages");
	output += `${buildBarChart(topLanguages.map(([lang, count]) => ({ label: lang, count: count })))}\n`;

	output += createHeader("Last 7 Days Activity");
	output += `${build7DayGraph(saves)}\n`;

	output += createHeader("24-Hour Activity (All Time)");
	output += `${build24HourGraph(hours)}\n`;

	return output;
}

function createHeader(title) {
	return `##\n# ${title}\n##\n\n`;
}

function buildBarChart(data) {
	if (data.length === 0) {
		return "  No data available.\n";
	}

	const maxCount = Math.max(...data.map(d => d.count), 1),
		maxBarLength = 40,
		maxLabelLength = Math.max(...data.map(d => d.label.length));

	let graph = "";

	data.forEach(d => {
		const barLength = Math.round((d.count / maxCount) * maxBarLength),
			bar = "#".repeat(barLength);

		graph += `${d.label.padStart(maxLabelLength)} | ${bar.padEnd(maxBarLength)} | ${formatNumber(d.count)}\n`;
	});

	return graph;
}

function build7DayGraph(saves) {
	const dailySaves = {};

	for (const timestamp in saves) {
		const date = new Date(timestamp * 1000),
			dayKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

		if (!dailySaves[dayKey]) {
			dailySaves[dayKey] = 0;
		}

		for (const languageId in saves[timestamp]) {
			dailySaves[dayKey] += saves[timestamp][languageId];
		}
	}

	const last7Days = [],
		dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

	for (let i = 6; i >= 0; i--) {
		const date = new Date();

		date.setDate(date.getDate() - i);

		const dayKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
			label = `${dayNames[date.getDay()]} ${date.getDate().toString().padStart(2, "0")}`;

		last7Days.push({
			label: label,
			count: dailySaves[dayKey] || 0,
		});
	}

	return buildBarChart(last7Days);
}

function build24HourGraph(hours) {
	const hourlyData = [];

	for (let i = 0; i < 24; i++) {
		let label = "";

		if (i === 0) {
			label = "12 AM";
		} else if (i === 12) {
			label = "12 PM";
		} else if (i > 12) {
			label = `${(i - 12).toString().padStart(2, "0")} PM`;
		} else {
			label = `${i.toString().padStart(2, "0")} AM`;
		}

		hourlyData.push({
			label: label,
			count: hours[i] || 0,
		});
	}

	return buildBarChart(hourlyData);
}
