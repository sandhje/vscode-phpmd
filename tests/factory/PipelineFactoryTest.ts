import { Pipeline } from "@open-sourcerers/j-stillery";
import { assert, expect } from "chai";
import { only, skip, slow, suite, test, timeout } from "mocha-typescript";
import * as sinon from "sinon";
import { IConnection } from "vscode-languageserver";
import PipelineFactory from "../../server/factory/PipelineFactory";
import IPhpmdSettingsModel from "../../server/model/IPhpmdSettingsModel";
import IPhpmdEnvironmentModel from "../../server/model/IPhpmdEnvironmentModel";

@suite("Pipeline factory")
class PipelineFactoryTest {

    @test("Should create Pipeline instance")
    public assertCreate() {
        // Arrange
        // =======
        // Fake settings
        let settings = <IPhpmdSettingsModel> {};

        // Fake environment
        let environment = <IPhpmdEnvironmentModel> {};

        // Create and configure factory instance
        let factory = new PipelineFactory(settings, environment);

        // Act
        let pipeline = factory.create();

        // Assert
        expect(pipeline).to.be.instanceof(Pipeline);
    }
}
