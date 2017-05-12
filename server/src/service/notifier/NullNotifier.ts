import INotifier from "./INotifier";

class NullNotifier implements INotifier {
    public error(): this {
        return this;
    }
}

export default NullNotifier;
