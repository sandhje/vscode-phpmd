import IStage from "./IStage";

interface IPipeline<T>
{
    pipe: (stage: IStage<T>) => IPipeline<T>;

    run: (input: T) => Promise<T>;
}

export default IPipeline;