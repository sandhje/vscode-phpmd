import { IConnection } from "vscode-languageserver";
import ClientConnectionNotifier from "../service/notifier/ClientConnectionNotifier";
import INotifier from "../service/notifier/INotifier";
import INotifierFactory from "./INotifierFactory";

class ClientConnectionNotifierFactory implements INotifierFactory {
    private connection: IConnection;

    public create(): INotifier {
        if (!this.connection) {
            throw Error("Unable to create ClientConnectionNotifier, no connection set");
        }

        return new ClientConnectionNotifier(this.connection);
    }

    public setConnection(connection: IConnection) {
        this.connection = connection;
    }
}

export default ClientConnectionNotifierFactory;
