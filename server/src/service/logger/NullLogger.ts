import ILogger from "./ILogger";

class NullLogger implements ILogger {
    private verbose: boolean = false;

    public setVerbose(verbose: boolean): this {
        this.verbose = verbose;

        return this;
    }

    public getVerbose(): boolean {
        return this.verbose;
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
