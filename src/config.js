import vscode from 'vscode';

export function fullNumber() {
    return get('fullNumber');
}

function get(key) {
    const config = vscode.workspace.getConfiguration('ctrl-s');

    return config.get(key);
}