'use strict';

import * as vscode from 'vscode';

import OpenAI from "openai";

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('extension.dbt-gen', function () {
		// Get the active text editor
		const editor = vscode.window.activeTextEditor;

		if (editor) {
			const document = editor.document;
			const selection = editor.selection;



			const openai = new OpenAI();

			async function main() {
				const completion = await openai.chat.completions.create({
					messages: [{ role: "system", content: document.getText(selection) }],
					model: "gpt-3.5-turbo",
				});

				return completion.choices[0].message['content'] == null ? "" : completion.choices[0].message['content'];
			};

			// Get the word within the selection
			main().then((result) => {
				editor.edit(editBuilder => {
					editBuilder.replace(selection, document.getText(selection) + "\n" + result);
				});
			});
		}
	});

	context.subscriptions.push(disposable);
}
