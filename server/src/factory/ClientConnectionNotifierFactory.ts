import { IConnection } from "vscode-languageserver";
import ClientConnectionNotifier from "../service/notifier/ClientConnectionNotifier";
import INotifier from "../service/notifier/INotifier";
import INotifierFactory from "./INotifierFactory";

/**
 * ClientConnection notifier factory
 *
 * @module vscode-phpmd/server/factory
 * @author Sandhjé Bouw (sandhje@ecodes.io)
 */
class ClientConnectionNotifierFactory implements INotifierFactory {
    /**
     * @property {IConnection} connection
     */
    private connection: IConnection;

    /**
     * Create ClientConnection notifier instance
     *
     * Throw error if no connection was set.
     *
     * @see IFactory::create
     * @throws {Error}
     * @returns {INotifier}
     */
    public create(): INotifier {
        if (!this.connection) {
            throw Error("Unable to create ClientConnectionNotifier, no connection set");
        }

        return new ClientConnectionNotifier(this.connection);
    }

    /**
     * Set VSCode client connection
     *
     * @see INotifierFactory::setConnection
     * @param {IConnection} connection
     * @returns {void}
     */
    public setConnection(connection: IConnection): void {
        this.connection = connection;
    }
}

export default ClientConnectionNotifierFactory;
