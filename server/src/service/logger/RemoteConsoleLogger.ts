import { RemoteConsole } from "vscode-languageserver";
import ILogger from "./ILogger";

class RemoteConsoleLogger implements ILogger {
    constructor(private remoteConsole: RemoteConsole, private verbose: boolean = false) {}

    public setVerbose(verbose: boolean): this {
        this.verbose = verbose;

        return this;
    }

    public getVerbose(): boolean {
        return this.verbose;
    }

    public error(message: string, isVerbose?: boolean): this {
        if (!isVerbose || this.getVerbose() === true) {
            this.remoteConsole.error(message);
        }

        return this;
    }

    public warn(message: string, isVerbose?: boolean): this {
        if (!isVerbose || this.getVerbose() === true) {
            this.remoteConsole.warn(message);
        }

        return this;
    }

    public info(message: string, isVerbose?: boolean): this {
        if (!isVerbose || this.getVerbose() === true) {
            this.remoteConsole.info(message);
        }

        return this;
    }

    public log(message: string, isVerbose?: boolean): this {
        if (!isVerbose || this.getVerbose() === true) {
            this.remoteConsole.log(message);
        }

        return this;
    }
}

export default RemoteConsoleLogger;
