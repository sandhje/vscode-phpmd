import AbstractFilter from "./AbstractFilter";

class ExampleFilter<T> extends AbstractFilter<T>
{
    constructor(private match: string)
    {
        super();
    }

    public matches(input: T): boolean 
    {
        return input.toString() === this.match;
    }
}

export default ExampleFilter;