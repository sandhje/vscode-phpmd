import { IConnection } from "vscode-languageserver";
import INotifier from "../service/notifier/INotifier";
import NullNotifier from "../service/notifier/NullNotifier";
import INotifierFactory from "./INotifierFactory";

/**
 * Null notifier factory
 *
 * Creates a null object implementation of the INotifier interface
 *
 * @module vscode-phpmd/server/factory
 * @author Sandhjé Bouw (sandhje@ecodes.io)
 */
class NullNotifierFactory implements INotifierFactory {
    /**
     * Create Null notifier instance
     *
     * @see IFactory::create
     * @returns {INotifier}
     */
    public create(): INotifier {
        return new NullNotifier();
    }

    /**
     * Null object implementation of set connection
     *
     * @see INotifierFactory::setConnection
     * @param {IConnection} connection
     * @returns {void}
     */
    public setConnection(connection: IConnection): void {
        return;
    }
}

export default NullNotifierFactory;
