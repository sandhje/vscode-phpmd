import IStage from "./IStage";

interface IPipeline<T>
{
    pipe: (filter: IStage<T>) => IPipeline<T>;

    run: (input: T) => Promise<T>;
}

export default IPipeline;