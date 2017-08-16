import { assert, expect } from "chai";
import { only, skip, slow, suite, test, timeout } from "mocha-typescript";
import * as sinon from "sinon";
import { IConnection } from "vscode-languageserver";
import NullLoggerFactory from "../../server/factory/NullLoggerFactory";
import NullLogger from "../../server/service/logger/NullLogger";

@suite("Null logger factory")
class NullLoggerFactoryTest {

    @test("Should create NullLogger instance")
    public assertCreate() {
        // Arrange
        // =======
        // Fake connection
        let connection = <IConnection> {};

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
