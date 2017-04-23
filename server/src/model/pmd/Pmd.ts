import { PmdMetaData } from './PmdMetaData';
import { PmdFileData } from './PmdFileData';

export interface Pmd {
    $: PmdMetaData;
    file: Array<PmdFileData>;
}
