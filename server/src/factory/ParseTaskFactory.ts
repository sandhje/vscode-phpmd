import IFactory from './IFactory';
import PipelinePayloadModel from '../model/PipelinePayloadModel';
import PhpmdSettingsModel from '../model/PhpmdSettingsModel';
import ParseStrategy from '../service/pipeline/ParseStrategy';
import { Task } from '@open-sourcerers/j-stillery';
import * as Xml2Js from 'xml2js';

class ExecuteProcessTaskFactory implements IFactory<Task<PipelinePayloadModel>>
{
    constructor(
        private settings: PhpmdSettingsModel
    ) { }

    create(): Task<PipelinePayloadModel>
    {
        let strategy = new ParseStrategy(this.getParser());

        return new Task<PipelinePayloadModel>(strategy);
    }

    protected getParser(): Xml2Js.Parser {
        return new Xml2Js.Parser();
    }
}

export default ExecuteProcessTaskFactory