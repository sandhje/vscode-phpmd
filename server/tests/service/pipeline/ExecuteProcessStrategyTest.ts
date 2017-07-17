import { assert, expect } from "chai";
import * as Process from "child_process";
import { only, skip, slow, suite, test, timeout } from "mocha-typescript";
import * as sinon from "sinon";
import PipelineErrorModel from "../../../src/model/PipelineErrorModel";
import PipelinePayloadModel from "../../../src/model/PipelinePayloadModel";
import PhpmdService from "../../../src/service/PhpmdService";
import ExecuteProcessStrategy from "../../../src/service/pipeline/ExecuteProcessStrategy";

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

        // Fake rules
        let rules = "testRules";

        // Fake input
        let input = <PipelinePayloadModel> {};
        input.uri = "/test/uri";

        // Run stub
        let runStub = sinon.stub();
        runStub.calledWithExactly("testExecutable /test/uri testRules");
        runStub.returns(Promise.resolve("Test data"));

        // Fake service
        let service = <PhpmdService> {};
        service.run = runStub;

        // Initialise strategy and configure
        let strategy = new ExecuteProcessStrategy(executable, rules);
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
            expect(reason.error.message).to.equal("Test error");
            expect(reason.silent).to.be.false;
            done();
        };

        // Fake executable
        let executable = "testExecutable";

        // Fake rules
        let rules = "testRules";

        // Fake input
        let input = <PipelinePayloadModel> {};
        input.uri = "/test/uri";

        // Run stub
        let runStub = sinon.stub();
        runStub.calledWithExactly("testExecutable /test/uri testRules");
        runStub.returns(Promise.reject(Error("Test error")));

        // Fake service
        let service = <PhpmdService> {};
        service.run = runStub;

        // Initialise strategy and configure
        let strategy = new ExecuteProcessStrategy(executable, rules);
        strategy.setService(service);

        // Act
        strategy.execute(input, resolve, reject);
    }
}
