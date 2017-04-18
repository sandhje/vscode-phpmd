import { IConnection } from 'vscode-languageserver';
import PhpmdSettingsModel from '../model/PhpmdSettingsModel';
import IFactory from './IFactory';
import PhpmdController from '../controller/PhpmdController';

class PhpmdControllerFactory implements IFactory<PhpmdController>
{
    constructor(
        private connection: IConnection,
        private settings: PhpmdSettingsModel
    ) { }

    create(): PhpmdController
    {
        return new PhpmdController(this.connection, this.settings);
    }
}

export default PhpmdControllerFactory