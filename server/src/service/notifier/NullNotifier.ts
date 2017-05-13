import INotifier from "./INotifier";

class NullNotifier implements INotifier {
    public error(message: string): this {
        return this;
    }
}

export default NullNotifier;
