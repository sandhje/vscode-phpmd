import {
    CompletionItem, CompletionItemKind, createConnection, Diagnostic,
    DiagnosticSeverity, IConnection, InitializeParams, InitializeResult,
    IPCMessageReader, IPCMessageWriter, TextDocument, TextDocumentIdentifier,
    TextDocumentPositionParams, TextDocuments, TextDocumentSyncKind,
} from "vscode-languageserver";
import PipelineFactory from "../factory/PipelineFactory";
import IPhpmdSettingsModel from "../model/IPhpmdSettingsModel";
import PipelinePayloadModel from "../model/PipelinePayloadModel";

class PhpmdController {
    constructor(
        private connection: IConnection,
        private settings: IPhpmdSettingsModel
    ) { }

    public Validate(document: TextDocument | TextDocumentIdentifier) {
        let payload = new PipelinePayloadModel(document.uri);

        this.getPipeline().run(payload).then((output) => {
            let diagnostics = output.diagnostics;

            // Send the computed diagnostics to VSCode.
            this.connection.sendDiagnostics({uri: output.uri, diagnostics});
        });
    }

    protected getPipeline() {
        return new PipelineFactory(this.settings).create();
    }
}

export default PhpmdController;
