import { IConnection, MessageType, ShowMessageNotification } from "vscode-languageserver";
import INotifier from "./INotifier";

class ClientConnectionNotifier implements INotifier {
    constructor(private connection: IConnection) {}

    public error(message: string) {
        this.connection.sendNotification(ShowMessageNotification.type, {
            message,
            type: MessageType.Error,
        });

        return this;
    }
}

export default ClientConnectionNotifier;
