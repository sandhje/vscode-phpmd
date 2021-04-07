import { assert, expect } from "chai";
import * as Process from "child_process";
import { only, skip, slow, suite, test, timeout } from "@testdeck/mocha";
import * as sinon from "sinon";
import PipelineErrorModel from "../../../server/model/PipelineErrorModel";
import PipelinePayloadModel from "../../../server/model/PipelinePayloadModel";
import PhpmdService from "../../../server/service/PhpmdService";
import ExecuteProcessStrategy from "../../../server/service/pipeline/ExecuteProcessStrategy";
import { URI } from "vscode-uri";
import PhpmdCommandBuilder from "../../../server/service/PhpmdCommandBuilder";

@suite("ExectuteProcess strategy")
class ExecuteProcessStrategyTest {

    @test("Should resolve with an array of diagnostic instances")
    public assertResolveExecute(done) {
        // Arrange
        // =======
        // Fake resolve callback
        let resolve = (output: PipelinePayloadModel) => {
            // Assert
            // ======
            expect(runStub.calledWithExactly(`"${URI.parse("testUri").fsPath}" xml "testRules"`)).to.be.true;
            expect(runStub.calledOnce).to.be.true;
            expect(output.raw).to.equal("Test data");
            done();
        };

        // Fake reject callback
        let reject = (reason: any) => {
            // Nothing to do here, test will fail because of absence of done
        };

        // Fake executable
        let executable = "testExecutable";

        // Fake commandBuilder
        let commandBuilderFake: PhpmdCommandBuilder = new PhpmdCommandBuilder(executable, [], "");

        // Fake rules
        let rules = "testRules";

        // Fake input
        let input = new PipelinePayloadModel("testUri");

        // Run stub
        let runStub = sinon.stub();
        runStub.returns(Promise.resolve("Test data"));

        // Fake service
        let service = <PhpmdService> {};
        service.run = runStub;

        // Initialise strategy and configure
        let strategy = new ExecuteProcessStrategy(commandBuilderFake, rules);
        strategy.setService(service);

        // Act
        strategy.execute(input, resolve, reject);
    }

    @test("Should reject with a PipelineErrorModel instance")
    public assertRejectExecute(done) {
        // Arrange
        // =======
        // Fake resolve callback
        let resolve = (output: PipelinePayloadModel) => {
            // Nothing to do here, test will fail because of absence of done
        };

        // Fake reject callback
        let reject = (reason: PipelineErrorModel) => {
            // Assert
            // ======
            expect(runStub.calledWithExactly(`"${URI.parse("testUri").fsPath}" xml "testRules"`)).to.be.true;
            expect(reason.error.message).to.equal("Test error");
            expect(reason.silent).to.be.false;
            done();
        };

        // Fake executable
        let executable = "testExecutable";

        // Fake commandBuilder
        let commandBuilderFake: PhpmdCommandBuilder = new PhpmdCommandBuilder(executable, [], "");

        // Fake rules
        let rules = "testRules";

        // Fake input
        let input = new PipelinePayloadModel("testUri");

        // Run stub
        let runStub = sinon.stub();
        runStub.returns(Promise.reject(Error("Test error")));

        // Fake service
        let service = <PhpmdService> {};
        service.run = runStub;

        // Initialise strategy and configure
        let strategy = new ExecuteProcessStrategy(commandBuilderFake, rules);
        strategy.setService(service);

        // Act
        strategy.execute(input, resolve, reject);
    }

    @test("Should left trim the xml result")
    public assertLtrimXML(done) {
        // Arrange
        // =======
        // Fake resolve callback
        let resolve = (output: PipelinePayloadModel) => {
            // Assert
            // ======
            expect(output.raw).to.equal("<?xml><root>Test data</root>");
            done();
        };

        // Fake reject callback
        let reject = (reason: any) => {
            // Nothing to do here, test will fail because of absence of done
        };

        // Fake executable
        let executable = "testExecutable";

        // Fake commandBuilder
        let commandBuilderFake: PhpmdCommandBuilder = new PhpmdCommandBuilder(executable, [], "");

        // Fake rules
        let rules = "testRules";

        // Fake input
        let input = new PipelinePayloadModel("testUri");

        // Run stub
        let runStub = sinon.stub();
        runStub.returns(Promise.resolve("Test ltrimXML <?xml><root>Test data</root>"));

        // Fake service
        let service = <PhpmdService> {};
        service.run = runStub;

        // Initialise strategy and configure
        let strategy = new ExecuteProcessStrategy(commandBuilderFake, rules);
        strategy.setService(service);

        // Act
        strategy.execute(input, resolve, reject);
    }
}
