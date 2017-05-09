import { IConnection } from "vscode-languageserver";
import RemoteConsoleLogger from "../service/logger/RemoteConsoleLogger";
import IFactory from "./IFactory";

class RemoteConsoleLoggerFactory implements IFactory<RemoteConsoleLogger> {
    private connection: IConnection;
    private verbose: boolean = false;

    public create(): RemoteConsoleLogger {
        if (!this.connection) {
            throw Error("Unable to create RemoteConsoleLogger, no connection set");
        }

        return new RemoteConsoleLogger(this.connection.console, this.verbose);
    }

    public setConnection(connection: IConnection) {
        this.connection = connection;
    }

    public setVerbose(verbose: boolean) {
        this.verbose = verbose;
    }
}

export default RemoteConsoleLoggerFactory;
