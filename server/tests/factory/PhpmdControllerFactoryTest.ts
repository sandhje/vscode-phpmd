import { Task } from "@open-sourcerers/j-stillery";
import { assert, expect } from "chai";
import { only, skip, slow, suite, test, timeout } from "mocha-typescript";
import * as sinon from "sinon";
import { IConnection } from "vscode-languageserver";
import PhpmdController from "../../src/controller/PhpmdController";
import PhpmdControllerFactory from "../../src/factory/PhpmdControllerFactory";
import IPhpmdSettingsModel from "../../src/model/IPhpmdSettingsModel";

@suite("PhpmdController factory")
class PhpmdControllerFactoryTest {

    @test("Should create PhpmdController instance")
    public assertCreate() {
        // Arrange
        // =======
        // Fake connnection
        let connection = <IConnection> {};

        // Fake settings
        let settings = <IPhpmdSettingsModel> {};

        // Create and configure factory instance
        let factory = new PhpmdControllerFactory();
        factory.setConnection(connection);
        factory.setSettings(settings);

        // Act
        let controller = factory.create();

        // Assert
        expect(controller).to.be.instanceof(PhpmdController);
    }
}
