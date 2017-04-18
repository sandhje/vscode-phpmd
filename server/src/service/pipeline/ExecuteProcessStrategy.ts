import PipelinePayloadModel from '../../model/PipelinePayloadModel';
import { IExecuteStrategy } from '@open-sourcerers/j-stillery';
import * as Process from 'child_process';

class ExecuteProcessStrategy implements IExecuteStrategy<PipelinePayloadModel>
{
    public constructor(
        private executable: string, 
        private rules: string
    ) { }

    public execute(
        input: PipelinePayloadModel, 
        resolve: (output?: PipelinePayloadModel | PromiseLike<PipelinePayloadModel>) => void, 
        reject: (reason: any) => void
    ) {
        this.executeProcess(input.path).then((data) => {
            input.raw = data;

            resolve(input);
        })
    } void;

    executeProcess(path: string): Promise<string>
    {
        return new Promise<string>((resolve, reject) => {
            let result: string;
            let process: Process.ChildProcess = Process.exec(this.executable + " " + path + " xml " + this.rules);

            process.stdout.setEncoding('utf8');

            process.stdout.on("data", (data) => {
                if (result) {
                    data = result + data.toString();
                }

                result = data.toString();
            });
            
            process.stdout.on("close", (code) => {
                resolve(result);
            });
        });
    }
}

export default ExecuteProcessStrategy;