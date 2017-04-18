import IFactory from './IFactory';
import PhpmdSettingsModel from '../model/PhpmdSettingsModel';
import PipelinePayloadModel from '../model/PipelinePayloadModel';
import ExecuteProcessTaskFactory from './ExecuteProcessTaskFactory';
import ParseTaskFactory from './ParseTaskFactory';
import BuildDiagnosticsTaskFactory from './BuildDiagnosticsTaskFactory';
import { Pipeline } from '@open-sourcerers/j-stillery';

class PipelineFactory implements IFactory<Pipeline<PipelinePayloadModel>>
{
    constructor(
        private settings: PhpmdSettingsModel
    ) { }

    create(): Pipeline<PipelinePayloadModel>
    {
        let pipeline = new Pipeline<PipelinePayloadModel>()
            .pipe(new ExecuteProcessTaskFactory(this.settings).create())
            .pipe(new ParseTaskFactory(this.settings).create())
            .pipe(new BuildDiagnosticsTaskFactory(this.settings).create());

        return pipeline;
    }
}

export default PipelineFactory