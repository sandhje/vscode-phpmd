import IFactory from './IFactory';
import PipelinePayloadModel from '../model/PipelinePayloadModel';
import PhpmdSettingsModel from '../model/PhpmdSettingsModel';
import BuildDiagnosticsStrategy from '../service/pipeline/BuildDiagnosticsStrategy';
import { Task } from '@open-sourcerers/j-stillery';
import * as Xml2Js from 'xml2js';

class BuildDiagnosticsTaskFactory implements IFactory<Task<PipelinePayloadModel>>
{
    constructor(
        private settings: PhpmdSettingsModel
    ) { }

    create(): Task<PipelinePayloadModel>
    {
        let strategy = new BuildDiagnosticsStrategy();

        return new Task<PipelinePayloadModel>(strategy);
    }
}

export default BuildDiagnosticsTaskFactory