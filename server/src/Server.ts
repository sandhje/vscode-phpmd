import {
    createConnection, IConnection, InitializeResult, IPCMessageReader, IPCMessageWriter,
    TextDocument, TextDocumentIdentifier, TextDocuments
} from "vscode-languageserver";
import PhpmdController from "./controller/PhpmdController";
import PhpmdControllerFactory from "./factory/PhpmdControllerFactory";
import IPhpmdSettingsModel from "./model/IPhpmdSettingsModel";

class Server {
    private connection: IConnection;
    private controller: PhpmdController;
    private controllerFactory: PhpmdControllerFactory;
    private documentsManager: TextDocuments;

    public setConnection(connection: IConnection) {
        this.connection = connection;
    }

    public setControllerFactory(controllerFactory: PhpmdControllerFactory) {
        this.controllerFactory = controllerFactory;
    }

    public setDocumentsManager(documentsManager: TextDocuments) {
        this.documentsManager = documentsManager;
    }

    public setController(controller: PhpmdController) {
        this.controller = controller;
    }

    public main(): void {
        let documentsManager: TextDocuments = this.getDocumentsManager();
        let connection: IConnection = this.getConnection();

        // Manage documents for connection
        documentsManager.listen(connection);

        // The settings have changed. Is send on server activation as well.
        connection.onDidChangeConfiguration((change) => {
            // connection.console.info("Configuration change triggerd, validating all open documents.");

            let settings = this.createSettings(change.settings.phpmd);
            this.createController(connection, settings);

            // Revalidate any open text documents
            documentsManager.all().forEach((document: TextDocument) => {
                this.getController().Validate(document);
            });
        });

        // A php document was opened
        connection.onDidOpenTextDocument((parameters) => {
            // connection.console.info("New document opened, starting validation.");

            let document: TextDocumentIdentifier = parameters.textDocument;

            this.getController().Validate(document);
        });

        // A php document was saved
        connection.onDidSaveTextDocument((parameters) => {
            // connection.console.info("Document saved, starting validation.");

            let document: TextDocumentIdentifier = parameters.textDocument;

            this.getController().Validate(document);
        });

        // Set connection capabilities
        connection.onInitialize((params) => {
            // connection.console.info("Language server connection initialized.");

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

    protected createSettings(values: any): IPhpmdSettingsModel {
        let defaults: IPhpmdSettingsModel = {
            configurationFile: "",
            executable: "C:/Users/sbouw/AppData/Roaming/Composer/vendor/bin/phpmd.bat",
            rules: "cleancode,codesize,controversial,design,unusedcode,naming"
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

    protected getController() {
        if (!this.controller) {
            this.getConnection().console.error("Controller not initialized. Aborting");
            throw Error("Controller not initialized. Aborting");
        }

        return this.controller;
    }
}

export default Server;
