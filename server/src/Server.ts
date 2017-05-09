import {
    createConnection, IConnection, InitializeResult, IPCMessageReader, IPCMessageWriter,
    TextDocument, TextDocumentIdentifier, TextDocuments
} from "vscode-languageserver";
import PhpmdController from "./controller/PhpmdController";
import PhpmdControllerFactory from "./factory/PhpmdControllerFactory";
import RemoteConsoleLoggerFactory from "./factory/RemoteConsoleLoggerFactory";
import IPhpmdSettingsModel from "./model/IPhpmdSettingsModel";
import ILogger from "./service/logger/ILogger";
import NullLogger from "./service/logger/NullLogger";

class Server {
    private connection: IConnection;
    private controller: PhpmdController;
    private controllerFactory: PhpmdControllerFactory;
    private documentsManager: TextDocuments;
    private logger: ILogger;
    private loggerFactory: RemoteConsoleLoggerFactory;

    public setConnection(connection: IConnection) {
        this.connection = connection;
    }

    public setControllerFactory(controllerFactory: PhpmdControllerFactory) {
        this.controllerFactory = controllerFactory;
    }

    public setLoggerFactory(loggerFactory: RemoteConsoleLoggerFactory) {
        this.loggerFactory = loggerFactory;
    }

    public setDocumentsManager(documentsManager: TextDocuments) {
        this.documentsManager = documentsManager;
    }

    public setController(controller: PhpmdController) {
        this.controller = controller;
    }

    public setLogger(logger: ILogger) {
        this.logger = logger;
    }

    public main(): void {
        let documentsManager: TextDocuments = this.getDocumentsManager();
        let connection: IConnection = this.getConnection();

        // Create logger
        this.createLogger(connection);

        // Manage documents for connection
        documentsManager.listen(connection);

        // The settings have changed. Is send on server activation as well.
        connection.onDidChangeConfiguration((change) => {
            this.getLogger().info("Configuration change triggerd, validating all open documents.");

            let settings = this.createSettings(change.settings.phpmd);
            this.logger.setVerbose(settings.verbose);

            this.getLogger().info("Creating controller", true);
            this.createController(connection, settings);

            // Revalidate any open text documents
            documentsManager.all().forEach((document: TextDocument) => {
                this.getLogger().info("Validating document " + document.uri, true);
                this.getController().Validate(document);
            });
        });

        // A php document was opened
        connection.onDidOpenTextDocument((parameters) => {
            this.getLogger().info("New document opened, starting validation.");

            let document: TextDocumentIdentifier = parameters.textDocument;

            this.getController().Validate(document);
        });

        // A php document was saved
        connection.onDidSaveTextDocument((parameters) => {
            this.getLogger().info("Document saved, starting validation.");

            let document: TextDocumentIdentifier = parameters.textDocument;

            this.getController().Validate(document);
        });

        // Set connection capabilities
        connection.onInitialize((params) => {
            this.getLogger().info("Language server connection initialized.");

            return this.getInitializeResult();
        });

        // Listen on the connection
        connection.listen();
    }

    protected getInitializeResult(): InitializeResult {
        return {
            capabilities: {
                textDocumentSync: this.getDocumentsManager().syncKind,
            }
        };
    }

    protected getConnection() {
        if (!this.connection) {
            this.connection = createConnection(new IPCMessageReader(process), new IPCMessageWriter(process));
        }

        return this.connection;
    }

    protected getDocumentsManager(): TextDocuments {
        if (!this.documentsManager) {
            this.documentsManager = new TextDocuments();
        }

        return this.documentsManager;
    }

    protected getControllerFactory() {
        if (!this.controllerFactory) {
            this.controllerFactory = new PhpmdControllerFactory();
        }

        return this.controllerFactory;
    }

    protected getLoggerFactory() {
        if (!this.loggerFactory) {
            this.loggerFactory = new RemoteConsoleLoggerFactory();
        }

        return this.loggerFactory;
    }

    protected createSettings(values: any): IPhpmdSettingsModel {
        let defaults: IPhpmdSettingsModel = {
            configurationFile: "",
            executable: "C:/Users/sbouw/AppData/Roaming/Composer/vendor/bin/phpmd.bat",
            rules: "cleancode,codesize,controversial,design,unusedcode,naming",
            verbose: false
        };

        let settings: IPhpmdSettingsModel = Object.assign<IPhpmdSettingsModel, any>(defaults, values);

        return settings;
    }

    protected createController(connection: IConnection, settings: IPhpmdSettingsModel) {
        let controllerFactory = this.getControllerFactory();
        controllerFactory.setConnection(connection);
        controllerFactory.setSettings(settings);

        this.controller = controllerFactory.create();
    }

    protected createLogger(connection: IConnection) {
        let loggerFactory = this.getLoggerFactory();
        loggerFactory.setConnection(connection);

        this.logger = loggerFactory.create();
    }

    protected getController() {
        if (!this.controller) {
            this.getLogger().error("Controller not initialized. Aborting");
            throw Error("Controller not initialized. Aborting.");
        }

        return this.controller;
    }

    protected getLogger(): ILogger {
        if (!this.logger) {
            return new NullLogger();
        }

        return this.logger;
    }
}

export default Server;
