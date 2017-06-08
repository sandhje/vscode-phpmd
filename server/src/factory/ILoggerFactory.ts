import { IConnection } from "vscode-languageserver";
import ILogger from "../service/logger/ILogger";
import IFactory from "./IFactory";

/**
 * ILogger factory interface
 *
 * @module vscode-phpmd/server/factory
 * @author Sandhjé Bouw (sandhje@ecodes.io)
 */
interface ILoggerFactory extends IFactory<ILogger> {
    /**
     * Set logger connection
     *
     * @param {IConnection} connection
     * @returns {void}
     */
    setConnection(connection: IConnection): void;

    /**
     * Set logger verbose mode
     *
     * @param {boolean} verbose
     * @returns {void}
     */
    setVerbose(verbose: boolean): void;
}

export default ILoggerFactory;
