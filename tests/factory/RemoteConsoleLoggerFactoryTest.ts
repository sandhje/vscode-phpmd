import { assert, expect } from "chai";
import { only, skip, slow, suite, test, timeout } from "mocha-typescript";
import * as sinon from "sinon";
import { IConnection } from "vscode-languageserver";
import RemoteConsoleLoggerFactory from "../../server/factory/RemoteConsoleLoggerFactory";
import ILogger from "../../server/service/logger/ILogger";
import RemoteConsoleLogger from "../../server/service/logger/RemoteConsoleLogger";

@suite("RemoteConsoleLogger factory")
class RemoteConsoleLoggerFactoryTest {

    @test("Should create RemoteConsoleLogger instance")
    public assertCreate() {
        // Arrange
        // =======
        // Fake connection
        let connection = <IConnection> {};
        connection.console = <ILogger> {};

        // Create factory instance and configure
        let factory = new RemoteConsoleLoggerFactory();
        factory.setConnection(connection);
        factory.setVerbose(false);

        // Act
        let logger = factory.create();

        // Assert
        expect(logger).to.be.instanceof(RemoteConsoleLogger);
    }
}
