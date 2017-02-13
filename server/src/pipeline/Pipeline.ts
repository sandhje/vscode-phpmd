import IPipeline from "./IPipeline";
import IStage from "./IStage";

class Pipeline<T> implements IPipeline<T>
{
    private current: number = -1;

    private filters: Array<IStage<T>> = [];

    public pipe(filter: IStage<T>): IPipeline<T>
    {
        this.filters.push(filter);

        return this;
    }

    public run(input: T): Promise<T>
    {
        this.reset();

        return this.next(input);
    }

    private reset(): void
    {
        this.current = -1;
    }

    private next = (input: T): Promise<T> => {
        let promiseCallback = (resolve: (value?: T | PromiseLike<T>) => void, reject: (reason: any) => void) => {
            this.current++;

            if (this.current in this.filters) {
                // Go to next in filter chain
                // TODO: Try Wrapping this.invoke or next in an arrow function, see: http://stackoverflow.com/questions/36627845/es6-promises-how-to-chain-functions-with-delays
                this.filters[this.current].invoke(input, this.next.bind(this), resolve, reject);
                return; // Do not continue to default resolve if a filter was invoked
            }

            // End of filter chain, walk back up
            resolve(input);
        };

        return new Promise<T>(promiseCallback.bind(this));
    }
}

export default Pipeline;