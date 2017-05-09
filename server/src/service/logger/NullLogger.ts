import ILogger from "./ILogger";

class NullLogger implements ILogger {
    public setVerbose(verbose: boolean): this {
        return this;
    }

    public getVerbose(): boolean {
        return false;
    }

    public error(message: string, isVerbose?: boolean): this {
        return this;
    }

    public warn(message: string, isVerbose?: boolean): this {
        return this;
    }

    public info(message: string, isVerbose?: boolean): this {
        return this;
    }

    public log(message: string, isVerbose?: boolean): this {
        return this;
    }
}

export default NullLogger;
