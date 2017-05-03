import { Task } from "@open-sourcerers/j-stillery";
import { assert, expect } from "chai";
import { only, skip, slow, suite, test, timeout } from "mocha-typescript";
import * as sinon from "sinon";
import ParseTaskFactory from "../../src/factory/ParseTaskFactory";
import IPhpmdSettingsModel from "../../src/model/IPhpmdSettingsModel";

@suite("ParseTask factory")
class ParseTaskFactoryTest {

    @test("Should create ParseTask instance")
    public assertCreate() {
        // Arrange
        // =======
        // Fake settings
        let settings = <IPhpmdSettingsModel> {
            executable: "test",
            rules: "test"
        };

        // Create and configure factory instance
        let factory = new ParseTaskFactory(settings);

        // Act
        let task = factory.create();

        // Assert
        expect(task).to.be.instanceof(Task);
    }
}