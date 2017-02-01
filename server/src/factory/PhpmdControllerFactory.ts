import { IConnection } from 'vscode-languageserver';
import IFactory from './IFactory';
import PhpmdController from '../controller/PhpmdController';
import PhpmdService from '../service/PhpmdService';

class PhpmdControllerFactory implements IFactory<PhpmdController>
{
    constructor(
        private connection: IConnection, 
        private service: PhpmdService
    ) { }

    create(): PhpmdController
    {
        return new PhpmdController(this.connection, this.service);
    }
}

export default PhpmdControllerFactory