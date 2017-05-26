import * as Process from "child_process";
import ILogger from "./logger/ILogger";
import NullLogger from "./logger/NullLogger";

class PhpmdService {
    private exec: (command: string) => Process.ChildProcess;
    private logger: ILogger;

    constructor(private command) { }

    public testPhp(): Promise<boolean> {
        if (this.command.toLowerCase().substr(0, 4) !== "php ") {
            // Info skipping php test
            return Promise.resolve(true);
        }

        return new Promise<boolean>((resolve, reject) => {
            this.execute("php -v").then((data) => {
                // info php version check successful
                resolve(true);
            }, (err: Error) => {
                reject(err);
            });
        });
    }

    public testPhpmd(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.testPhp().then(() => {
                return this.execute(this.command + " --version");
            }).then((data) => {
                this.getLogger().info("PHP Mess Detector test succesful (" + data.trim() + ")", true);
                resolve(true);
            }, (err: Error) => {
                reject(err);
            });
        });
    }

    public run(options: string): Promise<string> {
        this.getLogger().info("Running phpmd command (" + this.command + " " + options + ")", true);
        return this.execute(this.command + " " + options);
    }

    public setLogger(logger: ILogger): void {
        this.logger = logger;
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

    protected getLogger(): ILogger {
        if (!this.logger) {
            this.logger = new NullLogger();
        }

        return this.logger;
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
