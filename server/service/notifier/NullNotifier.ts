import INotifier from "./INotifier";

/**
 * Null object implementation of INotifier
 *
 * @module vscode-phpmd/service/notifier
 * @author Sandhjé Bouw (sandhje@ecodes.io)
 */
class NullNotifier implements INotifier {
    /**
     * @see INotifier::error
     */
    public error(message: string): this {
        return this;
    }
}

export default NullNotifier;
