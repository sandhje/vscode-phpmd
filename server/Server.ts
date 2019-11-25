import * as Path from "path";
import {
    createConnection, IConnection, InitializeResult, IPCMessageReader, IPCMessageWriter,
    TextDocument, TextDocumentIdentifier, TextDocuments, WorkspaceFolder
} from "vscode-languageserver";
import PhpmdController from "./controller/PhpmdController";
import ClientConnectionNotifierFactory from "./factory/ClientConnectionNotifierFactory";
import ILoggerFactory from "./factory/ILoggerFactory";
import INotifierFactory from "./factory/INotifierFactory";
import PhpmdControllerFactory from "./factory/PhpmdControllerFactory";
import RemoteConsoleLoggerFactory from "./factory/RemoteConsoleLoggerFactory";
import IPhpmdSettingsModel from "./model/IPhpmdSettingsModel";
import ILogger from "./service/logger/ILogger";
import NullLogger from "./service/logger/NullLogger";
import INotifier from "./service/notifier/INotifier";
import NullNotifier from "./service/notifier/NullNotifier";
import IPhpmdEnvironmentModel from "./model/IPhpmdEnvironmentModel";
import { homedir } from "os";

/**
 * PHP mess detector language server
 *
 * @module vscode-phpmd/server
 * @author Sandhjé Bouw (sandhje@ecodes.io)
 */
class Server {
    /**
     * VSCode server connection class
     *
     * @property {IConnection} connection
     */
    private connection: IConnection;

    /**
     * VSCode client workspace folders
     * 
     * @property {WorkspaceFolder[]} workspaceFolders
     */
    private workspaceFolders: WorkspaceFolder[];

    /**
     * OS home directory
     * 
     * @property {string} homeDir
     */
    private homeDir: string;

    /**
     * PHP mess detector controller class
     *
     * Contains the main API to run the PHPMD command and process its results.
     *
     * @property {PhpmdController} PhpmdController
     */
    private controller: PhpmdController;

    /**
     * PHP mess detector controller factory class
     *
     * Creates PHPMD controller instances.
     *
     * @property {PhpmdControllerFactory} controllerFactory
     */
    private controllerFactory: PhpmdControllerFactory;

    /**
     * VSCode document manager class
     *
     * API to access and manipulate documents open in the connected VSCode window.
     *
     * @property {TextDocuments} documentsManager
     */
    private documentsManager: TextDocuments;

    /**
     * Logger class
     *
     * Process log messages of various severity levels.
     *
     * @property {ILogger} logger
     */
    private logger: ILogger;

    /**
     * Logger factory class
     *
     * Creates logger instances.
     *
     * @property {ILoggerFactory} loggerFactory
     */
    private loggerFactory: ILoggerFactory;

    /**
     * Notifier class
     *
     * Send end-user friendly notifications.
     *
     * @property {INotifier} notifier
     */
    private notifier: INotifier;

    /**
     * Notifier factory class
     *
     * Creates notifier instances.
     *
     * @property {INotifierFactory} notifierFactory
     */
    private notifierFactory: INotifierFactory;

    /**
     * Connection setter
     *
     * Allows injection of connection for better testability.
     *
     * @param {IConnection} connection
     * @returns {void}
     */
    public setConnection(connection: IConnection): void {
        this.connection = connection;
    }

    /**
     * WorkspaceFolders setter
     *
     * Allows injection of workspaceFolders for better testability.
     *
     * @param {WorkspaceFolder[]} workspaceFolders
     * @returns {void}
     */
    public setWorkspaceFolders(workspaceFolders: WorkspaceFolder[]): void {
        this.workspaceFolders = workspaceFolders;
    }

    /**
     * HomeDir setter
     *
     * Allows injection of homedir for better testability.
     *
     * @param {string} HomeDir
     * @returns {void}
     */
    public setHomeDir(homeDir: string): void {
        this.homeDir = homeDir;
    }

    /**
     * ControllerFactory setter
     *
     * Allows injection of controllerFactory for better testability.
     *
     * @param {PhpmdControllerFactory} controllerFactory
     * @returns {void}
     */
    public setControllerFactory(controllerFactory: PhpmdControllerFactory): void {
        this.controllerFactory = controllerFactory;
    }

    /**
     * LoggerFactory setter
     *
     * Allows injection of loggerFactory for better testability.
     *
     * @param {ILoggerFactory} loggerFactory
     * @returns {void}
     */
    public setLoggerFactory(loggerFactory: ILoggerFactory): void {
        this.loggerFactory = loggerFactory;
    }

    /**
     * NotifierFactory setter
     *
     * Allows injection of notifierFactory for better testability.
     *
     * @param {INotifierFactory} notifierFactory
     * @returns {void}
     */
    public setNotifierFactory(notifierFactory: INotifierFactory): void {
        this.notifierFactory = notifierFactory;
    }

    /**
     * DocumentsManager setter
     *
     * Allows injection of documentsManager for better testability.
     *
     * @param {TextDocuments} documentsManager
     * @returns {void}
     */
    public setDocumentsManager(documentsManager: TextDocuments): void {
        this.documentsManager = documentsManager;
    }

    /**
     * Controller setter
     *
     * Allows injection of controller for better testability.
     *
     * @param {PhpmdController} controller
     * @returns {void}
     */
    public setController(controller: PhpmdController): void {
        this.controller = controller;
    }

    /**
     * Logger setter
     *
     * Allows injection of logger for better testability.
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
     * Allows injection of notifier for better testability.
     *
     * @param {INotifier} notifier
     * @returns {void}
     */
    public setNotifier(notifier: INotifier): void {
        this.notifier = notifier;
    }

    /**
     * Server's main point of entry
     *
     * The main method sets up the connection starts the listening and registers relevant event listeners and
     * their handlers on the connection.
     *
     * @returns {void}
     */
    public main(): void {
        // Get VSCode documentManager and connection
        let documentsManager: TextDocuments = this.getDocumentsManager();
        let connection: IConnection = this.getConnection();

        // Create logger
        this.createLogger(connection);

        // Create notifier
        this.createNotifier(connection);

        // Manage documents for connection
        documentsManager.listen(connection);

        // The settings have changed. Is send on server activation as well.
        connection.onDidChangeConfiguration((change) => {
            this.getLogger().info("Configuration change triggerd, validating all open documents.");

            let settings = this.createSettings(change.settings.phpmd);
            let environment = this.createEnvironment();
            this.logger.setVerbose(settings.verbose);

            this.getLogger().info("Creating controller", true);
            this.createController(connection, settings, environment);

            // (Re)Validate any open text documents
            documentsManager.all().forEach((document: TextDocument) => {
                this.getLogger().info("Validating document " + document.uri, true);
                this.getController().validate(document).then((result: boolean) => {
                    this.getLogger().info("Document validation after config change completed successfully");
                }, (err: Error) => {
                    this.getLogger().error(
                        "An error occured during document validation after config change with the following message: "
                        + err.message
                    );
                });
            });
        });

        // A php document was opened
        connection.onDidOpenTextDocument((parameters) => {
            this.getLogger().info("New document opened, starting validation.");

            let document: TextDocumentIdentifier = parameters.textDocument;

            this.getController().validate(document).then((result: boolean) => {
                this.getLogger().info("Document validation after open completed successfully");
            }, (err: Error) => {
                this.getLogger().error(
                    "An error occured during document validation after open with the following message: " + err.message
                );
            });
        });

        // A php document was saved
        connection.onDidSaveTextDocument((parameters) => {
            this.getLogger().info("Document saved, starting validation.");

            let document: TextDocumentIdentifier = parameters.textDocument;

            this.getController().validate(document).then((result: boolean) => {
                this.getLogger().info("Document validation after save completed successfully");
            }, (err: Error) => {
                this.getLogger().error(
                    "An error occured during document validation after save with the following message: " + err.message
                );
            });
        });

        // A php document was closed
        connection.onDidCloseTextDocument((parameters) => {
            this.getLogger().info("Document closed, clearing messages.");
            
            let document: TextDocumentIdentifier = parameters.textDocument;

            this.getController().clear(document);
        });

        // Set connection capabilities
        connection.onInitialize((params) => {
            this.getLogger().info("Language server connection initialized.");

            if (params && params.workspaceFolders) {
                this.getLogger().info(`Setting workspaceFolders ${JSON.stringify(params.workspaceFolders)}.`);
                this.setWorkspaceFolders(params.workspaceFolders)
            }

            return this.getInitializeResult();
        });

        // Listen on the connection
        connection.listen();
    }

    /**
     * Return the initializeResult object for the server's documentManager
     *
     * @returns {InitializeResult}
     */
    protected getInitializeResult(): InitializeResult {
        return {
            capabilities: {
                textDocumentSync: this.getDocumentsManager().syncKind,
            }
        };
    }

    /**
     * Get the VSCode connection or create one if no connection was set before
     *
     * @returns {IConnection}
     */
    protected getConnection(): IConnection {
        if (!this.connection) {
            this.connection = createConnection(new IPCMessageReader(process), new IPCMessageWriter(process));
        }

        return this.connection;
    }

    /**
     * Get the VSCode connection workspaceFolders
     *
     * @returns {WorkspaceFolder[]}
     */
    protected getWorkspaceFolders(): WorkspaceFolder[] {
        return this.workspaceFolders;
    }

    /**
     * Get the OS HomeDir
     *
     * @returns {string}
     */
    protected getHomeDir(): string {
        if (!this.homeDir) {
            this.homeDir = homedir(); 
        }

        return this.homeDir;
    }

    /**
     * Get the VSCode documentsManager or create on if no documentsManager was set before
     *
     * @returns {TextDocuments}
     */
    protected getDocumentsManager(): TextDocuments {
        if (!this.documentsManager) {
            this.documentsManager = new TextDocuments();
        }

        return this.documentsManager;
    }

    /**
     * Get the controller factory or create a PhpmdControllerFactory if no controller factory was set before
     *
     * @returns {PhpmdControllerFactory}
     */
    protected getControllerFactory(): PhpmdControllerFactory {
        if (!this.controllerFactory) {
            this.controllerFactory = new PhpmdControllerFactory();
        }

        return this.controllerFactory;
    }

    /**
     * Get the logger factory or create a RemoteConsoleLoggerFactory if no logger factory was set before
     *
     * @returns {ILoggerFactory}
     */
    protected getLoggerFactory(): ILoggerFactory {
        if (!this.loggerFactory) {
            this.loggerFactory = new RemoteConsoleLoggerFactory();
        }

        return this.loggerFactory;
    }

    /**
     * Get the notifier factory or create a ClientConnectionNotifierFactory if no notifier factory was set before
     *
     * @returns {INotifierFactory}
     */
    protected getNotifierFactory(): INotifierFactory {
        if (!this.notifierFactory) {
            this.notifierFactory = new ClientConnectionNotifierFactory();
        }

        return this.notifierFactory;
    }

    /**
     * Create a settings model
     *
     * Create a PHPMD settings model from the values send through the VSCode connection with some sane default values.
     *
     * @param {IPhpmdSettingsModel}
     */
    protected createSettings(values: any): IPhpmdSettingsModel {
        let defaults: IPhpmdSettingsModel = {
            enabled: true,
            command: "",
            rules: "",
            verbose: false,
            clearOnClose: true
        };

        let settings: IPhpmdSettingsModel = Object.assign<IPhpmdSettingsModel, any>(defaults, values);

        if (!settings.command) {
            settings.command = this.getDefaultCommand();
        }

        return settings;
    }

    /**
     * Create a environment model
     *
     * Create a PHPMD environment model from the server environment
     *
     * @param {IPhpmdEnvironmentModel}
     */
    protected createEnvironment(): IPhpmdEnvironmentModel {
        const environment: IPhpmdEnvironmentModel = {
            workspaceFolders: this.getWorkspaceFolders(),
            homeDir: this.getHomeDir()
        };

        return environment;
    }

    /**
     * Get the default command
     *
     * Get the default PHPMD command string to execute the shipped PHPMD phar file with php
     *
     * @returns {string}
     */
    protected getDefaultCommand(): string {
        let serverPath = Path.dirname(process.argv[1]);
        let phpmdPath = Path.normalize(serverPath + "/../../phpmd/phpmd.phar");
        let executable = "php " + phpmdPath;

        return executable;
    }

    /**
     * Create the server's PHPMD controller
     *
     * Instantiates the controller by using this server's controller factory. Arranges the controller
     * to use the correct connection, settings, logger and notifier. Assigns the controller to the
     * controller property of this server instance.
     *
     * @param {IConnection} connection
     * @param {IPhpmdSettingsModel} settings
     * @returns {void}
     */
    protected createController(connection: IConnection, settings: IPhpmdSettingsModel, environment: IPhpmdEnvironmentModel): void {
        let controllerFactory = this.getControllerFactory();
        controllerFactory.setConnection(connection);
        controllerFactory.setSettings(settings);
        controllerFactory.setEnvironment(environment);

        this.controller = controllerFactory.create();
        this.controller.setLogger(this.getLogger());
        this.controller.setNotifier(this.getNotifier());

        this.getLogger().info(`Created controller with settings '${JSON.stringify(settings)}' and environment '${JSON.stringify(environment)}'`);
    }

    /**
     * Create the server's logger
     *
     * Instantiates the logger by using this server's logger factory. Arranges the logger to use the
     * correct connection. Assigns the logger to the logger property of this server instance.
     *
     * @param {IConnection} connection
     * @returns {void}
     */
    protected createLogger(connection: IConnection): void {
        let loggerFactory = this.getLoggerFactory();
        loggerFactory.setConnection(connection);

        this.logger = loggerFactory.create();
    }

    /**
     * Create the server's notifier
     *
     * Instantiates the notifier by using this server's notifier factory. Arranges the notifier to use the
     * correct connection. Assigns the notifier to the notifier property of this server instance.
     *
     * @param {IConnection} connection
     * @returns {void}
     */
    protected createNotifier(connection: IConnection) {
        let notifierFactory = this.getNotifierFactory();
        notifierFactory.setConnection(connection);

        this.notifier = notifierFactory.create();
    }

    /**
     * Get the server's PHPMD controller
     *
     * Logs and throws an error if the controller was not created before calling this method.
     *
     * @throws {Error}
     * @returns {PhpmdController}
     */
    protected getController(): PhpmdController {
        if (!this.controller) {
            this.getLogger().error("Controller not initialized. Aborting");
            throw Error("Controller not initialized. Aborting.");
        }

        return this.controller;
    }

    /**
     * Get the server's logger
     *
     * Returns a null object implementing the ILogger interface if no logger was created before calling this method.
     *
     * @returns {ILogger}
     */
    protected getLogger(): ILogger {
        if (!this.logger) {
            return new NullLogger();
        }

        return this.logger;
    }

    /**
     * Get the server's notifier
     *
     * Returns a null object implementing the INotifier interface if no notifier was created before calling this method.
     *
     * @returns {INotifier}
     */
    protected getNotifier(): INotifier {
        if (!this.notifier) {
            return new NullNotifier();
        }

        return this.notifier;
    }
}

export default Server;
