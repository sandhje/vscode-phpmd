import {
	IPCMessageReader, IPCMessageWriter,
	createConnection, IConnection, TextDocumentSyncKind,
	TextDocuments, TextDocument, Diagnostic, DiagnosticSeverity,
	InitializeParams, InitializeResult, TextDocumentPositionParams,
	CompletionItem, CompletionItemKind, TextDocumentIdentifier
} from 'vscode-languageserver';
import PipelineFactory from '../factory/PipelineFactory';
import PhpmdSettingsModel from '../model/PhpmdSettingsModel';
import PipelinePayloadModel from '../model/PipelinePayloadModel';

class PhpmdServerController
{
    constructor(
        private connection: IConnection,
        private settings: PhpmdSettingsModel
    ) { }

    public Validate(document: TextDocument | TextDocumentIdentifier)
    {
        let payload = new PipelinePayloadModel(document.uri);

        this.getPipeline().run(payload).then((output) => {
            let diagnostics = output.diagnostics;

            // Send the computed diagnostics to VSCode.
            this.connection.sendDiagnostics({uri: output.uri, diagnostics});
        });
    }

    protected getPipeline()
    {
        return new PipelineFactory(this.settings).create();
    }
}

export default PhpmdServerController;