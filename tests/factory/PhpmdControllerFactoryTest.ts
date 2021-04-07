import { Task } from "@open-sourcerers/j-stillery";
import { assert, expect } from "chai";
import { only, skip, slow, suite, test, timeout } from "@testdeck/mocha";
import * as sinon from "sinon";
import { IConnection } from "vscode-languageserver";
import PhpmdController from "../../server/controller/PhpmdController";
import PhpmdControllerFactory from "../../server/factory/PhpmdControllerFactory";
import IPhpmdSettingsModel from "../../server/model/IPhpmdSettingsModel";

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
