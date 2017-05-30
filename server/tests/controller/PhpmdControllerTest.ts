import { Pipeline } from "@open-sourcerers/j-stillery";
import { assert, expect } from "chai";
import { only, skip, slow, suite, test, timeout } from "mocha-typescript";
import * as sinon from "sinon";
import { Diagnostic, IConnection, Position, Range, TextDocumentIdentifier } from "vscode-languageserver";
import PhpmdController from "../../src/controller/PhpmdController";
import PipelinePayloadFactory from "../../src/factory/PipelinePayloadFactory";
import IPhpmdSettingsModel from "../../src/model/IPhpmdSettingsModel";
import PipelinePayloadModel from "../../src/model/PipelinePayloadModel";
import NullLogger from "../../src/service/logger/NullLogger";
import NullNotifier from "../../src/service/notifier/NullNotifier";
import PhpmdService from "../../src/service/PhpmdService";

@suite("PhpMD controller")
class PhpmdControllerTest {

    @test("Should send diagnostics")
    public assertSendDiagnostics(done) {
        // Arrange
        // =======
        // Fake settings
        let settings = <IPhpmdSettingsModel> {
            command: "test",
            rules: "cleancode,codesize,controversial,design,unusedcode,naming",
            verbose: true
        };

        // Fake document
        let document = <TextDocumentIdentifier> {
            uri: "test"
        };

        // Fake diagnostic
        let diagnostic = <Diagnostic> {};
        diagnostic.range = <Range> {
            end: {
                character: Number.MAX_VALUE,
                line: 0
            },
            start: {
                character: 0,
                line: 0
            }
        };
        diagnostic.severity = 1;
        diagnostic.code = null;
        diagnostic.source = "Test";
        diagnostic.message = "Lorem ipsum dolor";

        // GetVersion stub
        let testPhpmdStub = sinon.stub();
        testPhpmdStub.returns(Promise.resolve(true));

        // Fake service
        let service = <PhpmdService> {};
        service.testPhpmd = testPhpmdStub;

        // Fake pipeline payload
        let payload = <PipelinePayloadModel> {};
        payload.uri = document.uri;
        payload.diagnostics = <Diagnostic[]> [diagnostic];

        // Stub connection
        let connection = <IConnection> {};
        connection.sendDiagnostics = (params) => {
            // Assert
            // ======
            // Expect params to match fakes
            expect(params.uri).to.equal(document.uri);
            expect(params.diagnostics).to.equal(payload.diagnostics);
        };

        // Stub pipeline payload factory
        let pipelinePayloadFactory = <PipelinePayloadFactory> {};
        pipelinePayloadFactory.setUri = (uri: string) => { return pipelinePayloadFactory; };
        pipelinePayloadFactory.create = () => { return payload; };

        // Stub pipeline
        let pipeline = new Pipeline<PipelinePayloadModel>();

        // Create and configure controller
        let controller = new PhpmdController(connection, settings);
        controller.setPipeline(pipeline);
        controller.setPipelinePayloadFactory(pipelinePayloadFactory);
        controller.setLogger(new NullLogger());
        controller.setService(service);

        // Act
        // ===
        controller.Validate(document).then((result) => {
            // Assert
            // ======
            // Expect result to equal true
            expect(result).to.equal(true);
            done();
        });
    }

    @test("Should test PHPMD command")
    public assertTestPhpmd(done) {
        // Arrange
        // =======
        // Fake settings
        let settings = <IPhpmdSettingsModel> {
            command: "test",
            rules: "cleancode,codesize,controversial,design,unusedcode,naming",
            verbose: true
        };

        // Fake document
        let document = <TextDocumentIdentifier> {
            uri: "test"
        };

        // GetVersion stub
        let testPhpmdStub = sinon.stub();
        testPhpmdStub.returns(Promise.reject(Error("Test error")));

        // Fake service
        let service = <PhpmdService> {};
        service.testPhpmd = testPhpmdStub;

        // Stub connection
        let connection = <IConnection> {};

        // Create and configure controller
        let controller = new PhpmdController(connection, settings);
        controller.setLogger(new NullLogger());
        controller.setNotifier(new NullNotifier());
        controller.setService(service);

        // Act
        // ===
        controller.Validate(document).then(null, (err: Error) => {
            // Assert
            // ======
            expect(err.message).to.equal("Test error");
            done();
        });
    }

    @test("Should reject on error in pipeline")
    public assertRejectOnError(done) {
        // Arrange
        // =======
        // Fake settings
        let settings = <IPhpmdSettingsModel> {
            command: "test",
            rules: "cleancode,codesize,controversial,design,unusedcode,naming",
            verbose: true
        };

        // Fake document
        let document = <TextDocumentIdentifier> {
            uri: "test"
        };

        // GetVersion stub
        let testPhpmdStub = sinon.stub();
        testPhpmdStub.returns(Promise.resolve(true));

        // Fake service
        let service = <PhpmdService> {};
        service.testPhpmd = testPhpmdStub;

        // Fake pipeline payload
        let payload = <PipelinePayloadModel> {};
        payload.uri = document.uri;

        // Stub connection
        let connection = <IConnection> {};

        // Stub pipeline payload factory
        let pipelinePayloadFactory = <PipelinePayloadFactory> {};
        pipelinePayloadFactory.setUri = (uri: string) => { return pipelinePayloadFactory; };
        pipelinePayloadFactory.create = () => { return payload; };

        // Stub pipeline run
        let runStub = sinon.stub();
        runStub.rejects(Error("Test error"));

        // Stub pipeline
        let pipeline = new Pipeline<PipelinePayloadModel>();
        pipeline.run = runStub;

        // Create and configure controller
        let controller = new PhpmdController(connection, settings);
        controller.setPipeline(pipeline);
        controller.setPipelinePayloadFactory(pipelinePayloadFactory);
        controller.setService(service);

        // Act
        // ===
        controller.Validate(document).then(null, (err) => {
            // Assert
            // ======
            expect(err.message).to.equal("Test error");
            done();
        });
    }
};
