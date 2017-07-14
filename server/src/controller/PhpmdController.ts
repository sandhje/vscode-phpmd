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

/**
 * PHP mess detector controller
 *
 * Defines actions available to the language server
 *
 * @module vscode-phpmd/server/controller
 * @author Sandhjé Bouw (sandhje@ecodes.io)
 */
class PhpmdController {
    /**
     * Validation pipeline
     *
     * @property {Pipeline<PipelinePayloadModel} pipeline
     */
    private pipeline: Pipeline<PipelinePayloadModel>;

    /**
     * Factory class for the pipelinePayload model
     *
     * @property {PipelinePayloadFactory} pipelinePayloadFactory
     */
    private pipelinePayloadFactory: PipelinePayloadFactory;

    /**
     * Logger class
     *
     * Process log messages of various severity levels.
     *
     * @property {ILogger} logger
     */
    private logger: ILogger;

    /**
     * Notifier class
     *
     * Send end-user friendly notifications.
     *
     * @property {INotifier} notifier
     */
    private notifier: INotifier;

    /**
     * PHP mess detector service
     *
     * Service class used to interact with the PHP mess detecter executable
     *
     * @property {PhpmdService} service
     */
    private service: PhpmdService;

    /**
     * Executable test error counter
     *
     * Keeps track of the number of times the phpmd executable was tested and the test failed.
     *
     * @property {number} phpmdTestErrorCount
     */
    private phpmdTestErrorCount: number = 0;

    /**
     * Create PHPMD controller instance with the passed connection and settings
     *
     * @param {IConnection} connection
     * @param {IPhpmdSettingsModel} settings
     */
    constructor(
        private connection: IConnection,
        private settings: IPhpmdSettingsModel
    ) { }

    /**
     * Validate the passed document with PHP mess detector
     *
     * @param {TextDocument|TextDocumentIdentifier} document
     * @returns {Promise<boolean>} Resolves with true on success, rejects with error on failure
     */
    public validate(document: TextDocument | TextDocumentIdentifier): Promise<boolean> {
        this.getLogger().info("PHP Mess Detector validation started for " + document.uri, true);

        return new Promise<boolean>((resolve, reject) => {
            // Test version
            this.getService().testPhpmd().then((data: boolean) => {
                let payload = this.getPipelinePayloadFactory().setUri(document.uri).create();

                this.getPipeline().run(payload).then((output) => {
                    let diagnostics = output.diagnostics;

                    // Send the computed diagnostics to VSCode.
                    this.getLogger().info("PHP Mess Detector validation completed for " + document.uri + ". " + diagnostics.length + " problems found", true);
                    this.connection.sendDiagnostics({uri: output.uri, diagnostics});

                    resolve(true);
                }, (err: Error) => {
                    this.getNotifier().error("An error occured while executing PHP Mess Detector");

                    reject(err);
                });
            }, (err: Error) => {
                // Only notify client of "PHPMD test error" once per controller instance
                if (!this.phpmdTestErrorCount) {
                    this.getNotifier().error("Unable to execute PHPMD command (" + this.settings.command + ")");
                }

                this.phpmdTestErrorCount++;
                reject(err);
            });
        });
    }

    /**
     * PhpmdService setter
     *
     * Allows injection of phpmdService for better testability.
     *
     * @param {PhpmdService} service
     * @returns {void}
     */
    public setService(service: PhpmdService): void {
        this.service = service;
    }

    /**
     * Pipeline setter
     *
     * Allows injection of the validation pipeline for better testability.
     *
     * @param {Pipeline<PipelinePayloadModel} pipeline
     * @returns {void}
     */
    public setPipeline(pipeline: Pipeline<PipelinePayloadModel>): void {
        this.pipeline = pipeline;
    }

    /**
     * PipelinePayload factory setter
     *
     * Allows injection of pipeline payload factory for better testability.
     *
     * @param {PipelinePayloadFactory} pipelinePayloadFactory
     * @returns {void}
     */
    public setPipelinePayloadFactory(pipelinePayloadFactory: PipelinePayloadFactory): void {
        this.pipelinePayloadFactory = pipelinePayloadFactory;
    }

    /**
     * Logger setter
     *
     * Allows injection of the logger for better testability.
     *
     * @param {ILogger} logger
     * @returns {void}
     */
    public setLogger(logger: ILogger): void {
        this.logger = logger;
    }

    /**
     * Notifier setter
     *
     * Allows injection of the notifier for better testability.
     *
     * @param {INotifier} notifier
     * @returns {void}
     */
    public setNotifier(notifier: INotifier): void {
        this.notifier = notifier;
    }

    /**
     * Get the PHP mess detector service
     *
     * Create a service based on this server's settings if no service was set before
     *
     * @returns {PhpmdService}
     */
    protected getService(): PhpmdService {
        if (!this.service) {
            this.service = new PhpmdService(this.settings.command);
            this.service.setLogger(this.getLogger());
        }

        return this.service;
    }

    /**
     * Get the validation pipeline
     *
     * Create a pipline based on this server's settings if no pipeline was set before
     *
     * @returns {Pipeline<PipelinePayloadModel>}
     */
    protected getPipeline(): Pipeline<PipelinePayloadModel> {
        if (!this.pipeline) {
            this.pipeline = new PipelineFactory(this.settings, this.getLogger()).create();
        }

        return this.pipeline;
    }

    /**
     * Get the pipeline payload factory
     *
     * Create a pipline payload factory if no factory was set before
     *
     * @returns {PipelinePayloadFactory}
     */
    protected getPipelinePayloadFactory(): PipelinePayloadFactory {
        if (!this.pipelinePayloadFactory) {
            this.pipelinePayloadFactory = new PipelinePayloadFactory("");
        }

        return this.pipelinePayloadFactory;
    }

    /**
     * Get the logger
     *
     * Create a null object implementing the ILogger interface if no logger was set before
     *
     * @returns {ILogger}
     */
    protected getLogger(): ILogger {
        if (!this.logger) {
            this.logger = new NullLogger();
        }

        return this.logger;
    }

    /**
     * Get the notifier
     *
     * Create a null object implementing the INotifier interface if no notifier was set before
     *
     * @returns {INotifier}
     */
    protected getNotifier(): INotifier {
        if (!this.notifier) {
            this.notifier = new NullNotifier();
        }

        return this.notifier;
    }
}

export default PhpmdController;
