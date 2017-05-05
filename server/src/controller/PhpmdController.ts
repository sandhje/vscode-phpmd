import { Pipeline } from "@open-sourcerers/j-stillery";
import {
    CompletionItem, CompletionItemKind, createConnection, Diagnostic,
    DiagnosticSeverity, IConnection, InitializeParams, InitializeResult,
    IPCMessageReader, IPCMessageWriter, TextDocument, TextDocumentIdentifier,
    TextDocumentPositionParams, TextDocuments, TextDocumentSyncKind,
} from "vscode-languageserver";
import PipelineFactory from "../factory/PipelineFactory";
import PipelinePayloadFactory from "../factory/PipelinePayloadFactory";
import IPhpmdSettingsModel from "../model/IPhpmdSettingsModel";
import PipelinePayloadModel from "../model/PipelinePayloadModel";

class PhpmdController {
    private pipeline: Pipeline<PipelinePayloadModel>;
    private pipelinePayloadFactory: PipelinePayloadFactory;

    constructor(
        private connection: IConnection,
        private settings: IPhpmdSettingsModel
    ) { }

    public Validate(document: TextDocument | TextDocumentIdentifier) {
        // this.connection.console.log("PHP Mess Detector validation started.");
        let payload = this.getPipelinePayloadFactory().setUri(document.uri).create();

        this.getPipeline().run(payload).then((output) => {
            let diagnostics = output.diagnostics;

            // Send the computed diagnostics to VSCode.
            // this.connection.console.log("PHP Mess Detector validation completed. Sending diagnostics now.");
            this.connection.sendDiagnostics({uri: output.uri, diagnostics});
        });
    }

    public setPipeline(pipeline: Pipeline<PipelinePayloadModel>): void {
        this.pipeline = pipeline;
    }

    public setPipelinePayloadFactory(pipelinePayloadFactory: PipelinePayloadFactory): void {
        this.pipelinePayloadFactory = pipelinePayloadFactory;
    }

    protected getPipeline() {
        if (!this.pipeline) {
            this.pipeline = new PipelineFactory(this.settings).create();
        }

        return this.pipeline;
    }

    protected getPipelinePayloadFactory() {
        if (!this.pipelinePayloadFactory) {
            this.pipelinePayloadFactory = new PipelinePayloadFactory("");
        }

        return this.pipelinePayloadFactory;
    }
}

export default PhpmdController;
