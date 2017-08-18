import { IConnection } from "vscode-languageserver";
import INotifier from "../service/notifier/INotifier";
import IFactory from "./IFactory";

/**
 * INotifier factory interface
 *
 * @module vscode-phpmd/server/factory
 * @author Sandhjé Bouw (sandhje@ecodes.io)
 */
interface INotifierFactory extends IFactory<INotifier> {
    /**
     * Set notifier connection
     *
     * @param {IConnection} connection
     * @returns {void}
     */
    setConnection(connection: IConnection): void;
}

export default INotifierFactory;
