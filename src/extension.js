import { registerSaveTracker } from "./save-tracker.js";
import { registerSaveCommands } from "./save.js";

let activated = false;

/**
 * @param {vscode.ExtensionContext} context
 */
export function activate(context) {
	if (activated) return;

	activated = true;

	registerSaveTracker(context);
	registerSaveCommands(context);
}

export function deactivate() { }
