import AbstractTask from "./AbstractTask";

class ExampleTask<T> extends AbstractTask<T>
{
    constructor(private logIn, private logOut)
    {
        super();
    }

    public in(input: T, resolve: (output?: T | PromiseLike<T>) => void, reject: (reason: any) => void): void
    {
        setTimeout(() => {
            resolve(input + this.logIn);
        }, 0);
    }

    public out(output: T, resolve: (output?: T | PromiseLike<T>) => void, reject: (reason: any) => void): void
    {
        setTimeout(() => {
            resolve(output + this.logOut);
        }, 0);
    }
}

export default ExampleTask;