import * as Process from "child_process";
import ILogger from "./logger/ILogger";
import NullLogger from "./logger/NullLogger";

/**
 * PHP mess detector service
 *
 * Interaction layer with the PHP mess detector command.
 *
 * @module vscode-phpmd/service
 * @author Sandhjé Bouw (sandhje@ecodes.io)
 */
class PhpmdService {
    /**
     * NodeJS process executor
     *
     * @property {(command: sstring) => Process.ChildProcess}
     */
    private exec: (command: string) => Process.ChildProcess;

    /**
     * Logger
     *
     * @property {ILogger}
     */
    private logger: ILogger;

    /**
     * Service constructor
     *
     * Takes the PHP mess detector command to be worked with
     *
     * @param {string} command
     */
    constructor(private command: string) { }

    /**
     * PHP availability test
     *
     * Tests wether the PHP command is globally available on the system. Resolves with a boolean true
     * if available or if the PHP mess detector command does not use the PHP command. Rejects with an
     * error if neither of these conditions apply.
     *
     * @returns {Promise<booean>}
     */
    public testPhp(): Promise<boolean> {
        if (this.command.toLowerCase().substr(0, 4) !== "php ") {
            this.getLogger().info("PHP Mess Detector command not using global PHP, skipping PHP test", true);
            return Promise.resolve(true);
        }

        return new Promise<boolean>((resolve, reject) => {
            this.execute("php -v").then((data) => {
                this.getLogger().info("PHP command test successful (" + data.substr(0, 16).trim() + " ...)", true);
                resolve(true);
            }, (err: Error) => {
                reject(err);
            });
        });
    }

    /**
     * PHP mess detector availability test
     *
     * Tests wether the PHP mess detector command can be executed. Resolves with a boolean true if
     * the command was successfully exectuted. Rejects with an error if not.
     *
     * @returns {Promise<boolean>}
     */
    public testPhpmd(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.testPhp().then(() => {
                return this.execute(this.command + " --version");
            }).then((data) => {
                this.getLogger().info("PHP Mess Detector test successful (" + data.trim() + ")", true);
                resolve(true);
            }, (err: Error) => {
                reject(err);
            });
        }); 
    }

    /**
     * Run the PHP mess detector command.
     *
     * Note: checking for availability of the command is the consumers responsibility and done through
     * the testPhpmd method.
     *
     * @param  {string} options A string with PHP mess detector command line options
     * @returns {Promise<string>}
     */
    public run(options: string): Promise<string> {
        this.getLogger().info("Running phpmd command (" + this.command + " " + options + ")", true);
        return this.execute(this.command + " " + options);
    }

    /**
     * Logger setter
     *
     * @param {ILogger} logger
     * @returns {void}
     */
    public setLogger(logger: ILogger): void {
        this.logger = logger;
    }

    /**
     * Executor setter
     *
     * Allows overriding the executor for testing purposes
     *
     * @param {(command: string) => Process.ChildProcess} exec
     * @returns {void}
     */
    public setExecutor(exec: (command: string) => Process.ChildProcess) {
        this.exec = exec;
    }

    /**
     * Executor getter
     *
     * Returns NodeJS process executor if the setter was not called before.
     *
     * @returns {(command: string) => Process.ChildProcess}
     */
    protected getExecutor(): (command: string) => Process.ChildProcess {
        if (!this.exec) {
            this.exec = Process.exec;
        }

        return this.exec;
    }

    /**
     * Logger getter
     *
     * Returns null object logger if the setter was not called before
     *
     * @returns {ILogger}
     */
    protected getLogger(): ILogger {
        if (!this.logger) {
            this.logger = new NullLogger();
        }

        return this.logger;
    }

    /**
     * Execute the passed command with this instance's executor
     *
     * @param {string} cmd
     * @returns {Promise<string>}
     */
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
