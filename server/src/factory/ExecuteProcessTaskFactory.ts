import IFactory from './IFactory';
import PipelinePayloadModel from '../model/PipelinePayloadModel';
import PhpmdSettingsModel from '../model/PhpmdSettingsModel';
import ExecuteProcessStrategy from '../service/pipeline/ExecuteProcessStrategy';
import { Task } from '@open-sourcerers/j-stillery';

class ExecuteProcessTaskFactory implements IFactory<Task<PipelinePayloadModel>>
{
    constructor(
        private settings: PhpmdSettingsModel
    ) { }

    create(): Task<PipelinePayloadModel>
    {
        let strategy = new ExecuteProcessStrategy(this.getExecutable(), this.getRules());

        return new Task<PipelinePayloadModel>(strategy);
    }

    protected getExecutable(): string
    {
        return this.settings.executable;
    }

    protected getRules(): string
    {
        return this.settings.rules;
    }
}

export default ExecuteProcessTaskFactory