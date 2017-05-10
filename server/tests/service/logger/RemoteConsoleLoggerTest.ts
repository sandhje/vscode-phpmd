import { assert, expect } from "chai";
import { only, skip, slow, suite, test, timeout } from "mocha-typescript";
import * as sinon from "sinon";
import { RemoteConsole } from "vscode-languageserver";
import RemoteConsoleLogger from "../../../src/service/logger/RemoteConsoleLogger";

@suite("RemoteConsoleLogger service")
class RemoteConsoleLoggerTest {

    @test("Should get/set verbose flag")
    public assertVerbose() {
        // Arrange
        // =======
        // Fake remote console
        let remoteConsole = <RemoteConsole> {};

        // Create logger
        let logger = new RemoteConsoleLogger(remoteConsole);

        // Act
        logger.setVerbose(true);

        // Assert
        expect(logger.getVerbose()).to.be.true;
    }

    @test("Should log error messages to the remote console")
    public assertError() {
        // Arrange
        // =======
        // Spy error method
        let errorSpy = sinon.spy();

        // Fake remote console
        let remoteConsole = <RemoteConsole> {};
        remoteConsole.error = errorSpy;

        // Create logger instance
        let logger = new RemoteConsoleLogger(remoteConsole);

        // Act
        logger.error("error"); // log regular error
        logger.error("verbose error", true); // log verbose error

        // Assert
        expect(errorSpy.calledOnce).to.be.true;
        expect(errorSpy.calledWithExactly("error")).to.be.true;
    }

    @test("Should log verbose error messages to the remote console")
    public assertErrorVerbose() {
        // Arrange
        // =======
        // Spy error method
        let errorSpy = sinon.spy();

        // Fake remote console
        let remoteConsole = <RemoteConsole> {};
        remoteConsole.error = errorSpy;

        // Create logger instance
        let logger = new RemoteConsoleLogger(remoteConsole, true);

        // Act
        logger.error("error"); // log regular error
        logger.error("verbose error", true); // log verbose error

        // Assert
        expect(errorSpy.calledTwice).to.be.true;
        expect(errorSpy.calledWithExactly("error")).to.be.true;
        expect(errorSpy.calledWithExactly("verbose error")).to.be.true;
    }

    @test("Should log warning messages to the remote console")
    public assertWarn() {
        // Arrange
        // =======
        // Spy warn method
        let warnSpy = sinon.spy();

        // Fake remote console
        let remoteConsole = <RemoteConsole> {};
        remoteConsole.warn = warnSpy;

        // Create logger instance
        let logger = new RemoteConsoleLogger(remoteConsole);

        // Act
        logger.warn("warn"); // log regular warning
        logger.warn("verbose warn", true); // log verbose warning

        // Assert
        expect(warnSpy.calledOnce).to.be.true;
        expect(warnSpy.calledWithExactly("warn")).to.be.true;
    }

    @test("Should log verbose warning messages to the remote console")
    public assertWarnVerbose() {
        // Arrange
        // =======
        // Spy warn method
        let warnSpy = sinon.spy();

        // Fake remote console
        let remoteConsole = <RemoteConsole> {};
        remoteConsole.warn = warnSpy;

        // Create logger instance
        let logger = new RemoteConsoleLogger(remoteConsole, true);

        // Act
        logger.warn("warn"); // log regular warning
        logger.warn("verbose warn", true); // log verbose warning

        // Assert
        expect(warnSpy.calledTwice).to.be.true;
        expect(warnSpy.calledWithExactly("warn")).to.be.true;
        expect(warnSpy.calledWithExactly("verbose warn")).to.be.true;
    }

    @test("Should log info messages to the remote console")
    public assertInfo() {
        // Arrange
        // =======
        // Spy info method
        let infoSpy = sinon.spy();

        // Fake remote console
        let remoteConsole = <RemoteConsole> {};
        remoteConsole.info = infoSpy;

        // Create logger instance
        let logger = new RemoteConsoleLogger(remoteConsole);

        // Act
        logger.info("info"); // log regular info message
        logger.info("verbose info", true); // log verbose info message

        // Assert
        expect(infoSpy.calledOnce).to.be.true;
        expect(infoSpy.calledWithExactly("info")).to.be.true;
    }

    @test("Should log verbose info messages to the remote console")
    public assertInfoVerbose() {
        // Arrange
        // =======
        // Spy info method
        let infoSpy = sinon.spy();

        // Fake remote console
        let remoteConsole = <RemoteConsole> {};
        remoteConsole.info = infoSpy;

        // Create logger instance
        let logger = new RemoteConsoleLogger(remoteConsole, true);

        // Act
        logger.info("info"); // log regular info message
        logger.info("verbose info", true); // log verbose info message

        // Assert
        expect(infoSpy.calledTwice).to.be.true;
        expect(infoSpy.calledWithExactly("info")).to.be.true;
        expect(infoSpy.calledWithExactly("verbose info")).to.be.true;
    }

    @test("Should log log messages to the remote console")
    public assertLog() {
        // Arrange
        // =======
        // Spy log method
        let logSpy = sinon.spy();

        // Fake remote console
        let remoteConsole = <RemoteConsole> {};
        remoteConsole.log = logSpy;

        // Create logger instance
        let logger = new RemoteConsoleLogger(remoteConsole);

        // Act
        logger.log("log"); // log regular log message
        logger.log("verbose log", true); // log verbose log message

        // Assert
        expect(logSpy.calledOnce).to.be.true;
        expect(logSpy.calledWithExactly("log")).to.be.true;
    }

    @test("Should log verbose log messages to the remote console")
    public assertLogVerbose() {
        // Arrange
        // =======
        // Spy log method
        let logSpy = sinon.spy();

        // Fake remote console
        let remoteConsole = <RemoteConsole> {};
        remoteConsole.log = logSpy;

        // Create logger instance
        let logger = new RemoteConsoleLogger(remoteConsole, true);

        // Act
        logger.log("log"); // log regular log message
        logger.log("verbose log", true); // log verbose log message

        // Assert
        expect(logSpy.calledTwice).to.be.true;
        expect(logSpy.calledWithExactly("log")).to.be.true;
        expect(logSpy.calledWithExactly("verbose log")).to.be.true;
    }
}
