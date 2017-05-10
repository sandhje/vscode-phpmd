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
import ILogger from "../service/logger/ILogger";
import NullLogger from "../service/logger/NullLogger";

class PhpmdController {
    private pipeline: Pipeline<PipelinePayloadModel>;
    private pipelinePayloadFactory: PipelinePayloadFactory;
    private logger: ILogger;

    constructor(
        private connection: IConnection,
        private settings: IPhpmdSettingsModel
    ) { }

    public Validate(document: TextDocument | TextDocumentIdentifier) {
        this.getLogger().info("PHP Mess Detector validation started for " + document.uri, true);
        let payload = this.getPipelinePayloadFactory().setUri(document.uri).create();

        this.getPipeline().run(payload).then((output) => {
            let diagnostics = output.diagnostics;

            // Send the computed diagnostics to VSCode.
            this.getLogger().info("PHP Mess Detector validation completed for " + document.uri + ". " + diagnostics.length + " problems found", true);
            this.connection.sendDiagnostics({uri: output.uri, diagnostics});
        });
    }

    public setPipeline(pipeline: Pipeline<PipelinePayloadModel>): void {
        this.pipeline = pipeline;
    }

    public setPipelinePayloadFactory(pipelinePayloadFactory: PipelinePayloadFactory): void {
        this.pipelinePayloadFactory = pipelinePayloadFactory;
    }

    public setLogger(logger: ILogger): void {
        this.logger = logger;
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

    protected getLogger(): ILogger {
        if (!this.logger) {
            this.logger = new NullLogger();
        }

        return this.logger;
    }
}

export default PhpmdController;
