import { assert, expect } from "chai";
import { only, skip, slow, suite, test, timeout } from "mocha-typescript";
import * as sinon from "sinon";
import { IConnection, MessageType, ShowMessageNotification } from "vscode-languageserver";
import ClientConnectionNotifier from "../../../server/service/notifier/ClientConnectionNotifier";

@suite("Client connection notifier")
class ClientConnectionNotifierTest {

    @test("Should send an error notification")
    public assertError() {
        // Arrange
        // =======
        // Send notification spy
        let sendNotificationSpy = sinon.spy();

        // Fake connection
        let connection = <IConnection> {};
        connection.sendNotification = sendNotificationSpy;

        // Act
        let notifier = new ClientConnectionNotifier(connection);
        notifier.error("Test error");

        // Assert
        expect(sendNotificationSpy.calledOnce).to.be.true;
        expect(sendNotificationSpy.calledWithExactly(ShowMessageNotification.type, {
            message: "Test error",
            type: MessageType.Error
        })).to.be.true;
    }
}
