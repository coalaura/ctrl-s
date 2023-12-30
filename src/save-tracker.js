import vscode from 'vscode';

let extensionContext;

/**
 * @param {vscode.ExtensionContext} context
 */
export function registerSaveTracker(context) {
    vscode.workspace.onDidSaveTextDocument(document => {
        const languageId = document.languageId;

        trackSave(languageId);
	}, null, context.subscriptions);

    extensionContext = context;
}

function getHourlyTimestamp() {
    const date = new Date(),
        hour = date.getHours();

    date.setHours(hour, 0, 0, 0)

    return Math.floor(date.getTime() / 1000);
}

/**
 * @param {string} languageId
 */
function trackSave(languageId) {
    const saves = getSaves(),
        timestamp = getHourlyTimestamp();

    if (!saves[timestamp]) {
        saves[timestamp] = {};
    }

    if (!saves[timestamp][languageId]) {
        saves[timestamp][languageId] = 0;
    }

    saves[timestamp][languageId]++;

    extensionContext.globalState.update('saves', saves);
}

export function getSaves() {
    return extensionContext.globalState.get('saves', {});
}

export function clearSaves() {
    extensionContext.globalState.update('saves', {});
}