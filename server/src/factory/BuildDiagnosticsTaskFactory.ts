import { Task } from "@open-sourcerers/j-stillery";
import * as Xml2Js from "xml2js";
import IPhpmdSettingsModel from "../model/IPhpmdSettingsModel";
import PipelinePayloadModel from "../model/PipelinePayloadModel";
import ILogger from "../service/logger/ILogger";
import NullLogger from "../service/logger/NullLogger";
import BuildDiagnosticsStrategy from "../service/pipeline/BuildDiagnosticsStrategy";
import IFactory from "./IFactory";

/**
 * BuildDiagnostics task factory
 *
 * @module vscode-phpmd/server/factory
 * @author Sandhjé Bouw (sandhje@ecodes.io)
 */
class BuildDiagnosticsTaskFactory implements IFactory<Task<PipelinePayloadModel>> {
    /**
     * @param {IPhpmdSettingsModel} settings
     */
    constructor(
        private settings: IPhpmdSettingsModel,
        private logger: ILogger = new NullLogger()
    ) { }

    /**
     * Create BuildDiagnostics task instance
     *
     * @see IFactory::create
     * @returns {Task<PipelinePayloadModel>}
     */
    public create(): Task<PipelinePayloadModel> {
        let strategy = new BuildDiagnosticsStrategy(this.logger);

        return new Task<PipelinePayloadModel>(strategy);
    }
}

export default BuildDiagnosticsTaskFactory;
