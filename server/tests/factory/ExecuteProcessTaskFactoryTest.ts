import { Task } from "@open-sourcerers/j-stillery";
import { assert, expect } from "chai";
import { only, skip, slow, suite, test, timeout } from "mocha-typescript";
import * as sinon from "sinon";
import ExecuteProcessTaskFactory from "../../src/factory/ExecuteProcessTaskFactory";
import IPhpmdSettingsModel from "../../src/model/IPhpmdSettingsModel";

@suite("ExecuteProcessTask factory")
class ExecuteProcessTaskFactoryTest {

    @test("Should create ExecuteProcessTask instance")
    public assertCreate() {
        // Arrange
        // =======
        // Fake settings
        let settings = <IPhpmdSettingsModel> {
            executable: "test",
            rules: "test"
        };

        // Create and configure factory instance
        let factory = new ExecuteProcessTaskFactory(settings);

        // Act
        let task = factory.create();

        // Assert
        expect(task).to.be.instanceof(Task);
    }
}