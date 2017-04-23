import { PmdFileMetaData } from './PmdFileMetaData';
import { PmdViolation } from './PmdViolation';

export interface PmdFileData {
    $: PmdFileMetaData;
    violation: Array<PmdViolation>;
}
