import { Task } from "@open-sourcerers/j-stillery";
import * as Xml2Js from "xml2js";
import IPhpmdSettingsModel from "../model/IPhpmdSettingsModel";
import PipelinePayloadModel from "../model/PipelinePayloadModel";
import ParseStrategy from "../service/pipeline/ParseStrategy";
import ILogger from "../service/logger/ILogger";
import NullLogger from "../service/logger/NullLogger";
import IFactory from "./IFactory";

/**
 * Parse task factory
 *
 * @module vscode-phpmd/server/factory
 * @author Sandhjé Bouw (sandhje@ecodes.io)
 */
class ExecuteProcessTaskFactory implements IFactory<Task<PipelinePayloadModel>> {
    /**
     * @param {IPhpmdSettingsModels} settings
     * @param {ILogger} logger
     */
    constructor(
        private settings: IPhpmdSettingsModel,
        private logger: ILogger = new NullLogger()
    ) { }

    /**
     * Create Parse task instance
     *
     * @see IFactory::create
     * @returns {Task<PipelinePayloadModel>}
     */
    public create(): Task<PipelinePayloadModel> {
        let strategy = new ParseStrategy(this.getParser(), this.logger);

        return new Task<PipelinePayloadModel>(strategy);
    }

    /**
     * Get XML parser instance
     *
     * @returns {Xml2Js.Parser}
     */
    protected getParser(): Xml2Js.Parser {
        return new Xml2Js.Parser();
    }
}

export default ExecuteProcessTaskFactory;
