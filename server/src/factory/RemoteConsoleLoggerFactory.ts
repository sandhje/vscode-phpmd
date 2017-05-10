import { IConnection } from "vscode-languageserver";
import ILogger from "../service/logger/ILogger";
import RemoteConsoleLogger from "../service/logger/RemoteConsoleLogger";
import ILoggerFactory from "./ILoggerFactory";

class RemoteConsoleLoggerFactory implements ILoggerFactory {
    private connection: IConnection;
    private verbose: boolean = false;

    public create(): ILogger {
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
