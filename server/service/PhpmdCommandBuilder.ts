import ILogger from "./logger/ILogger";
import NullLogger from "./logger/NullLogger";
import { WorkspaceFolder } from "vscode-languageserver";

/**
 * PHP mess detector command builder
 *
 * Builder for the php mess detector command
 *
 * @module vscode-phpmd/service
 * @author Sandhjé Bouw (sandhje@ecodes.io)
 */
class PhpmdCommandBuilder {
    /**
     * Logger
     *
     * @property {ILogger}
     */
    private logger: ILogger;

    /**
     * Service constructor
     *
     * Takes the command string and variable for substitution 
     *
     * @param {string} command
     * @param {WorkspaceFolder[]} workspaceFolders
     * @param {string} homeDir
     */
    constructor(private readonly command: string, private workspaceFolders: WorkspaceFolder[], private homeDir: string) { }

    public usingGlobalPhp(): boolean {
        return this.command.toLowerCase().substr(0, 4) === "php ";
    }

    /**
     * Build the PHP mess detector version command.
     *
     * @returns {string}
     */
    public buildPhpmdVersionCommand(): string {
        const command = `${this.command} --version`;
        this.getLogger().info(`Building phpmd version command: ${command}`, true);

        return command;
    }

    /**
     * Build the PHP mess detector command.
     *
     * @param  {string} options A string with PHP mess detector command line options
     * @returns {string}
     */
    public buildPhpmdCommand(options: string): string {
        const command = `${this.command} ${options}`;
        this.getLogger().info(`Building phpmd command: ${command}`, true);

        return command;
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
}

export default PhpmdCommandBuilder;