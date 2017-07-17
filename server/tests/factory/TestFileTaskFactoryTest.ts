import { Task } from "@open-sourcerers/j-stillery";
import { assert, expect } from "chai";
import { only, skip, slow, suite, test, timeout } from "mocha-typescript";
import * as sinon from "sinon";
import TestFileTaskFactory from "../../src/factory/TestFileTaskFactory";
import IPhpmdSettingsModel from "../../src/model/IPhpmdSettingsModel";

@suite("TestFileTask factory")
class TestFileTaskFactoryTest {

    @test("Should create TestFileTask instance")
    public assertCreate() {
        // Arrange
        // =======
        // Fake settings
        let settings = <IPhpmdSettingsModel> {
            command: "test",
            rules: "test",
            verbose: true
        };

        // Create and configure factory instance
        let factory = new TestFileTaskFactory(settings);

        // Act
        let task = factory.create();

        // Assert
        expect(task).to.be.instanceof(Task);
    }
}