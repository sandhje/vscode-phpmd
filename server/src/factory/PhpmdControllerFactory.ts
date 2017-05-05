import { IConnection } from "vscode-languageserver";
import PhpmdController from "../controller/PhpmdController";
import IPhpmdSettingsModel from "../model/IPhpmdSettingsModel";
import IFactory from "./IFactory";

class PhpmdControllerFactory implements IFactory<PhpmdController> {
    constructor(
        private connection: IConnection,
        private settings: IPhpmdSettingsModel
    ) { }

    public create(): PhpmdController {
        return new PhpmdController(this.connection, this.settings);
    }
}

export default PhpmdControllerFactory;
