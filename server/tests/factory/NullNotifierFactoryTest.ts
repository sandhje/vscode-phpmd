import { assert, expect } from "chai";
import { only, skip, slow, suite, test, timeout } from "mocha-typescript";
import * as sinon from "sinon";
import NullNotifierFactory from "../../src/factory/NullNotifierFactory";
import NullNotifier from "../../src/service/notifier/NullNotifier";

@suite("Null notifier factory")
class NullNotifierFactoryTest {

    @test("Should create NullNotifier instance")
    public assertCreate() {
        // Arrange
        let factory = new NullNotifierFactory();

        // Act
        let notifier = factory.create();

        // Assert
        expect(notifier).to.be.instanceof(NullNotifier);
    }
}
