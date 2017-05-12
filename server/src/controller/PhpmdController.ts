import { Pipeline } from "@open-sourcerers/j-stillery";
import {
    CompletionItem, CompletionItemKind, createConnection, Diagnostic,
    DiagnosticSeverity, IConnection, InitializeParams, InitializeResult,
    IPCMessageReader, IPCMessageWriter, TextDocument, TextDocumentIdentifier,
    TextDocumentPositionParams, TextDocuments, TextDocumentSyncKind
} from "vscode-languageserver";
import PipelineFactory from "../factory/PipelineFactory";
import PipelinePayloadFactory from "../factory/PipelinePayloadFactory";
import IPhpmdSettingsModel from "../model/IPhpmdSettingsModel";
import PipelinePayloadModel from "../model/PipelinePayloadModel";
import ILogger from "../service/logger/ILogger";
import NullLogger from "../service/logger/NullLogger";
import INotifier from "../service/notifier/INotifier";
import NullNotifier from "../service/notifier/NullNotifier";
import PhpmdService from "../service/PhpmdService";

class PhpmdController {
    private pipeline: Pipeline<PipelinePayloadModel>;
    private pipelinePayloadFactory: PipelinePayloadFactory;
    private logger: ILogger;
    private notifier: INotifier;
    private service: PhpmdService;

    constructor(
        private connection: IConnection,
        private settings: IPhpmdSettingsModel
    ) { }

    public Validate(document: TextDocument | TextDocumentIdentifier) {
        // Test version
        this.getLogger().info("PHP Mess Detector validation started for " + document.uri, true);

        this.getService().getVersion().then((data: string) => {
            this.getLogger().info("PHP Mess Detector version check succesful (" + data + ")", true);
            let payload = this.getPipelinePayloadFactory().setUri(document.uri).create();

            this.getPipeline().run(payload).then((output) => {
                let diagnostics = output.diagnostics;

                // Send the computed diagnostics to VSCode.
                this.getLogger().info("PHP Mess Detector validation completed for " + document.uri + ". " + diagnostics.length + " problems found", true);
                this.connection.sendDiagnostics({uri: output.uri, diagnostics});
            });
        }, (err: Error) => {
            this.getNotifier().error("PHP Mess Detector executable not found");
        });

    }

    public setService(service: PhpmdService): void {
        this.service = service;
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

    public setNotifier(notifier: INotifier): void {
        this.notifier = notifier;
    }

    protected getService() {
        if (!this.service) {
            this.service = new PhpmdService(this.settings.executable);
        }

        return this.service;
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

    protected getNotifier(): INotifier {
        if (!this.notifier) {
            this.notifier = new NullNotifier();
        }

        return this.notifier;
    }
}

export default PhpmdController;
