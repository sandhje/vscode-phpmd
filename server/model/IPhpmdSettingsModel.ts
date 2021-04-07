/**
 * VSCode PHPMD settings model
 *
 * @module vscode-phpmd/server/model
 * @author Sandhjé Bouw (sandhje@ecodes.io)
 */
interface IPhpmdSettingsModel {
    /**
     * Enabled
     *
     * @property {boolean}
     */
    enabled: boolean;
    
    /**
     * PHP mess detector command
     *
     * @property {string}
     */
    command: string;

    /**
     * PHP mess detector unsafe command enabled
     *
     * @property {boolean}
     */
     unsafeCommandEnabled: boolean;

    /**
     * PHP mess detector unsafe command
     *
     * @property {string}
     */
    unsafeCommand: string;

    /**
     * PHP mess detector rules
     *
     * @property {string}
     */
    rules: string;

    /**
     * Verbose mode
     *
     * @property {boolean}
     */
    verbose: boolean;

    /**
     * Clear errors on close
     * 
     * @property {boolean}
     */
    clearOnClose: boolean;
}

export default IPhpmdSettingsModel;
