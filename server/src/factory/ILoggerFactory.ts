import { IConnection } from "vscode-languageserver";
import ILogger from "../service/logger/ILogger";
import IFactory from "./IFactory";

interface ILoggerFactory extends IFactory<ILogger> {
    setConnection(connection: IConnection): void;
    setVerbose(verbose: boolean): void;
}

export default ILoggerFactory;
