'use strict';

import * as vscode from 'vscode';

import OpenAI from "openai";

import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('extension.dbt-gen-stg', function () {
		// Get the active text editor
		const editor = vscode.window.activeTextEditor;
		const workspace = vscode.workspace;

		if (editor && workspace.workspaceFolders !== undefined) {
			const document = editor.document;
			const selection = editor.selection;
			const ws_folder = workspace.workspaceFolders[0].uri.path;
			const sources = ws_folder + '/dipterv_v0/models/sources.yml'


			const openai = new OpenAI();

			async function main() {
				const source_example = fs.readFileSync('C:/Users/elo_zsombor/Documents/dipterv/dbt-code-generator/source_example.txt', 'utf-8');
				const test_example = fs.readFileSync('C:/Users/elo_zsombor/Documents/dipterv/dbt-code-generator/test_reason_and_examples.txt', 'utf-8');
				const sources_yaml = fs.readFileSync(sources.substring(1));
				const info_schema = fs.readFileSync("C:/Users/elo_zsombor/Documents/dipterv/data/information_schema.csv", 'utf-8');
				const completion = await openai.chat.completions.create({
					messages: [{
						role: "system", content:
							"You are a data engineer working with dbt. Your job is to make a staging model using a given sources.yml file and information_schema.\n" +
							"A staging model consists of a SQL model and a YAML model file that describes the properties of the SQL model.\n" +
							"In the YAML file describe all the columns that were generated!\n" +
							"Use unique and not_null tests for the primary key fields!\n" +
							"Use the source() Jinja function, wherever possible!\n" +
							source_example + "\n" +
							"Tests that can be used and some additional description to tests:\n" +
							test_example + "\n" +
							"Your given sources.yml file:\n" +
							sources_yaml + "\n" +
							"Your given information_schema:\n" +
							info_schema + "\n" +
							"Please only respond with the generated code and the YAML file and only those without any additional message!\n" +
							"Don't put a semicolon at the end of the select statement!\n" +
							"You are automating the process of developing, so generate all the resulting model's code and all the yaml file not just an example!\n" +
							document.getText(selection)

					}],
					model: "gpt-4-1106-preview",
				});

				return completion!.choices[0]!.message['content'];
			};

			// Get the word within the selection
			main().then((result) => {
				editor.edit(editBuilder => {
					editBuilder.replace(selection, document.getText(selection) + "\n" + result);
				});
			});
		}
	});

	const disposable2 = vscode.commands.registerCommand('extension.dbt-gen-insight', function () {
		// Get the active text editor
		const editor = vscode.window.activeTextEditor;
		const workspace = vscode.workspace;

		if (editor && workspace.workspaceFolders !== undefined) {
			const document = editor.document;
			const selection = editor.selection;
			const ws_folder = workspace.workspaceFolders[0].uri.path;


			const openai = new OpenAI();

			async function main() {
				const int_example = fs.readFileSync('C:/Users/elo_zsombor/Documents/dipterv/dbt-code-generator/intermediate_example.txt', 'utf-8');
				const mart_example = fs.readFileSync('C:/Users/elo_zsombor/Documents/dipterv/dbt-code-generator/mart_example.txt', 'utf-8');
				const info_schema = fs.readFileSync("C:/Users/elo_zsombor/Documents/dipterv/data/information_schema_stg.csv", 'utf-8');
				const intermediate_reason = fs.readFileSync("C:/Users/elo_zsombor/Documents/dipterv/dbt-code-generator/intermediate_reason.txt", 'utf-8');
				const mart_reason = fs.readFileSync("C:/Users/elo_zsombor/Documents/dipterv/dbt-code-generator/mart_reason.txt", 'utf-8');
				const completion = await openai.chat.completions.create({
					messages: [{
						role: "system", content:
							"You are a data engineer working with dbt. Your job is to make mart tables from a given staging layer. Use the ref() Jinja function and other Jinja code, wherever possible!\n" +
							"Generate the code for intermediate tables as well, whenever it is useful!\n" +
							"If the mart table would be only constructed from one intermediate table by copy, don't make the intermediate table, instead make only the mart model!\n" +
							"Construct the intermediate models, so they can be useful in future mart model development!\n" +
							"If you have to use more table, than it is written in your prompt, use them and give an explanation, why you use them!\n" +
							"Only make sensible models, don't assume direct connections between tables, if you didn't find a direct connection already!\n" +
							"Mart tables should be enriched with many dimension columns, so they can be better aggregated in the future!\n" +
							intermediate_reason + "\n" +
							int_example + "\n" +
							mart_reason + "\n" +
							mart_example + "\n" +
							"Your given information_schema:\n" +
							info_schema + "\n" +
							"Please only respond with the generated code and only that!\n" +
							"You are automating the process of developing, so generate all the resulting models' code, not just one example!\n" +
							document.getText(selection)
					}],
					model: "gpt-4-1106-preview",
				});

				return completion!.choices[0]!.message['content'];
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
	context.subscriptions.push(disposable2);
}
