import { IPmdFileMetaData } from "./IPmdFileMetaData";
import { IPmdViolation } from "./IPmdViolation";

export interface IPmdFileData {
    $: IPmdFileMetaData;
    violation: IPmdViolation[];
}
