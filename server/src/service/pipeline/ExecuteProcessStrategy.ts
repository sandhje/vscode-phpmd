import { IExecuteStrategy } from "@open-sourcerers/j-stillery";
import * as Process from "child_process";
import PipelinePayloadModel from "../../model/PipelinePayloadModel";

class ExecuteProcessStrategy implements IExecuteStrategy<PipelinePayloadModel> {
    private exec: (command: string) => Process.ChildProcess;

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
        });
    };

    public setExecutor(exec: (command: string) => Process.ChildProcess) {
        this.exec = exec;
    }

    protected getExecutor() {
        if (!this.exec) {
            this.exec = Process.exec;
        }

        return this.exec;
    }

    protected executeProcess(path: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            let result: string;
            let exec = this.getExecutor();
            let process: Process.ChildProcess = exec(this.executable + " " + path + " xml " + this.rules);

            process.stdout.setEncoding("utf8");

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
