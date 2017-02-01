import {
	IPCMessageReader, IPCMessageWriter,
	createConnection, IConnection, TextDocumentSyncKind,
	TextDocuments, TextDocument, Diagnostic, DiagnosticSeverity,
	InitializeParams, InitializeResult, TextDocumentPositionParams,
	CompletionItem, CompletionItemKind, TextDocumentIdentifier
} from 'vscode-languageserver';
import Uri from 'vscode-uri';
import PhpmdService from '../service/PhpmdService';
import * as Xml2Js from 'xml2js';

class PhpmdServerController
{
    constructor(
        private connection: IConnection,
        private service: PhpmdService
    ) { }

    public Validate(document: TextDocument | TextDocumentIdentifier)
    {
        let uri: string = document.uri;
        let path: string = Uri.parse(uri).fsPath;

        let process: Promise<string> = this.service.ExecuteProcess(path);

        process.then((value: string) => {
            let parser = new Xml2Js.Parser();
            
            parser.parseString(value, (error, result) => {
                // TODO: Move result.pmd.file[0].violation to getViolation service method
                let diagnostics = this.service.getDiagnosticts(uri, result.pmd.file[0].violation);

                // Send the computed diagnostics to VSCode.
                this.connection.sendDiagnostics({ uri: uri, diagnostics });
            });
        });
    }
}

export default PhpmdServerController;