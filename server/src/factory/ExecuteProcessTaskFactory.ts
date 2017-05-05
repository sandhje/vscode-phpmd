import { Task } from "@open-sourcerers/j-stillery";
import IPhpmdSettingsModel from "../model/IPhpmdSettingsModel";
import PipelinePayloadModel from "../model/PipelinePayloadModel";
import ExecuteProcessStrategy from "../service/pipeline/ExecuteProcessStrategy";
import IFactory from "./IFactory";

class ExecuteProcessTaskFactory implements IFactory<Task<PipelinePayloadModel>> {
    constructor(
        private settings: IPhpmdSettingsModel
    ) { }

    public create(): Task<PipelinePayloadModel> {
        let strategy = new ExecuteProcessStrategy(this.getExecutable(), this.getRules());

        return new Task<PipelinePayloadModel>(strategy);
    }

    protected getExecutable(): string {
        return this.settings.executable;
    }

    protected getRules(): string {
        return this.settings.rules;
    }
}

export default ExecuteProcessTaskFactory;
