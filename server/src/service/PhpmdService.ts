import * as Process from "child_process";

class PhpmdService {
    private exec: (command: string) => Process.ChildProcess;

    constructor(private command) {}

    public getVersion(): Promise<string> {
        return this.execute(this.command + " --version");
    }

    public run(options: string): Promise<string> {
        return this.execute(this.command + " " + options);
    }

    public setExecutor(exec: (command: string) => Process.ChildProcess) {
        this.exec = exec;
    }

    protected getExecutor() {
        if (!this.exec) {
            this.exec = Process.exec;
        }

        return this.exec;
    }

    protected execute(cmd): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            let result: string;
            let exec = this.getExecutor();
            let process: Process.ChildProcess = exec(cmd);

            process.stdout.setEncoding("utf8");

            process.stdout.on("data", (data) => {
                if (result) {
                    data = result + data.toString();
                }

                result = data.toString();
            });

            process.stdout.on("close", () => {
                if (!result) {
                    reject(Error("An error occured, no output was received after executing the phpmd command"));
                    return;
                }

                resolve(result);
            });

            process.stdout.on("error", (err: Error) => {
                reject(err);
            });
        });
    }
}

export default PhpmdService;
