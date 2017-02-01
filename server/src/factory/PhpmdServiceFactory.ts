import IFactory from './IFactory';
import PhpmdService from '../service/PhpmdService';
import PhpmdSettingsModel from '../models/PhpmdSettingsModel';

class PhpmdServiceFactory implements IFactory<PhpmdService>
{
    constructor(
        private settings: PhpmdSettingsModel
    ) { }

    create(): PhpmdService
    {
        return new PhpmdService(this.settings.executable, this.settings.rules);
    }
}

export default PhpmdServiceFactory;