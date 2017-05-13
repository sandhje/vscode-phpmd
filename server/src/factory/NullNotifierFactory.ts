import NullNotifier from "../service/notifier/NullNotifier";
import INotifierFactory from "./INotifierFactory";

class NullNotifierFactory implements INotifierFactory {
    public create() {
        return new NullNotifier();
    }

    public setConnection(connection) {
        return;
    }
}

export default NullNotifierFactory;
