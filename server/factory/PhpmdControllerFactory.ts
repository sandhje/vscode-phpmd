import { IConnection } from "vscode-languageserver";
import PhpmdController from "../controller/PhpmdController";
import IPhpmdSettingsModel from "../model/IPhpmdSettingsModel";
import IPhpmdEnvironmentModel from "../model/IPhpmdEnvironmentModel";
import IFactory from "./IFactory";

/**
 * PHP mess detector controller factory
 *
 * @module vscode-phpmd/server/factory
 * @author Sandhjé Bouw (sandhje@ecodes.io)
 */
class PhpmdControllerFactory implements IFactory<PhpmdController> {
    /**
     * @property {IConnection} connection
     */
    private connection: IConnection;

    /**
     * @property {IPhpmdSettingsModel} settings
     */
    private settings: IPhpmdSettingsModel;

    /**
     * @property {IPhpmdEnvironmentModel} environment
     */
    private environment: IPhpmdEnvironmentModel;

    /**
     * Create PHP mess detector controller instance
     *
     * @see IFaction::create
     * @returns {PhpmdController}
     */
    public create(): PhpmdController {
        if (!this.connection) {
            throw Error("Unable to create PhpmdController, no connection set");
        }

        if (!this.settings) {
            throw Error("Unable to create PhpmdController, no settings set");
        }

        return new PhpmdController(this.connection, this.settings, this.environment);
    }

    /**
     * Set VSCode client connection
     *
     * @param {IConnection} connection
     * @returns {void}
     */
    public setConnection(connection: IConnection) {
        this.connection = connection;
    }

    /**
     * Set vscode-phpmd settings
     *
     * @param {IPhpmdSettingsModel} settings
     */
    public setSettings(settings: IPhpmdSettingsModel) {
        this.settings = settings;
    }

    /**
     * Set vscode-phpmd environment
     *
     * @param {IPhpmdEnvironmentModel} environment
     */
    public setEnvironment(environment: IPhpmdEnvironmentModel) {
        this.environment = environment;
    }
}

export default PhpmdControllerFactory;
