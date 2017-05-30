import { Task } from "@open-sourcerers/j-stillery";
import IPhpmdSettingsModel from "../model/IPhpmdSettingsModel";
import PipelinePayloadModel from "../model/PipelinePayloadModel";
import ILogger from "../service/logger/ILogger";
import NullLogger from "../service/logger/NullLogger";
import ExecuteProcessStrategy from "../service/pipeline/ExecuteProcessStrategy";
import IFactory from "./IFactory";

class ExecuteProcessTaskFactory implements IFactory<Task<PipelinePayloadModel>> {
    constructor(
        private settings: IPhpmdSettingsModel,
        private logger: ILogger = new NullLogger()
    ) { }

    public create(): Task<PipelinePayloadModel> {
        let strategy = new ExecuteProcessStrategy(this.getCommand(), this.getRules(), this.logger);

        return new Task<PipelinePayloadModel>(strategy);
    }

    protected getCommand(): string {
        return this.settings.command;
    }

    protected getRules(): string {
        return this.settings.rules;
    }
}

export default ExecuteProcessTaskFactory;
