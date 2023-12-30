import vscode from 'vscode';

import { scheduleStatusbarUpdate } from './status.js';

let extensionContext;

/**
 * @param {vscode.ExtensionContext} context
 */
export function registerSaveTracker(context) {
    extensionContext = context;

    vscode.workspace.onDidSaveTextDocument(document => {
        const languageId = document.languageId;

        trackSave(languageId);
    }, null, context.subscriptions);

    scheduleStatusbarUpdate();
}

export function clearSaves() {
    extensionContext.globalState.update('saves', {});

    scheduleStatusbarUpdate();
}

export function getSavesFromState() {
    return extensionContext.globalState.get('saves', {});
}

function trackSave(languageId) {
    const saves = getSavesFromState(),
        timestamp = getHourlyTimestamp();

    if (!saves[timestamp]) {
        saves[timestamp] = {};
    }

    if (!saves[timestamp][languageId]) {
        saves[timestamp][languageId] = 0;
    }

    saves[timestamp][languageId]++;

    extensionContext.globalState.update('saves', saves);

    scheduleStatusbarUpdate();
}

function getHourlyTimestamp() {
    const date = new Date(),
        hour = date.getHours();

    date.setHours(hour, 0, 0, 0)

    return Math.floor(date.getTime() / 1000);
}