import { Task } from "@open-sourcerers/j-stillery";
import * as Xml2Js from "xml2js";
import IPhpmdSettingsModel from "../model/IPhpmdSettingsModel";
import PipelinePayloadModel from "../model/PipelinePayloadModel";
import ParseStrategy from "../service/pipeline/ParseStrategy";
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
     */
    constructor(
        private settings: IPhpmdSettingsModel
    ) { }

    /**
     * Create Parse task instance
     *
     * @see IFactory::create
     * @returns {Task<PipelinePayloadModel>}
     */
    public create(): Task<PipelinePayloadModel> {
        let strategy = new ParseStrategy(this.getParser());

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
