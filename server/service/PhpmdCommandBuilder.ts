import ILogger from "./logger/ILogger";
import NullLogger from "./logger/NullLogger";
import { URI } from "vscode-uri";
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
     * Command
     * 
     * @property {string}
     */
    private readonly command: string;

    /**
     * Service constructor
     *
     * Takes the command string and variable for substitution 
     *
     * @param {string} command
     * @param {WorkspaceFolder[]} workspaceFolders
     * @param {string} homeDir
     */
    constructor(command: string, unsafeCommandEnabled: boolean, unsafeCommand: string, private workspaceFolders: WorkspaceFolder[], private homeDir: string) {
        let cmd = command;

        if (unsafeCommandEnabled && unsafeCommand)
            cmd = unsafeCommand;

        this.command = cmd;
    }

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
        // Replace homedir in options
        if (options.indexOf("\"~/") > -1)
            options = options.replace(`"~/`, `"${this.homeDir}/`);

        if (options.indexOf("\"~\\") > -1)
            options = options.replace(`"~\\`, `"${this.homeDir}\\`);

        // Replace workspaceFolder in options
        if (options.indexOf("${workspaceFolder}") > -1)
        {
            const file = this.getFileFromOptions(options);
            const folder = this.getWorkspaceFolderForFile(file);

            if (file && folder) {
                options = options.replace("${workspaceFolder}", folder);
            }
        }

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

    protected getFileFromOptions(options: string): string {
        if (!options)
            return undefined;

        const optionsSegments = options.split(" ");
        const fileSegment = optionsSegments[0];

        if (!fileSegment || fileSegment.length <= 2)
            return undefined;
        
        return fileSegment.substring(1, fileSegment.length - 1);
    }

    protected getWorkspaceFolderForFile(file: string): string {
        if (!file)
            return undefined;
        
        if (!this.workspaceFolders || !this.workspaceFolders.length)
            return undefined;
        
        let workspaceFolder = this.workspaceFolders.find(folder => {
            const folderPath = URI.parse(folder.uri).fsPath;
            const result = file.startsWith(folderPath);

            if (result)
                this.getLogger().info(`Found match between file and workspace folder (file: "${file}", workspaceFolder: "${folderPath}")`, true);
            
            return result;
        });

        if (!workspaceFolder) {
            this.getLogger().info(`No matching workspace folder found for file "${file}"`, true);
            this.getLogger().info(`Using first folder in workspace folder array: "${URI.parse(this.workspaceFolders[0].uri).fsPath}"`, true);
            workspaceFolder = this.workspaceFolders[0];
        }        

        return URI.parse(workspaceFolder.uri).fsPath;
    }
}

export default PhpmdCommandBuilder;