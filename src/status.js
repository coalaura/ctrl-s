import vscode from 'vscode';

import { getSavesFromState } from './save-tracker.js';
import { formatNumber } from './format.js';

let statusBarItem, timeout, lastUpdate = 0;

export function registerStatusbarItem(context) {
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 200);

    statusBarItem.command = 'ctrl-s.showStatistics';
    statusBarItem.tooltip = 'Show CTRL+S statistics';

    context.subscriptions.push(statusBarItem);
}

export function scheduleStatusbarUpdate() {
    clearTimeout(timeout);

    if (Date.now() - lastUpdate >= 1000) {
        updateStatusbarItemCount();
    } else {
        timeout = setTimeout(updateStatusbarItemCount, 1000);
    }
}

function updateStatusbarItemCount() {
    lastUpdate = Date.now();

    const count = calculateTotalSaves();

    if (count === 0) {
        statusBarItem.text = '$(save) No saves';
    } else {
        statusBarItem.text = `$(save) ${formatNumber(count, true)} save${count === 1 ? '' : 's'}`;
    }

    statusBarItem.show();
}

function calculateTotalSaves() {
    const saves = getSavesFromState();

    return Object.values(saves).reduce((total, saves) => {
        return total + Object.values(saves).reduce((total, saves) => {
            return total + saves;
        }, 0);
    }, 0);
}