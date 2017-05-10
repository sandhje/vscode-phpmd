import { assert, expect } from "chai";
import { only, skip, slow, suite, test, timeout } from "mocha-typescript";
import * as sinon from "sinon";
import NullLoggerFactory from "../../src/factory/NullLoggerFactory";
import NullLogger from "../../src/service/logger/NullLogger";

@suite("Null factory")
class NullLoggerFactoryTest {

    @test("Should create NullLogger instance")
    public assertCreate() {
        // Arrange
        // =======
        // Fake connection
        let connection = {};

        // Create factory instance and configure
        let factory = new NullLoggerFactory();
        factory.setConnection(connection);
        factory.setVerbose(false);

        // Act
        let logger = factory.create();

        // Assert
        expect(logger).to.be.instanceof(NullLogger);
    }
}
