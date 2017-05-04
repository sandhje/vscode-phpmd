import { assert, expect } from "chai";
import * as Process from "child_process";
import { only, skip, slow, suite, test, timeout } from "mocha-typescript";
import * as sinon from "sinon";
import * as stream from "stream";
import PipelinePayloadModel from "../../../src/model/PipelinePayloadModel";
import ExecuteProcessStrategy from "../../../src/service/pipeline/ExecuteProcessStrategy";

@suite("ExectuteProcess strategy")
class ExecuteProcessStrategyTest {

    @test("Should resolve with an array of diagnostic instances")
    public assertResolveDiagnostics(done) {
        // Arrange
        // =======
        // Fake resolve callback
        let resolve = (output: PipelinePayloadModel) => {
            // Assert
            // ======
            expect(setEncodingSpy.called).to.be.true;
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

        // Set encoding spy
        let setEncodingSpy = sinon.spy();

        // On stub
        let onStub = sinon.stub();
        onStub.withArgs("data").callsArgWith(1, "Test data");
        onStub.withArgs("close").callsArg(1);

        // Fake process
        let process = <Process.ChildProcess> {};
        process.stdout = <stream.Readable> {};
        process.stdout.setEncoding = setEncodingSpy;
        process.stdout.on = onStub;

        // Fake executor
        let executor = (command: string) => {
            return process;
        }

        // Initialise strategy and configure
        let strategy = new ExecuteProcessStrategy(executable, rules);
        strategy.setExecutor(executor);

        // Act
        strategy.execute(input, resolve, reject);
    }
}
