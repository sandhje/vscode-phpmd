import NullLogger from "../service/logger/NullLogger";
import ILoggerFactory from "./ILoggerFactory";

class NullLoggerFactory implements ILoggerFactory {
    public create() {
        return new NullLogger();
    }

    public setConnection(connection) {
        return;
    }

    public setVerbose(verbose) {
        return;
    }
}

export default NullLoggerFactory;
