"use strict";

import {
    createConnection, IConnection, InitializeResult, IPCMessageReader, IPCMessageWriter,
    TextDocument, TextDocumentIdentifier, TextDocuments
} from "vscode-languageserver";
import PhpmdController from "./controller/PhpmdController";
import PhpmdControllerFactory from "./factory/PhpmdControllerFactory";
import IPhpmdSettingsModel from "./model/IPhpmdSettingsModel";

let connection: IConnection = createConnection(new IPCMessageReader(process), new IPCMessageWriter(process));

let documents: TextDocuments = new TextDocuments();
documents.listen(connection);

let workspaceRoot: string;
connection.onInitialize((params): InitializeResult => {
    workspaceRoot = params.rootPath;
    return {
        capabilities: {
            textDocumentSync: documents.syncKind,
        }
    };
});

let controller: PhpmdController;
let defaults: IPhpmdSettingsModel = {
    configurationFile: "",
    executable: "C:/Users/sbouw/AppData/Roaming/Composer/vendor/bin/phpmd.bat",
    rules: "cleancode,codesize,controversial,design,unusedcode,naming"
};

// The settings have changed. Is send on server activation
// as well.
connection.onDidChangeConfiguration((change) => {
    let settings: IPhpmdSettingsModel = Object.assign<IPhpmdSettingsModel, any>(defaults, change.settings.phpmd);

    controller = new PhpmdControllerFactory(connection, settings).create();

    // Revalidate any open text documents
    documents.all().forEach((document: TextDocument) => {
        controller.Validate(document);
    });
});

// A php document was opened
connection.onDidOpenTextDocument((parameters) => {
    let document: TextDocumentIdentifier = parameters.textDocument;

    controller.Validate(document);
});

// A php document was saved
connection.onDidSaveTextDocument((parameters) => {
    let document: TextDocumentIdentifier = parameters.textDocument;

    controller.Validate(document);
});

// Listen on the connection
connection.listen();
