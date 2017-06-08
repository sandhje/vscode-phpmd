import { IConnection, MessageType, ShowMessageNotification } from "vscode-languageserver";
import INotifier from "./INotifier";

/**
 * Client connection implementation of INotifier
 *
 * @module vscode-phpmd/service/notifier
 * @author Sandhjé Bouw (sandhje@ecodes.io)
 */
class ClientConnectionNotifier implements INotifier {
    /**
     * Client connection notifier constructor
     *
     * @param {IConnection} connection
     */
    constructor(private connection: IConnection) {}

    /**
     * @see INotifier::error
     */
    public error(message: string) {
        this.connection.sendNotification(ShowMessageNotification.type, {
            message,
            type: MessageType.Error,
        });

        return this;
    }
}

export default ClientConnectionNotifier;
