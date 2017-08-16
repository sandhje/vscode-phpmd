import { IConnection } from "vscode-languageserver";
import ILogger from "../service/logger/ILogger";
import RemoteConsoleLogger from "../service/logger/RemoteConsoleLogger";
import ILoggerFactory from "./ILoggerFactory";

/**
 * Remote console logger factory
 *
 * @module vscode-phpmd/server/factory
 * @author Sandhjé Bouw (sandhje@ecodes.io)
 */
class RemoteConsoleLoggerFactory implements ILoggerFactory {
    /**
     * @property {IConnection} connection
     */
    private connection: IConnection;

    /**
     * @property {boolean} verbose
     */
    private verbose: boolean = false;

    /**
     * Create remote console logger instance
     *
     * @see IFaction::create
     * @returns {ILogger}
     */
    public create(): ILogger {
        if (!this.connection) {
            throw Error("Unable to create RemoteConsoleLogger, no connection set");
        }

        return new RemoteConsoleLogger(this.connection.console, this.verbose);
    }

    /**
     * Set VSCode client connection
     *
     * @see ILoggerFactory::setConnection
     * @param {IConnection} connection
     * @returns {void}
     */
    public setConnection(connection: IConnection) {
        this.connection = connection;
    }

    /**
     * Set verbose mode
     *
     * @see ILoggerFactory::setVerbose
     * @param {boolean} verbose
     * @returns {void}
     */
    public setVerbose(verbose: boolean) {
        this.verbose = verbose;
    }
}

export default RemoteConsoleLoggerFactory;
