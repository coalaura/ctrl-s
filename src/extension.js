import { registerSaveTracker } from "./save-tracker.js";
import { registerSaveCommands } from "./save.js";
import { registerStatusbarItem } from "./status.js";

let activated = false;

/**
 * @param {vscode.ExtensionContext} context
 */
export function activate(context) {
	if (activated) return;

	activated = true;

	registerStatusbarItem(context);

	registerSaveTracker(context);
	registerSaveCommands(context);
}

export function deactivate() { }
