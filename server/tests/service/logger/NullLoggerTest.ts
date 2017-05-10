import { assert, expect } from "chai";
import { only, skip, slow, suite, test, timeout } from "mocha-typescript";
import * as sinon from "sinon";
import NullLogger from "../../../src/service/logger/NullLogger";

@suite("NullLogger service")
class NullLoggerTest {

    @test("Should provide a null implementation of ILogger")
    public assertImplementILogger() {
        // Arrange
        let logger = new NullLogger();

        // Act
        logger.setVerbose(true)
            .error("error")
            .info("info")
            .log("log")
            .warn("warn");

        // Assert
        expect(logger.getVerbose()).to.be.true;
    }
}
