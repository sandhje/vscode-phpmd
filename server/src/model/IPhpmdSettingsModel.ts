/**
 * VSCode PHPMD settings model
 *
 * @module vscode-phpmd/server/model
 * @author Sandhjé Bouw (sandhje@ecodes.io)
 */
interface IPhpmdSettingsModel {
    /**
     * PHP mess detector command
     *
     * @property {string}
     */
    command: string;

    /**
     * PHP mess detector rules
     *
     * @property {string}
     */
    rules: string;

    /**
     * Verbose mode
     *
     * @property {string}
     */
    verbose: boolean;
}

export default IPhpmdSettingsModel;
