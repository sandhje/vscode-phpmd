/**
 * Notifier interface
 *
 * @module vscode-phpmd/service/notifier
 * @author Sandhjé Bouw (sandhje@ecodes.io)
 */
interface INotifier {
    /**
     * Show an error notification to the user
     *
     * @param {string} message The message to show
     * @returns {this}
     */
    error(message: string): this;
}

export default INotifier;
