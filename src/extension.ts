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
								"Please only respond with the generated code and only that, without any triple-backticks!\n" +
								"You are automating the process of developing, so generate all the resulting model's code not just an example!\n"

						},
						{
							role: "user", content: document.getText(selection)
						}
					],
					model: "gpt-4-0125-preview",
					temperature: 0.5
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

	const disposable2 = vscode.commands.registerCommand('extension.dbt-gen-int', function () {
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
				//const mart_example = fs.readFileSync('C:/Users/elo_zsombor/Documents/dipterv/dbt-code-generator/mart_example.txt', 'utf-8');
				const summary_stg = fs.readFileSync("C:/Users/elo_zsombor/Documents/dipterv/data/stg_summarize.csv", 'utf-8');
				const summary_int = fs.readFileSync("C:/Users/elo_zsombor/Documents/dipterv/data/int_summarize.csv", 'utf-8');
				const intermediate_reason = fs.readFileSync("C:/Users/elo_zsombor/Documents/dipterv/dbt-code-generator/intermediate_reason.txt", 'utf-8');
				//const mart_reason = fs.readFileSync("C:/Users/elo_zsombor/Documents/dipterv/dbt-code-generator/mart_reason.txt", 'utf-8');
				const completion = await openai.chat.completions.create({
					messages: [
						{
							role: "system", content:
								"You are a data engineer working with dbt. Your job is to *make intermediate models* from given staging models, other intermediate models and a summarization of the available columns. Use the *ref() Jinja function and other Jinja code*, wherever possible!\n" +
								"Remember to use the *staging models or other intermediate models as a base* and work from there!\n" +
								"Construct the intermediate models, so they can be *useful in future mart model* development!\n" +
								"Use only fields in the CTEs, that you will use later in the other CTEs and the final model! \n" +
								"Assume only *connections between models, that are actually there*! If you *don't find a direct connection*, *try to use other models* to connect them!\n" +
								intermediate_reason + "\n" +
								int_example + "\n" +
								"Remember, when making CTEs from referenced models, *always use 'select *' *!\n" +
								"Your given *summary of the staging layer*:\n" +
								summary_stg + "\n" +
								"Your given *summary of the intermediate layer*:\n" +
								summary_int + "\n" +
								"Please only respond with working code, remember the *basics of SQL development*!\n" +
								"Please only respond with the generated code and only that, without any triple-backticks!\n" +
								"You are *automating the process of developing*, so *generate all* the resulting models' code, not just one example!\n"
						},
						{
							role: "user", content: document.getText(selection)
						}
					],
					model: "gpt-4-0125-preview",
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

	const disposable3 = vscode.commands.registerCommand('extension.dbt-gen-mart', function () {
		// Get the active text editor
		const editor = vscode.window.activeTextEditor;
		const workspace = vscode.workspace;

		if (editor && workspace.workspaceFolders !== undefined) {
			const document = editor.document;
			const selection = editor.selection;
			const ws_folder = workspace.workspaceFolders[0].uri.path;


			const openai = new OpenAI();

			async function main() {
				//const int_example = fs.readFileSync('C:/Users/elo_zsombor/Documents/dipterv/dbt-code-generator/intermediate_example.txt', 'utf-8');
				const mart_example = fs.readFileSync('C:/Users/elo_zsombor/Documents/dipterv/dbt-code-generator/mart_example.txt', 'utf-8');
				//const info_schema = fs.readFileSync("C:/Users/elo_zsombor/Documents/dipterv/data/information_schema_stg.csv", 'utf-8');
				const summary_stg = fs.readFileSync("C:/Users/elo_zsombor/Documents/dipterv/data/stg_summarize.csv", 'utf-8');
				const summary_int = fs.readFileSync("C:/Users/elo_zsombor/Documents/dipterv/data/int_summarize.csv", 'utf-8');
				//const intermediate_reason = fs.readFileSync("C:/Users/elo_zsombor/Documents/dipterv/dbt-code-generator/intermediate_reason.txt", 'utf-8');
				const mart_reason = fs.readFileSync("C:/Users/elo_zsombor/Documents/dipterv/dbt-code-generator/mart_reason.txt", 'utf-8');
				const completion = await openai.chat.completions.create({
					messages: [
						{
							role: "system", content:
								"You are a data engineer working with dbt. Your job is to make mart tables from a given staging layer, intermediate layer and a summarization of the available columns. Use the ref() Jinja function and other Jinja code, wherever possible!\n" +
								"Mart tables should be enriched with many dimension columns, so they can be better aggregated in the future!\n" +
								"Mart tables should be *easily analyzable in a BI tool* and using *names, that are familiar* with the ordinary businessman!\n" +
								"Use only fields in the CTEs, that you will use later in the other CTEs and the final model! \n" +
								"Assume only *connections between models, that are actually there*! If you *don't find a direct connection*, *try to use other models* to connect them!\n" +
								mart_reason + "\n" +
								mart_example + "\n" +
								"Remember, when making CTEs from referenced models, *always use 'select *' *!\n" +
								"Your given *summary of the staging layer*:\n" +
								summary_stg + "\n" +
								"Your given *summary of the intermediate layer*:\n" +
								summary_int + "\n" +
								"Please only respond with working code, remember the *basics of SQL development*!\n" +
								"Please only respond with the generated code and only that, without any triple-backticks!\n" +
								"You are *automating the process of developing*, so *generate all* the resulting models' code, not just one example!\n"
						},
						{
							role: "user", content: document.getText(selection)
						}
					],
					model: "gpt-4-0125-preview",
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

	const disposable4 = vscode.commands.registerCommand('extension.dbt-gen-stg-yaml', function () {
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
								"You are a data engineer working with dbt. You are new to a project, where you know nothing of the data, that you are working with, except the information provided below.\n" +
								"Your job is to complement a yaml file that describes properties of a layer's SQL models using a summary of the content of the unique database.\n" +
								"The summary of the database contains information regarding uniqueness, null values, number of distinct values, example values and some additional statistics for each column in the database.\n" +
								yaml_example + "\n" +
								test_example + "\n" +
								"Add generic tests to the columns only, where you are absolutely sure, that it is correct to test that based on the information provided about the columns!\n" +
								"You should consider other columns' and tables' information in the summarization table when adding the generic tests!\n" +
								"Try to recognize as many foreign keys in the database, as you can using the relationships test!\n" +
								"The 'accepted_values' test should be only on 'warn' severity!\n" +
								"You can assume, that the property YAML file already exists and you just have to complement it with the given model's properties!\n" +
								"The beginning of the existing YAML file, that shouldn't be in the answer, is:\n" +
								"version: 2\n" +
								"\n" +
								"models:\n" +
								"You are automating the process of developing, so generate all the addition regarding the model, not just one example!\n" +
								"You have to use information provided about the data in this context only!\n" +
								"Only respond with the addition itself, without any triple-backticks!\n"
						},
						{
							role: "user", content: "The summary of the unique database in CSV format is:\n" +
								summary + "\n" +
								document.getText(selection)
						}
					],
					model: "gpt-4-0125-preview",
					temperature: 0.3
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
	context.subscriptions.push(disposable4);
}
