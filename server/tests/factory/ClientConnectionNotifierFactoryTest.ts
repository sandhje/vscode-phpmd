import { assert, expect } from "chai";
import { only, skip, slow, suite, test, timeout } from "mocha-typescript";
import * as sinon from "sinon";
import { IConnection } from "vscode-languageserver";
import ClientConnectionNotifierFactory from "../../src/factory/ClientConnectionNotifierFactory";
import ClientConnectionNotifier from "../../src/service/notifier/ClientConnectionNotifier";

@suite("Client connection notifier factory")
class ClientConnectionNotifierFactoryTest {

    @test("Should create ClientConnectionNotifier instance")
    public assertCreate() {
        // Arrange
        // =======
        // Fake connection
        let connection = <IConnection> {};

        let factory = new ClientConnectionNotifierFactory();
        factory.setConnection(connection);

        // Act
        let notifier = factory.create();

        // Assert
        expect(notifier).to.be.instanceof(ClientConnectionNotifier);
    }
}
