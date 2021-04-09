import { Task } from "@open-sourcerers/j-stillery";
import IPhpmdSettingsModel from "../model/IPhpmdSettingsModel";
import PipelinePayloadModel from "../model/PipelinePayloadModel";
import ILogger from "../service/logger/ILogger";
import NullLogger from "../service/logger/NullLogger";
import ExecuteProcessStrategy from "../service/pipeline/ExecuteProcessStrategy";
import IFactory from "./IFactory";
import PhpmdCommandBuilder from "../service/PhpmdCommandBuilder";
import IPhpmdEnvironmentModel from "../model/IPhpmdEnvironmentModel";

/**
 * ExecuteProcess task factory
 *
 * @module vscode-phpmd/server/factory
 * @author Sandhjé Bouw (sandhje@ecodes.io)
 */
class ExecuteProcessTaskFactory implements IFactory<Task<PipelinePayloadModel>> {
    /**
     * PHP mess detector command builder
     *
     * Service class used to build the phpmd command
     *
     * @property {PhpmdCommandBuilder} commandBuilder
     */
    private commandBuilder: PhpmdCommandBuilder;

    /**
     * @param {IPhpmdSettingsModel} settings
     * @param {ILogger} logger
     */
    constructor(
        private settings: IPhpmdSettingsModel,
        private environment: IPhpmdEnvironmentModel,
        private logger: ILogger = new NullLogger()
    ) { }

    /**
     * PhpmdCommandBuilder setter
     *
     * Allows injection of phpmdCommandBuilder for better testability.
     *
     * @param {PhpmdCommandBuilder} commandBuilder
     * @returns {void}
     */
    public setCommandBuilder(commandBuilder: PhpmdCommandBuilder): void {
        this.commandBuilder = commandBuilder;
    }

    /**
     * Get the PHP mess detector command builder
     *
     * Create a command builder based on this server's settings if no service was set before
     *
     * @returns {PhpmdCommandBuilder}
     */
    protected getCommandBuilder(): PhpmdCommandBuilder {
        if (!this.commandBuilder) {
            // TODO: add workspacefolders and homedir from settings
            this.commandBuilder = new PhpmdCommandBuilder(
                this.settings.command,
                this.settings.unsafeCommandEnabled,
                this.settings.unsafeCommand,
                this.environment.workspaceFolders,
                this.environment.homeDir
            );
            this.commandBuilder.setLogger(this.logger);
        }

        return this.commandBuilder;
    }

    /**
     * Create ExecuteProcess task instance
     *
     * @see IFactory::create
     * @returns {Task<PipelinePayloadModel>}
     */
    public create(): Task<PipelinePayloadModel> {
        let strategy = new ExecuteProcessStrategy(this.getCommandBuilder(), this.settings.rules, this.logger);

        return new Task<PipelinePayloadModel>(strategy);
    }
}

export default ExecuteProcessTaskFactory;
