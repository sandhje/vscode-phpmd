/**
 * Logger interface
 *
 * @module vscode-phpmd/service/logger
 * @author Sandhjé Bouw (sandhje@ecodes.io)
 */
interface ILogger {
    /**
     * Set the verbose property flag
     *
     * @param {boolean} verbose The verbose flag
     * @returns {this}
     */
    setVerbose(verbose: boolean): this;

    /**
     * Get the verbose property flag
     *
     * @returns {boolean}
     * @returns {this}
     */
    getVerbose(): boolean;

    /**
     * Show an error message
     *
     * @param {string} message The message to show
     * @param {boolean} isVerbose If set to true only shows the message if the logger's verbose property is truthy
     * @returns {this}
     */
    error(message: string, isVerbose?: boolean): this;

    /**
     * Show a warning message
     *
     * @param {string} message The message to show
     * @param {boolean} isVerbose If set to true only shows the message if the logger's verbose property is truthy
     * @returns {this}
     */
    warn(message: string, isVerbose?: boolean): this;

    /**
     * Show an information message
     *
     * @param {string} message The message to show
     * @param {boolean} isVerbose If set to true only shows the message if the logger's verbose property is truthy
     * @returns {this}
     */
    info(message: string, isVerbose?: boolean): this;

    /**
     * Log a message
     *
     * @param {string} message The message to log
     * @param {boolean} isVerbose If set to true only shows the message if the logger's verbose property is truthy
     * @returns {this}
     */
    log(message: string, isVerbose?: boolean): this;
}

export default ILogger;
