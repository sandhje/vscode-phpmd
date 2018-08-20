import { assert, expect } from "chai";
import { only, skip, slow, suite, test, timeout } from "mocha-typescript";
import * as sinon from "sinon";
import { IConnection, TextDocument, TextDocumentIdentifier, TextDocuments } from "vscode-languageserver";
import PhpmdController from "../server/controller/PhpmdController";
import ILoggerFactory from "../server/factory/ILoggerFactory";
import NullLoggerFactory from "../server/factory/NullLoggerFactory";
import PhpmdControllerFactory from "../server/factory/PhpmdControllerFactory";
import RemoteConsoleLoggerFactory from "../server/factory/RemoteConsoleLoggerFactory";
import Server from "../server/Server";
import ILogger from "../server/service/logger/ILogger";
import NullLogger from "../server/service/logger/NullLogger";

@suite("PhpMD language server")
class ServerTest {

    @test("Should initialize server-client connection")
    public assertInitializeServerClientConnection() {
        // Arrange
        // =======
        // Fake documentsManager
        let document = <TextDocument> {};
        let documentsManager = <TextDocuments> {};

        // DocumentsManager listen spy
        let dmListenSpy = sinon.spy();
        documentsManager.listen = dmListenSpy;

        // onInitialize connection stub
        let onInitializeStub = sinon.stub();
        onInitializeStub.callsArg(0);

        // Connection listen spy
        let connectionListenSpy = sinon.spy();

        // Fake connection
        let connection = <IConnection> {};
        connection.onDidChangeConfiguration = () => { /* Fake */ };
        connection.onDidOpenTextDocument = () => { /* Fake */ };
        connection.onDidSaveTextDocument = () => { /* Fake */ };
        connection.onDidCloseTextDocument = () => { /* Fake */ };
        connection.onInitialize = onInitializeStub;
        connection.listen = connectionListenSpy;

        // Create and configure server
        let server = new Server();
        server.setDocumentsManager(documentsManager);
        server.setConnection(connection);
        server.setLoggerFactory(new NullLoggerFactory());
        server.setLogger(new NullLogger());

        // Act
        server.main();

        // Assert
        expect(dmListenSpy.calledOnce && dmListenSpy.calledWith(connection)).to.be.true;
        expect(onInitializeStub.calledOnce).to.be.true;
        expect(connectionListenSpy.calledOnce).to.be.true;
    }

    @test("Should validate on configuration change")
    public assertValidateOnDidChangeConfiguration(done) {
        // Arrange
        // =======
        // Fake change
        let change = <any> {
            settings: {
                configurationFile: "testConfigurationFileSetting",
                executable: "testExecutableSetting",
                rule: "testRulesSetting"
            }
        };

        // Stub connection.onDidChangeConfiguration
        let onDidChangeConfigurationStub = sinon.stub();
        onDidChangeConfigurationStub.callsArgWith(0, change);

        // Fake documentsManager
        let document = <TextDocument> {};
        let documentsManager = <TextDocuments> {};
        documentsManager.all = () => {
            return <TextDocument[]> [document];
        };

        // DocumentsManager listen spy
        let dmListenSpy = sinon.spy();
        documentsManager.listen = dmListenSpy;

        // Fake connection
        let connection = <IConnection> {};
        connection.onDidChangeConfiguration = onDidChangeConfigurationStub;

        // Fake controller
        let controller = <PhpmdController> {};
        controller.validate = (documentToValidate) => {
            // Assert
            expect(setConnectionSpy.calledOnce && setConnectionSpy.calledWith(connection)).to.be.true;
            expect(setSettingsSpy.calledOnce).to.be.true;
            expect(documentToValidate).to.equal(document);
            done();

            return Promise.resolve(true);
        };
        controller.setLogger = sinon.stub();
        controller.setNotifier = sinon.stub();

        // Fake controllerFactory
        let controllerFactory = <PhpmdControllerFactory> {};

        // SetConnection and SetSettings spies
        let setConnectionSpy = sinon.spy();
        let setSettingsSpy = sinon.spy();
        controllerFactory.setConnection = setConnectionSpy;
        controllerFactory.setSettings = setSettingsSpy;

        // Create stub
        let createStub = sinon.stub();
        createStub.returns(controller);
        controllerFactory.create = createStub;

        // Create and configure server
        let server = new Server();
        server.setDocumentsManager(documentsManager);
        server.setConnection(connection);
        server.setControllerFactory(controllerFactory);
        server.setLoggerFactory(new NullLoggerFactory());

        // Act
        server.main();
    }

    @test("Should validate on open text document")
    public assertValidateOnDidOpenTextDocument(done) {
        // Arrange
        // =======
        // Fake parameters
        let parameters = <any> {
            textDocument: <TextDocumentIdentifier> {}
        };

        // Stub connection.onDidSaveTextDocument
        let onDidOpenTextDocumentStub = sinon.stub();
        onDidOpenTextDocumentStub.callsArgWith(0, parameters);

        // Fake documentsManager
        let document = <TextDocument> {};
        let documentsManager = <TextDocuments> {};
        documentsManager.all = () => {
            return <TextDocument[]> [document];
        };

        // DocumentsManager listen spy
        let dmListenSpy = sinon.spy();
        documentsManager.listen = dmListenSpy;

        // Fake connection
        let connection = <IConnection> {};
        connection.onDidChangeConfiguration = () => { /* Fake */ };
        connection.onDidOpenTextDocument = onDidOpenTextDocumentStub;

        // Fake controller
        let controller = <PhpmdController> {};
        controller.validate = (documentToValidate) => {
            // Assert
            expect(documentToValidate).to.equal(parameters.textDocument);
            done();

            return Promise.resolve(true)
        };

        // Create and configure server
        let server = new Server();
        server.setDocumentsManager(documentsManager);
        server.setConnection(connection);
        server.setController(controller);
        server.setLoggerFactory(new NullLoggerFactory());

        // Act
        server.main();
    }

    @test("Should validate on save text document")
    public assertValidateOnDidSaveTextDocument(done) {
        // Arrange
        // =======
        // Fake parameters
        let parameters = <any> {
            textDocument: <TextDocumentIdentifier> {}
        };

        // Stub connection.onDidOpenTextDocument
        let onDidSaveTextDocumentStub = sinon.stub();
        onDidSaveTextDocumentStub.callsArgWith(0, parameters);

        // Fake documentsManager
        let document = <TextDocument> {};
        let documentsManager = <TextDocuments> {};
        documentsManager.all = () => {
            return <TextDocument[]> [document];
        };

        // DocumentsManager listen spy
        let dmListenSpy = sinon.spy();
        documentsManager.listen = dmListenSpy;

        // Fake connection
        let connection = <IConnection> {};
        connection.onDidChangeConfiguration = () => { /* Fake */ };
        connection.onDidOpenTextDocument = () => { /* Fake */ };
        connection.onDidCloseTextDocument = () => { /* Fake */ };
        connection.onDidSaveTextDocument = onDidSaveTextDocumentStub;

        // Fake controller
        let controller = <PhpmdController> {};
        controller.validate = (documentToValidate) => {
            // Assert
            expect(documentToValidate).to.equal(parameters.textDocument);
            done();

            return Promise.resolve(true);
        };

        // Create and configure server
        let server = new Server();
        server.setDocumentsManager(documentsManager);
        server.setConnection(connection);
        server.setController(controller);
        server.setLoggerFactory(new NullLoggerFactory());

        // Act
        server.main();
    }

    @test("Should clear problems on close document")
    public assertClearOnDidCloseTextDocument(done) {
        // Arrange
        // =======
        // Fake parameters
        let parameters = <any> {
            textDocument: <TextDocumentIdentifier> {}
        };

        // Stub connection.onDidOpenTextDocument
        let onDidCloseTextDocumentStub = sinon.stub();
        onDidCloseTextDocumentStub.callsArgWith(0, parameters);
        
        // Fake documentsManager
        let document = <TextDocument> {};
        let documentsManager = <TextDocuments> {};
        documentsManager.all = () => {
            return <TextDocument[]> [document];
        };

        // DocumentsManager listen spy
        let dmListenSpy = sinon.spy();
        documentsManager.listen = dmListenSpy;

        // Fake connection
        let connection = <IConnection> {};
        connection.onDidChangeConfiguration = () => { /* Fake */ };
        connection.onDidOpenTextDocument = () => { /* Fake */ };
        connection.onDidSaveTextDocument = () => { /* Fake */ };
        connection.onDidCloseTextDocument = onDidCloseTextDocumentStub;

        // Fake controller
        let controller = <PhpmdController> {};
        controller.clear = (documentToValidate) => {
            // Assert
            expect(documentToValidate).to.equal(parameters.textDocument);
            done();
        };

        // Create and configure server
        let server = new Server();
        server.setDocumentsManager(documentsManager);
        server.setConnection(connection);
        server.setController(controller);
        server.setLoggerFactory(new NullLoggerFactory());

        // Act
        server.main();
    }

    @test("Should throw error if validation on configuration change fails")
    public assertValidateErrorOnDidChangeConfiguration(done) {
        // Arrange
        // =======
        // Fake change
        let change = <any> {
            settings: {
                configurationFile: "testConfigurationFileSetting",
                executable: "testExecutableSetting",
                rule: "testRulesSetting"
            }
        };

        // Stub connection.onDidChangeConfiguration
        let onDidChangeConfigurationStub = sinon.stub();
        onDidChangeConfigurationStub.callsArgWith(0, change);

        // Fake documentsManager
        let document = <TextDocument> {};
        let documentsManager = <TextDocuments> {};
        documentsManager.all = () => {
            return <TextDocument[]> [document];
        };

        // DocumentsManager listen spy
        let dmListenSpy = sinon.spy();
        documentsManager.listen = dmListenSpy;

        // Fake connection
        let connection = <IConnection> {};
        connection.onDidChangeConfiguration = onDidChangeConfigurationStub;
        connection.onDidOpenTextDocument = () => { /* Fake */ };
        connection.onDidSaveTextDocument = () => { /* Fake */ };
        connection.onDidCloseTextDocument = () => { /* Fake */ };
        connection.onInitialize = () => { /* Fake */ };
        connection.listen = () => { /* Fake */ };

        // Validate stub
        let validate = sinon.stub();
        validate.returns(Promise.reject(Error("Test error")));

        // Fake controller
        let controller = <PhpmdController> {};
        controller.validate = validate;
        controller.setLogger = sinon.stub();
        controller.setNotifier = sinon.stub();

        // Fake controllerFactory
        let controllerFactory = <PhpmdControllerFactory> {};

        // SetConnection and SetSettings spies
        let setConnectionSpy = sinon.spy();
        let setSettingsSpy = sinon.spy();
        controllerFactory.setConnection = setConnectionSpy;
        controllerFactory.setSettings = setSettingsSpy;

        // Create stub
        let createStub = sinon.stub();
        createStub.returns(controller);
        controllerFactory.create = createStub;

        // Fake logger
        let logger = <ILogger> {};
        logger.error = (message: string, isVerbose?: boolean): ILogger => {
            expect(message).to.contain("Test error");
            expect(isVerbose).to.be.undefined;
            done();

            return <ILogger> {};
        };
        logger.info = (message: string, isVerbose?: boolean): ILogger => { return <ILogger> {}; };
        logger.setVerbose = (verbose: boolean) => { return <ILogger> {}; };

        // Logger factory
        let loggerFactory = <ILoggerFactory> {};
        loggerFactory.create = (): ILogger => {
            return logger;
        };
        loggerFactory.setConnection = (connection: IConnection) => { return; };
        loggerFactory.setVerbose = (verbose: boolean) => { return; };

        // Create and configure server
        let server = new Server();
        server.setDocumentsManager(documentsManager);
        server.setConnection(connection);
        server.setControllerFactory(controllerFactory);
        server.setLoggerFactory(loggerFactory);

        // Act
        server.main();
    }

    @test("Should throw error if validation on open text document fails")
    public assertValidateErrorOnDidOpenTextDocument(done) {
        // Arrange
        // =======
        // Fake parameters
        let parameters = <any> {
            textDocument: <TextDocumentIdentifier> {}
        };

        // Stub connection.onDidOpenTextDocument
        let onDidOpenTextDocumentStub = sinon.stub();
        onDidOpenTextDocumentStub.callsArgWith(0, parameters);

        // Fake documentsManager
        let document = <TextDocument> {};
        let documentsManager = <TextDocuments> {};
        documentsManager.all = () => {
            return <TextDocument[]> [document];
        };

        // DocumentsManager listen spy
        let dmListenSpy = sinon.spy();
        documentsManager.listen = dmListenSpy;

        // Fake connection
        let connection = <IConnection> {};
        connection.onDidChangeConfiguration = () => { /* Fake */ };
        connection.onDidOpenTextDocument = onDidOpenTextDocumentStub;
        connection.onDidSaveTextDocument = () => { /* Fake */ };
        connection.onDidCloseTextDocument = () => { /* Fake */ };
        connection.onInitialize = () => { /* Fake */ };
        connection.listen = () => { /* Fake */ };

        // Validate stub
        let validate = sinon.stub();
        validate.returns(Promise.reject(Error("Test error")));

        // Fake controller
        let controller = <PhpmdController> {};
        controller.validate = validate;

        // Fake logger
        let logger = <ILogger> {};
        logger.error = (message: string, isVerbose?: boolean): ILogger => {
            expect(message).to.contain("Test error");
            expect(isVerbose).to.be.undefined;
            done();

            return <ILogger> {};
        };
        logger.info = (message: string, isVerbose?: boolean): ILogger => { return <ILogger> {}; };
        logger.setVerbose = (verbose: boolean) => { return <ILogger> {}; };

        // Logger factory
        let loggerFactory = <ILoggerFactory> {};
        loggerFactory.create = (): ILogger => {
            return logger;
        };
        loggerFactory.setConnection = (connection: IConnection) => { return; };
        loggerFactory.setVerbose = (verbose: boolean) => { return; };

        // Create and configure server
        let server = new Server();
        server.setDocumentsManager(documentsManager);
        server.setConnection(connection);
        server.setController(controller);
        server.setLoggerFactory(loggerFactory);

        // Act
        server.main();
    }

    @test("Should throw error if validation on save text document fails")
    public assertValidateErrorOnDidSaveTextDocument(done) {
        // Arrange
        // =======
        // Fake parameters
        let parameters = <any> {
            textDocument: <TextDocumentIdentifier> {}
        };

        // Stub connection.onDidSaveTextDocument
        let onDidSaveTextDocumentStub = sinon.stub();
        onDidSaveTextDocumentStub.callsArgWith(0, parameters);

        // Fake documentsManager
        let document = <TextDocument> {};
        let documentsManager = <TextDocuments> {};
        documentsManager.all = () => {
            return <TextDocument[]> [document];
        };

        // DocumentsManager listen spy
        let dmListenSpy = sinon.spy();
        documentsManager.listen = dmListenSpy;

        // Fake connection
        let connection = <IConnection> {};
        connection.onDidChangeConfiguration = () => { /* Fake */ };
        connection.onDidOpenTextDocument = () => { /* Fake */ };
        connection.onDidSaveTextDocument = onDidSaveTextDocumentStub;
        connection.onDidCloseTextDocument = () => { /* Fake */ };
        connection.onInitialize = () => { /* Fake */ };
        connection.listen = () => { /* Fake */ };

        // Validate stub
        let validate = sinon.stub();
        validate.returns(Promise.reject(Error("Test error")));

        // Fake controller
        let controller = <PhpmdController> {};
        controller.validate = validate;

        // Fake logger
        let logger = <ILogger> {};
        logger.error = (message: string, isVerbose?: boolean): ILogger => {
            expect(message).to.contain("Test error");
            expect(isVerbose).to.be.undefined;
            done();

            return <ILogger> {};
        };
        logger.info = (message: string, isVerbose?: boolean): ILogger => { return <ILogger> {}; };
        logger.setVerbose = (verbose: boolean) => { return <ILogger> {}; };

        // Logger factory
        let loggerFactory = <ILoggerFactory> {};
        loggerFactory.create = (): ILogger => {
            return logger;
        };
        loggerFactory.setConnection = (connection: IConnection) => { return; };
        loggerFactory.setVerbose = (verbose: boolean) => { return; };

        // Create and configure server
        let server = new Server();
        server.setDocumentsManager(documentsManager);
        server.setConnection(connection);
        server.setController(controller);
        server.setLoggerFactory(loggerFactory);

        // Act
        server.main();
    }

    @test("Should throw error if controller not initialized on get")
    public assertErrorOnControllerNotInitialized(done) {
        // Arrange
        // =======
        // Fake parameters
        let parameters = <any> {
            textDocument: <TextDocumentIdentifier> {}
        };

        // Stub connection.onDidSaveTextDocument
        let onDidSaveTextDocumentStub = sinon.stub();
        onDidSaveTextDocumentStub.callsArgWith(0, parameters);

        // Fake documentsManager
        let document = <TextDocument> {};
        let documentsManager = <TextDocuments> {};
        documentsManager.all = () => {
            return <TextDocument[]> [document];
        };

        // DocumentsManager listen spy
        let dmListenSpy = sinon.spy();
        documentsManager.listen = dmListenSpy;

        // Fake connection
        let connection = <IConnection> {};
        connection.onDidChangeConfiguration = () => { /* Fake */ };
        connection.onDidOpenTextDocument = () => { /* Fake */ };
        connection.onDidSaveTextDocument = onDidSaveTextDocumentStub;
        connection.onDidCloseTextDocument = () => { /* Fake */ };
        connection.onInitialize = () => { /* Fake */ };
        connection.listen = () => { /* Fake */ };

        // Create and configure server
        let server = new Server();
        server.setDocumentsManager(documentsManager);
        server.setConnection(connection);
        server.setLoggerFactory(new NullLoggerFactory());

        // Act
        try {
            server.main();
        } catch (e) {
            expect(e.message).to.equal("Controller not initialized. Aborting.");
            done();
        }
    }
}
