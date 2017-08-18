import { assert, expect } from "chai";
import { only, skip, slow, suite, test, timeout } from "mocha-typescript";
import * as sinon from "sinon";
import NullNotifier from "../../../server/service/notifier/NullNotifier";

@suite("Null notifier")
class NullNotifierTest {

    @test("Should not send an error notification")
    public assertError() {
        // Arrange
        // =======
        let notifier = new NullNotifier();

        // Act
        notifier.error("Test error");

        // Assert
        // Nothing to assert here, just validate that the method can run without problems
    }
}
