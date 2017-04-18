import PipelinePayloadModel from '../../model/PipelinePayloadModel';
import { IExecuteStrategy } from '@open-sourcerers/j-stillery';
import { Parser } from 'xml2js';

class ParseStrategy implements IExecuteStrategy<PipelinePayloadModel>
{
    public constructor(
        private parser: Parser
    ) { }

    public execute(
        input: PipelinePayloadModel, 
        resolve: (output?: PipelinePayloadModel | PromiseLike<PipelinePayloadModel>) => void, 
        reject: (reason: any) => void
    ) {
        this.parser.parseString(input.raw, (error, result) => {
            input.parsed = result;

            resolve(input);
        });    
    } void;
}

export default ParseStrategy;