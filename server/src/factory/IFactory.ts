/**
 * Factory interface
 *
 * @module vscode-phpmd/server/factory
 * @author Sandhjé Bouw (sandhje@ecodes.io)
 */
interface IFactory<T> {
    /**
     * Create and return an instance of T
     *
     * @returns {T}
     */
    create: () => T;
}

export default IFactory;
