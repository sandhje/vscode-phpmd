import ILogger from "./ILogger";

/**
 * Null object implementation of ILogger
 *
 * @module vscode-phpmd/service/logger
 * @author Sandhjé Bouw (sandhje@ecodes.io)
 */
class NullLogger implements ILogger {
    /**
     * Verbose flag
     *
     * @property {boolean}
     */
    private verbose: boolean = false;

    /**
     * @see ILogger::setVerbose
     */
    public setVerbose(verbose: boolean): this {
        this.verbose = verbose;

        return this;
    }

    /**
     * @see ILogger::getVerbose
     */
    public getVerbose(): boolean {
        return this.verbose;
    }

    /**
     * @see ILogger::error
     */
    public error(message: string, isVerbose?: boolean): this {
        return this;
    }

    /**
     * @see ILogger::warn
     */
    public warn(message: string, isVerbose?: boolean): this {
        return this;
    }

    /**
     * @see ILogger::info
     */
    public info(message: string, isVerbose?: boolean): this {
        return this;
    }

    /**
     * @see ILogger::log
     */
    public log(message: string, isVerbose?: boolean): this {
        return this;
    }
}

export default NullLogger;
