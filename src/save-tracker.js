import vscode from "vscode";

import { scheduleStatusbarUpdate } from "./status.js";

let extensionContext,
	savesCache = {},
	totalSavesCache = 0,
	isDirty = false;

const MILESTONE_MESSAGES = {
	100: "100 saves! You're off to a great start.",
	500: "500 saves. Your code is looking safer already.",
	1000: "1,000 saves! A true Ctrl+S enthusiast.",
	5000: "5,000 saves! Your 'S' key is putting in the work.",
	10000: "10,000 saves! You are a master of the save shortcut.",
	50000: "50,000 saves! Is your Ctrl key okay?",
	100000: "100,000 saves! Absolutely legendary data retention.",
	500000: "Half a million saves! Your dedication is unmatched.",
	1000000: "1,000,000 saves! You've officially beaten the extension.",
};

const MILESTONES = Object.keys(MILESTONE_MESSAGES)
	.map(Number)
	.sort((a, b) => a - b);

/**
 * @param {vscode.ExtensionContext} context
 */
export function registerSaveTracker(context) {
	extensionContext = context;

	savesCache = extensionContext.globalState.get("saves", {});
	totalSavesCache = calculateTotalSaves(savesCache);

	// Flush saves to disk every 30 seconds if there are changes
	const flushInterval = setInterval(flushSaves, 30000);

	context.subscriptions.push({
		dispose: () => clearInterval(flushInterval),
	});

	vscode.workspace.onDidSaveTextDocument(
		document => {
			if (document.uri.scheme !== "file") {
				return;
			}

			const languageId = document.languageId;

			if (document.fileName.endsWith("settings.json")) {
				return;
			}

			trackSave(languageId);
		},
		null,
		context.subscriptions
	);

	vscode.workspace.onDidChangeConfiguration(
		event => {
			const affected = event.affectsConfiguration("ctrl-s.fullNumber");

			if (affected) {
				scheduleStatusbarUpdate(true);
			}
		},
		null,
		context.subscriptions
	);

	scheduleStatusbarUpdate();
}

export function clearSaves() {
	savesCache = {};
	totalSavesCache = 0;
	isDirty = true;
	flushSaves();

	scheduleStatusbarUpdate();
}

export function getSavesFromState() {
	return savesCache;
}

export function getTotalSaves() {
	return totalSavesCache;
}

export function flushSaves() {
	if (isDirty) {
		extensionContext.globalState.update("saves", savesCache);

		isDirty = false;
	}
}

function calculateTotalSaves(saves) {
	let total = 0;

	for (const timestamp in saves) {
		for (const languageId in saves[timestamp]) {
			total += saves[timestamp][languageId];
		}
	}

	return total;
}

function trackSave(languageId) {
	const timestamp = getHourlyTimestamp();

	if (!savesCache[timestamp]) {
		savesCache[timestamp] = {};
	}

	if (!savesCache[timestamp][languageId]) {
		savesCache[timestamp][languageId] = 0;
	}

	savesCache[timestamp][languageId]++;

	const previousTotal = totalSavesCache;

	totalSavesCache++;

	isDirty = true;

	checkMilestones(previousTotal, totalSavesCache);

	scheduleStatusbarUpdate();
}

function checkMilestones(oldTotal, newTotal) {
	for (const milestone of MILESTONES) {
		if (oldTotal < milestone && newTotal >= milestone) {
			vscode.window.showInformationMessage(MILESTONE_MESSAGES[milestone]);

			break;
		}
	}
}

function getHourlyTimestamp() {
	const date = new Date(),
		hour = date.getHours();

	date.setHours(hour, 0, 0, 0);

	return Math.floor(date.getTime() / 1000);
}
