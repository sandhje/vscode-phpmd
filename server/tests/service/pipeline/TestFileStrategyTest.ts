import { assert, expect } from "chai";
import { only, skip, slow, suite, test, timeout } from "mocha-typescript";
import * as sinon from "sinon";
import PipelineErrorModel from "../../../src/model/PipelineErrorModel";
import PipelinePayloadModel from "../../../src/model/PipelinePayloadModel";
import TestFileStrategy from "../../../src/service/pipeline/TestFileStrategy";

@suite("Test file strategy")
class TestFileStrategyTest {

    @test("Should resolve if the file is readable")
    public assertResolveTest(done) {
        // Arrange
        // =======
        // Fake resolve callback
        let resolve = (output: PipelinePayloadModel) => {
            // Assert
            // ======
            expect(output).to.equal(input);
            done();
        };

        // Fake reject callback
        let reject = (reason: any) => {
            // Nothing to do here, test will fail because of absence of done
        };

        // Fake input
        let input = <PipelinePayloadModel> {};
        input.uri = "test.php";

        // Readfile stub
        let readfile = sinon.stub();
        readfile.callsArgWith(2, null, input);

        // Create and configure strategy instance
        let strategy = new TestFileStrategy(readfile);

        // Act
        strategy.execute(input, resolve, reject);
    }

    @test("Should reject if the file is not readable")
    public assertRejectTest(done) {
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
            expect(reason.silent).to.be.true;
            done();
        };

        // Fake input
        let input = <PipelinePayloadModel> {};
        input.uri = "test.php";

        // Readfile stub
        let readfile = sinon.stub();
        readfile.callsArgWith(2, Error("Test error"), input);

        // Create and configure strategy instance
        let strategy = new TestFileStrategy(readfile);

        // Act
        strategy.execute(input, resolve, reject);
    }
}
