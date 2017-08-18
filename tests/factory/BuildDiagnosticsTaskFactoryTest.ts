import { Task } from "@open-sourcerers/j-stillery";
import { assert, expect } from "chai";
import { only, skip, slow, suite, test, timeout } from "mocha-typescript";
import * as sinon from "sinon";
import BuildDiagnosticsTaskFactory from "../../server/factory/BuildDiagnosticsTaskFactory";
import IPhpmdSettingsModel from "../../server/model/IPhpmdSettingsModel";

@suite("BuildDiagnosticsTask factory")
class BuildDiagnosticsTaskFactoryTest {

    @test("Should create BuildDiagnosticTask instance")
    public assertCreate() {
        // Arrange
        // =======
        // Fake settings
        let settings = <IPhpmdSettingsModel> {};

        // Create and configure factory instance
        let factory = new BuildDiagnosticsTaskFactory(settings);

        // Act
        let task = factory.create();

        // Assert
        expect(task).to.be.instanceof(Task);
    }
}