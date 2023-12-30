import vscode from 'vscode';

import { getSavesFromState, clearSaves } from './save-tracker.js';
import { formatDate, formatHour, formatNTimes } from './format.js';

/**
 * @param {vscode.ExtensionContext} context
 */
export function registerSaveCommands(context) {
    vscode.commands.registerCommand('ctrl-s.showStatistics', () => {
        const statistics = buildStatisticsString();

        vscode.workspace.openTextDocument({
            language: 'text',
            content: statistics
        }).then(document => {
            vscode.window.showTextDocument(document);
        });
    }, null, context.subscriptions);

    vscode.commands.registerCommand('ctrl-s.resetStatistics', () => {
        vscode.window.showInformationMessage('Are you sure you want to reset your statistics?', 'Yes', 'No').then(answer => {
            if (answer === 'Yes') {
                clearSaves();
            }
        });
    }, null, context.subscriptions);
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
        return 'You have not saved any files yet.';
    }

    const earliestSave = new Date(Math.min(...Object.keys(saves).map(timestamp => timestamp * 1000))),
        averageSavesPerDay = Math.round(totalSaves / Object.keys(days).length),
        mostCommonHour = Object.keys(hours).reduce((a, b) => hours[a] > hours[b] ? a : b),
        mostCommonLanguage = Object.keys(languages).reduce((a, b) => languages[a] > languages[b] ? a : b);

    return `You have saved ${formatNTimes(totalSaves)} since ${formatDate(earliestSave)}, averaging about ${formatNTimes(averageSavesPerDay)} a day. You most commonly save ${mostCommonLanguage} files at ${formatHour(mostCommonHour)}.`;
}