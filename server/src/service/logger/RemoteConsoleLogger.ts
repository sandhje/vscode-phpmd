import { RemoteConsole } from "vscode-languageserver";
import ILogger from "./ILogger";

/**
 * Remote console implementation of ILogger
 *
 * @module vscode-phpmd/service/logger
 * @author Sandhjé Bouw (sandhje@ecodes.io)
 */
class RemoteConsoleLogger implements ILogger {
    /**
     * Remote console logger constructor
     *
     * @param {RemoteConsole} remoteConsole
     * @param {boolean} verbose
     */
    constructor(private remoteConsole: RemoteConsole, private verbose: boolean = false) {}

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
        if (!isVerbose || this.getVerbose() === true) {
            this.remoteConsole.error(message);
        }

        return this;
    }

    /**
     * @see ILogger::warn
     */
    public warn(message: string, isVerbose?: boolean): this {
        if (!isVerbose || this.getVerbose() === true) {
            this.remoteConsole.warn(message);
        }

        return this;
    }

    /**
     * @see ILogger::info
     */
    public info(message: string, isVerbose?: boolean): this {
        if (!isVerbose || this.getVerbose() === true) {
            this.remoteConsole.info(message);
        }

        return this;
    }

    /**
     * @see ILogger::log
     */
    public log(message: string, isVerbose?: boolean): this {
        if (!isVerbose || this.getVerbose() === true) {
            this.remoteConsole.log(message);
        }

        return this;
    }
}

export default RemoteConsoleLogger;
