import { IConnection } from "vscode-languageserver";
import ILogger from "../service/logger/ILogger";
import NullLogger from "../service/logger/NullLogger";
import ILoggerFactory from "./ILoggerFactory";

/**
 * Null logger factory
 *
 * Creates a null object implementation of the ILogger interface
 *
 * @module vscode-phpmd/server/factory
 * @author Sandhjé Bouw (sandhje@ecodes.io)
 */
class NullLoggerFactory implements ILoggerFactory {
    /**
     * Create Null logger instance
     *
     * @see IFactory::create
     * @returns {ILogger}
     */
    public create(): ILogger {
        return new NullLogger();
    }

    /**
     * Null object implementation of set connection
     *
     * @see ILoggerFactory::setConnection
     * @param {IConnection} connection
     * @returns {void}
     */
    public setConnection(connection: IConnection): void {
        return;
    }

    /**
     * Null object implementation of set verbose
     *
     * @see ILoggerFactory::setVerbose
     * @param {IConnection} connection
     * @returns {void}
     */
    public setVerbose(verbose: boolean): void {
        return;
    }
}

export default NullLoggerFactory;
