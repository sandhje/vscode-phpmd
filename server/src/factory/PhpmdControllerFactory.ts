import { IConnection } from "vscode-languageserver";
import PhpmdController from "../controller/PhpmdController";
import IPhpmdSettingsModel from "../model/IPhpmdSettingsModel";
import IFactory from "./IFactory";

class PhpmdControllerFactory implements IFactory<PhpmdController> {
    private connection: IConnection;
    private settings: IPhpmdSettingsModel;

    public create(): PhpmdController {
        if (!this.connection) {
            throw Error("Unable to create PhpmdController, no connection set");
        }

        if (!this.settings) {
            throw Error("Unable to create PhpmdController, no settings set");
        }

        return new PhpmdController(this.connection, this.settings);
    }

    public setConnection(connection: IConnection) {
        this.connection = connection;
    }

    public setSettings(settings: IPhpmdSettingsModel) {
        this.settings = settings;
    }
}

export default PhpmdControllerFactory;
