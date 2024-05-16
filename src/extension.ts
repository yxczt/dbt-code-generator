'use strict';

import * as vscode from 'vscode';

import OpenAI from "openai";

import * as fs from 'fs';
import path from 'path';

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('extension.dbt-gen-stg', function () {
		// Get the active text editor
		const editor = vscode.window.activeTextEditor;
		const workspace = vscode.workspace;

		if (editor && workspace.workspaceFolders !== undefined) {
			const document = editor.document;
			const selection = editor.selection;
			const ws_folder = workspace.workspaceFolders[0].uri.path;
			const sources = ws_folder + '/models/sources.yml'
			const src_info_schema_route = ws_folder + '/dbt_code_generator/staging/information_schema.csv'


			const openai = new OpenAI();

			async function main() {
				const source_example = fs.readFileSync(path.resolve(__dirname, '../source_example.txt'));
				const sources_yaml = fs.readFileSync(sources.substring(1));
				const info_schema = fs.readFileSync(src_info_schema_route.substring(1));
				const completion = await openai.chat.completions.create({
					messages: [
						{
							role: "system", content:
								"You are a data engineer working with dbt. Your job is to *make a staging model* using a given sources.yml file and information_schema.\n" +
								"Use the source() Jinja function, wherever possible!\n" +
								source_example + "\n" +
								"Your given *sources.yml file*:\n" +
								sources_yaml + "\n" +
								"Your given *information_schema*:\n" +
								info_schema + "\n" +
								"Please only respond with working code, remember the *basics of SQL development*!\n" +
								"Don't put a semicolon at the end of the select statement!\n" +
								"Please *only* respond with the *generated code* and only that, *avoid code block markdown*!\n" +
								"You are *automating the process of developing*, so *generate all* the resulting models' code, not just one example!\n"

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
			const stg_summary_route = ws_folder + '/dbt_code_generator/staging/stg_summarize.csv'
			const int_summary_route = ws_folder + '/dbt_code_generator/intermediate/int_summarize.csv'


			const openai = new OpenAI();

			async function main() {
				const int_example = fs.readFileSync(path.resolve(__dirname, '../intermediate_example.txt'), 'utf-8');
				//const mart_example = fs.readFileSync('C:/Users/elo_zsombor/Documents/dipterv/dbt-code-generator/mart_example.txt', 'utf-8');
				const summary_stg = fs.readFileSync(stg_summary_route.substring(1));
				const summary_int = fs.readFileSync(int_summary_route.substring(1));
				const intermediate_reason = fs.readFileSync(path.resolve(__dirname, '../intermediate_reason.txt'), 'utf-8');
				//const mart_reason = fs.readFileSync("C:/Users/elo_zsombor/Documents/dipterv/dbt-code-generator/mart_reason.txt", 'utf-8');
				const completion = await openai.chat.completions.create({
					messages: [
						{
							role: "system", content:
								"You are a data engineer working with dbt. Your job is to *make an intermediate model* from given staging models, other intermediate models and statistics of the available columns. Use the *ref() Jinja function and other Jinja code*, wherever possible!\n" +
								"Remember to use the *staging models or other intermediate models as a base* and work from there!\n" +
								"Construct the intermediate models, so they can be *useful in future mart model* development!\n" +
								"Use only fields in the CTEs, that you will use later in the other CTEs and the final model! \n" +
								"Assume only *connections between models, that are actually there*! If you *don't find a direct connection*, *try to use other models* to connect them!\n" +
								intermediate_reason + "\n" +
								int_example + "\n" +
								"Remember, when making CTEs from referenced models, *always use 'select *' *!\n" +
								"Your given *statistics of the staging layer*:\n" +
								summary_stg + "\n" +
								"Your given *statistics of the intermediate layer*:\n" +
								summary_int + "\n" +
								"Please only respond with working code, remember the *basics of SQL development*!\n" +
								"Don't put a semicolon at the end of the select statement!\n" +
								"Please *only* respond with the *generated code* and only that, *avoid code block markdown*!\n" +
								"You are *automating the process of developing*, so *generate all* the resulting models' code, not just one example!\n"
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

	const disposable3 = vscode.commands.registerCommand('extension.dbt-gen-mart', function () {
		// Get the active text editor
		const editor = vscode.window.activeTextEditor;
		const workspace = vscode.workspace;

		if (editor && workspace.workspaceFolders !== undefined) {
			const document = editor.document;
			const selection = editor.selection;
			const ws_folder = workspace.workspaceFolders[0].uri.path;
			const stg_summary_route = ws_folder + '/dbt_code_generator/staging/stg_summarize.csv'
			const int_summary_route = ws_folder + '/dbt_code_generator/intermediate/int_summarize.csv'


			const openai = new OpenAI();

			async function main() {
				//const int_example = fs.readFileSync('C:/Users/elo_zsombor/Documents/dipterv/dbt-code-generator/intermediate_example.txt', 'utf-8');
				const mart_example = fs.readFileSync(path.resolve(__dirname, '../mart_example.txt'));
				//const info_schema = fs.readFileSync("C:/Users/elo_zsombor/Documents/dipterv/data/information_schema_stg.csv", 'utf-8');
				const summary_stg = fs.readFileSync(stg_summary_route.substring(1));
				const summary_int = fs.readFileSync(int_summary_route.substring(1));
				//const intermediate_reason = fs.readFileSync("C:/Users/elo_zsombor/Documents/dipterv/dbt-code-generator/intermediate_reason.txt", 'utf-8');
				const mart_reason = fs.readFileSync(path.resolve(__dirname, '../mart_reason.txt'));
				const completion = await openai.chat.completions.create({
					messages: [
						{
							role: "system", content:
								"You are a data engineer working with dbt. Your job is to *make a mart table* from a given staging layer, intermediate layer and a statistics of the available columns. Use the ref() Jinja function and other Jinja code, wherever possible!\n" +
								"Mart tables should be enriched with many dimension columns, so they can be better aggregated in the future!\n" +
								"Mart tables should be *easily analyzable in a BI tool* and using *names, that are familiar* with the ordinary businessman!\n" +
								"Use only fields in the CTEs, that you will use later in the other CTEs and the final model! \n" +
								"Assume only *connections between models, that are actually there*! If you *don't find a direct connection*, *try to use other models* to connect them!\n" +
								mart_reason + "\n" +
								mart_example + "\n" +
								"Remember, when making CTEs from referenced models, *always use 'select *' *!\n" +
								"Your given *statistics of the staging layer*:\n" +
								summary_stg + "\n" +
								"Your given *statistics of the intermediate layer*:\n" +
								summary_int + "\n" +
								"Please only respond with working code, remember the *basics of SQL development*!\n" +
								"Don't put a semicolon at the end of the select statement!\n" +
								"Please *only* respond with the *generated code* and only that, *avoid code block markdown*!\n" +
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

	const disposable4 = vscode.commands.registerCommand('extension.dbt-gen-yaml', function () {
		// Get the active text editor
		const editor = vscode.window.activeTextEditor;
		const workspace = vscode.workspace;

		if (editor && workspace.workspaceFolders !== undefined) {
			const document = editor.document;
			const selection = editor.selection;
			const ws_folder = workspace.workspaceFolders[0].uri.path;
			const stg_summary_route = ws_folder + '/dbt_code_generator/staging/stg_summarize.csv'
			const int_summary_route = ws_folder + '/dbt_code_generator/intermediate/int_summarize.csv'
			const mart_summary_route = ws_folder + '/dbt_code_generator/mart/mart_summarize.csv'
			const lineage_route = ws_folder + '/dbt_code_generator/yaml/lineage.csv'



			const openai = new OpenAI();

			async function main() {
				const summary_stg = fs.readFileSync(stg_summary_route.substring(1));
				const summary_int = fs.readFileSync(int_summary_route.substring(1));
				const summary_mart = fs.readFileSync(mart_summary_route.substring(1));
				const lineage = fs.readFileSync(lineage_route.substring(1));
				const yaml_example = fs.readFileSync(path.resolve(__dirname, '../description_yaml_example.txt'));
				const test_example = fs.readFileSync(path.resolve(__dirname, '../test_reason_and_examples.txt'));
				const stat_description = fs.readFileSync(path.resolve(__dirname, '../statistics_description.txt'));

				const completion = await openai.chat.completions.create({
					messages: [
						{
							role: "system", content:
								"You are a data engineer working with dbt. You are new to a project, where *you know nothing of the data*, that you are working with, *except the information provided below*.\n" +
								"Your job is to *complement a yaml file that describes properties* of SQL models.\n" +
								"You will be given *statistics of the content of the unique database on a column level* and *the lineage of the models*, both in CSV format, that you should use.\n" +
								stat_description + "\n" +
								yaml_example + "\n" +
								test_example + "\n" +
								"Add *generic tests* to the columns only, where you are *absolutely sure*, that it is *correct to test* that based on the *information provided* about the columns!\n" +
								"Try to recognize as many *foreign keys* in the database, as you can using the *relationships test*!\n" +
								"*Only* generate *relationships* test, if *in the lineage of the models* the *other model* is *not a child* of this model!\n" +
								"The *'accepted_values'* test should be *only* on 'warn' severity!\n" +
								"You can assume, that the property *YAML file already exists* and you just have to *complement it* with the given model's properties!\n" +
								"The first two rows of the existing YAML file, that shouldn't be in the answer, is:\n" +
								"version: 2\n" +
								"models:\n" +
								"\n" +
								"You are *automating the process of developing*, so *generate all* the addition regarding the model, not just one example!\n" +
								"You should *only* generate the rows for the columns that are *part of the given model*!\n" +
								"You have to use *information provided* about the data in *this context only*!\n" +
								"*Only* respond with the *addition itself*, *avoid code block markdown*!\n"
						},
						{
							role: "user", content: "*Statistics of the unique database* in CSV format is:\n" +
								summary_stg + "\n" +
								summary_int + "\n" +
								summary_mart + "\n" +
								"The *lineage* of the models, parent and child pairs: \n" +
								lineage + "\n" +
								"Your given *model* is the following:\n" +
								document.getText(selection)
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

	const disposable5 = vscode.commands.registerCommand('extension.dbt-gen-cust-data-test', function () {
		// Get the active text editor
		const editor = vscode.window.activeTextEditor;
		const workspace = vscode.workspace;

		if (editor && workspace.workspaceFolders !== undefined) {
			const document = editor.document;
			const selection = editor.selection;
			const ws_folder = workspace.workspaceFolders[0].uri.path;
			const stg_summary_route = ws_folder + '/dbt_code_generator/staging/stg_summarize.csv'
			const int_summary_route = ws_folder + '/dbt_code_generator/intermediate/int_summarize.csv'
			const mart_summary_route = ws_folder + '/dbt_code_generator/mart/mart_summarize.csv'
			const lineage_route = ws_folder + '/dbt_code_generator/yaml/lineage.csv'



			const openai = new OpenAI();

			async function main() {
				const summary_stg = fs.readFileSync(stg_summary_route.substring(1));
				const summary_int = fs.readFileSync(int_summary_route.substring(1));
				const summary_mart = fs.readFileSync(mart_summary_route.substring(1));
				const lineage = fs.readFileSync(lineage_route.substring(1));
				const stat_description = fs.readFileSync(path.resolve(__dirname, '../statistics_description.txt'));
				const custom_test_example = fs.readFileSync(path.resolve(__dirname, '../custom_test_reason_and_examples.txt'));

				const completion = await openai.chat.completions.create({
					messages: [
						{
							role: "system", content:
								"You are a data engineer working with dbt. You are new to a project, where *you know nothing of the data*, that you are working with, *except the information provided below*.\n" +
								"Your job is to *make custom data tests* for SQL models.\n" +
								"You will be given *statistics of the content of the unique database on a column level* and *the lineage of the models*, both in CSV format, that you should use.\n" +
								stat_description + "\n" +
								custom_test_example + "\n" +
								"The generated SQL code can *only* use *columns from the given models*! This information can be *found in the statistics table*!\n" +
								"Please, be *precise* when *referencing the columns' names* from the statistics!\n" +
								"You have to use *information provided* about the data in *this context only*!\n" +
								"*Only* respond with the *code* itself, *avoid code block markdown*!\n"
						},
						{
							role: "user", content: "*Statistics of the unique database* in CSV format is:\n" +
								summary_stg + "\n" +
								summary_int + "\n" +
								summary_mart + "\n" +
								"The *lineage* of the models, parent and child pairs in CSV format: \n" +
								lineage + "\n" +
								"Your given *task* is the following:\n" +
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
	context.subscriptions.push(disposable5);
}
