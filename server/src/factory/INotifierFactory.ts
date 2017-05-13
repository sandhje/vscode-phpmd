import { IConnection } from "vscode-languageserver";
import INotifier from "../service/notifier/INotifier";
import IFactory from "./IFactory";

interface INotifierFactory extends IFactory<INotifier> {
    setConnection(connection: IConnection): void;
}

export default INotifierFactory;
