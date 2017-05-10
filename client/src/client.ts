'use strict';

import * as path from 'path';
import { workspace, ExtensionContext } from 'vscode';
import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind } from 'vscode-languageclient';

export function activate(context: ExtensionContext) {

	let serverModule = context.asAbsolutePath(path.join('server', 'init.js'));

	// Server debug options
	let debugOptions = { execArgv: ["--nolazy", "--debug=6009"] };

    // Server options
	let serverOptions: ServerOptions = {
		run : { module: serverModule, transport: TransportKind.ipc },
		debug: { module: serverModule, transport: TransportKind.ipc, options: debugOptions }
	}
	
	// Client options
	let clientOptions: LanguageClientOptions = {
		documentSelector: ['php'],
		synchronize: {
			configurationSection: 'phpmd'
		}
	}
	
	// Create and start the client
	let client = new LanguageClient('vscode-phpmd', 'PHP Mess Detector', serverOptions, clientOptions)
	let disposable = client.start();

	console.log("PHP Mess Detector server started");
	
	// Push the disposable to the context's subscriptions so that the 
	// client can be deactivated on extension deactivation
	context.subscriptions.push(disposable);
}
