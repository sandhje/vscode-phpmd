import * as Process from "child_process";

class PhpmdService {
    private exec: (command: string) => Process.ChildProcess;

    constructor(private executable) {}

    public getVersion(): Promise<string> {
        return this.execute(this.executable + " --version");
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

    private execute(cmd): Promise<string> {
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
                    reject(Error("Phpmd executable not found"));
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
