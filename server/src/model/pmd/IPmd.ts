import { IPmdFileData } from "./IPmdFileData";
import { IPmdMetaData } from "./IPmdMetaData";

export interface IPmd {
    $: IPmdMetaData;
    file: IPmdFileData[];
}
