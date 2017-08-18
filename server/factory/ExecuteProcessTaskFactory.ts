import { Task } from "@open-sourcerers/j-stillery";
import IPhpmdSettingsModel from "../model/IPhpmdSettingsModel";
import PipelinePayloadModel from "../model/PipelinePayloadModel";
import ILogger from "../service/logger/ILogger";
import NullLogger from "../service/logger/NullLogger";
import ExecuteProcessStrategy from "../service/pipeline/ExecuteProcessStrategy";
import IFactory from "./IFactory";

/**
 * ExecuteProcess task factory
 *
 * @module vscode-phpmd/server/factory
 * @author Sandhjé Bouw (sandhje@ecodes.io)
 */
class ExecuteProcessTaskFactory implements IFactory<Task<PipelinePayloadModel>> {
    /**
     * @param {IPhpmdSettingsModel} settings
     * @param {ILogger} logger
     */
    constructor(
        private settings: IPhpmdSettingsModel,
        private logger: ILogger = new NullLogger()
    ) { }

    /**
     * Create ExecuteProcess task instance
     *
     * @see IFactory::create
     * @returns {Task<PipelinePayloadModel>}
     */
    public create(): Task<PipelinePayloadModel> {
        let strategy = new ExecuteProcessStrategy(this.settings.command, this.settings.rules, this.logger);

        return new Task<PipelinePayloadModel>(strategy);
    }
}

export default ExecuteProcessTaskFactory;
