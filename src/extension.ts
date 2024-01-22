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
				const sources_yaml = fs.readFileSync(sources.substring(1));
				const info_schema = fs.readFileSync("C:/Users/elo_zsombor/Documents/dipterv/data/information_schema.csv", 'utf-8');
				const completion = await openai.chat.completions.create({
					messages: [
						{
							role: "system", content:
								"You are a data engineer working with dbt. Your job is to make a staging model using a given sources.yml file and information_schema.\n" +
								"Use the source() Jinja function, wherever possible!\n" +
								source_example + "\n" +
								"Your given sources.yml file:\n" +
								sources_yaml + "\n" +
								"Your given information_schema:\n" +
								info_schema + "\n" +
								"Please only respond with the generated code and only that, without any additional message!\n" +
								"Don't put a semicolon at the end of the select statement!\n" +
								"Only respond with the code itself, without any triple-backticks!\n" +
								"You are automating the process of developing, so generate all the resulting model's code not just an example!\n"

						},
						{
							role: "user", content: document.getText(selection)
						}
					],
					model: "gpt-4-1106-preview",
					temperature: 0.8
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
					messages: [
						{
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
								"You are automating the process of developing, so generate all the resulting models' code, not just one example!\n"
						},
						{
							role: "user", content: document.getText(selection)
						}
					],
					model: "gpt-4-1106-preview",
					temperature: 0.8
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

	const disposable3 = vscode.commands.registerCommand('extension.dbt-gen-stg-yaml', function () {
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
				const summary = fs.readFileSync("C:/Users/elo_zsombor/Documents/dipterv/data/stg_summarize.csv", 'utf-8');
				const yaml_example = fs.readFileSync("C:/Users/elo_zsombor/Documents/dipterv/dbt-code-generator/description_yaml_example.txt", 'utf-8');
				const test_example = fs.readFileSync('C:/Users/elo_zsombor/Documents/dipterv/dbt-code-generator/test_reason_and_examples.txt', 'utf-8');

				const completion = await openai.chat.completions.create({
					messages: [
						{
							role: "system", content:
								"You are a data engineer working with dbt. Your job is to complement a yaml file that describes properties of a layer's SQL models using a summary of the content of the unique database.\n" +
								"You can assume, that the property YAML file already exists and you just have to complement it with the given model's properties!\n" +
								"The beginning of the existing YAML file, that shouldn't be in the answer, is:\n" +
								"version: 2\n" +
								"\n" +
								"models:\n" +
								"Add to columns generic tests wherever it makes sense according to the summarization of the column!\n" +
								test_example + "\n" +
								yaml_example + "\n" +
								"The summarization of the content of the unique database in CSV format is:\n" +
								summary + "\n" +
								"Only respond with the complimention itself, without any triple-backticks!\n" +
								"You are automating the process of developing, so generate all the complimention regarding the model, not just one example!\n"
						},
						{
							role: "user", content: document.getText(selection)
						}
					],
					model: "gpt-4-1106-preview",
					temperature: 0.8
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
	context.subscriptions.push(disposable3);
}
