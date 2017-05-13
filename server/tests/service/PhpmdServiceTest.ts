import { assert, expect } from "chai";
import * as Process from "child_process";
import { only, skip, slow, suite, test, timeout } from "mocha-typescript";
import * as sinon from "sinon";
import * as stream from "stream";
import PhpmdService from "../../src/service/PhpmdService";

@suite("PhpMD service")
class ServerTest {

    @test("Should run the command")
    public assertRun(done) {
        // Arrange
        // =======
        // Fake executable
        let executable = "testExecutable";

        // Fake options
        let options = "testOptions";

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

        // Executor stub
        let executor = sinon.stub();
        executor.returns(process);

        // Act
        let service = new PhpmdService(executable);
        service.setExecutor(executor);
        service.run(options).then((result) => {
            // Assert
            expect(executor.calledOnce).to.be.true;
            expect(executor.calledWithExactly(executable + " " + options)).to.be.true;
            expect(result).to.equal("Test data");
            done();
        });
    }

    @test("Should reject the result promise on error")
    public assertRejectError(done) {
        // Arrange
        // =======
        // Fake executable
        let executable = "testExecutable";

        // Fake options
        let options = "testOptions";

        // Set encoding spy
        let setEncodingSpy = sinon.spy();

        // On stub
        let onStub = sinon.stub();
        onStub.withArgs("data").callsArgWith(1, "Test data");
        onStub.withArgs("error").callsArgWith(1, Error("Test error"));

        // Fake process
        let process = <Process.ChildProcess> {};
        process.stdout = <stream.Readable> {};
        process.stdout.setEncoding = setEncodingSpy;
        process.stdout.on = onStub;

        // Executor stub
        let executor = sinon.stub();
        executor.returns(process);

        // Act
        let service = new PhpmdService(executable);
        service.setExecutor(executor);
        service.run(options).then(null, (err: Error) => {
            // Assert
            expect(err.message).to.equal("Test error");
            done();
        });
    }

    @test("Should reject the result promise on empty response")
    public assertRejectEmpty(done) {
        // Arrange
        // =======
        // Fake executable
        let executable = "testExecutable";

        // Fake options
        let options = "testOptions";

        // Set encoding spy
        let setEncodingSpy = sinon.spy();

        // On stub
        let onStub = sinon.stub();
        onStub.withArgs("close").callsArg(1);

        // Fake process
        let process = <Process.ChildProcess> {};
        process.stdout = <stream.Readable> {};
        process.stdout.setEncoding = setEncodingSpy;
        process.stdout.on = onStub;

        // Executor stub
        let executor = sinon.stub();
        executor.returns(process);

        // Act
        let service = new PhpmdService(executable);
        service.setExecutor(executor);
        service.run(options).then(null, (err: Error) => {
            // Assert
            expect(err.message).to.equal("Phpmd executable not found");
            done();
        });
    }

    @test("Should get the version")
    public assertGetVersion(done) {
        // Arrange
        // =======
        // Fake executable
        let executable = "testExecutable";

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

        // Executor stub
        let executor = sinon.stub();
        executor.returns(process);

        // Act
        let service = new PhpmdService(executable);
        service.setExecutor(executor);
        service.getVersion().then((result) => {
            // Assert
            expect(executor.calledOnce).to.be.true;
            expect(executor.calledWithExactly(executable + " --version")).to.be.true;
            expect(result).to.equal("Test data");
            done();
        });
    }
}
