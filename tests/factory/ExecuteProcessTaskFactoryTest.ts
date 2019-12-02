import { Task } from "@open-sourcerers/j-stillery";
import { assert, expect } from "chai";
import { only, skip, slow, suite, test, timeout } from "mocha-typescript";
import * as sinon from "sinon";
import ExecuteProcessTaskFactory from "../../server/factory/ExecuteProcessTaskFactory";
import IPhpmdSettingsModel from "../../server/model/IPhpmdSettingsModel";
import IPhpmdEnvironmentModel from "../../server/model/IPhpmdEnvironmentModel";
import { WorkspaceFolder } from "vscode-languageserver";

@suite("ExecuteProcessTask factory")
class ExecuteProcessTaskFactoryTest {

    @test("Should create ExecuteProcessTask instance")
    public assertCreate() {
        // Arrange
        // =======
        // Fake settings
        let settings = <IPhpmdSettingsModel> {
            command: "test",
            rules: "test",
            verbose: true
        };

        // Fake environment
        let environment = <IPhpmdEnvironmentModel> {
            homeDir: "/home/JohnDoe",
            workspaceFolders: <WorkspaceFolder[]> [
                {
                    name: "www",
                    uri: "file://var/www"
                }
            ]
        };

        // Create and configure factory instance
        let factory = new ExecuteProcessTaskFactory(settings, environment);

        // Act
        let task = factory.create();

        // Assert
        expect(task).to.be.instanceof(Task);
    }
}