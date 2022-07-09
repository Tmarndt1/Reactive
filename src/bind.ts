import React = require("react");

type Pick<T, K extends keyof T> = {
    [P in K]: string;
};

type Resolver<T> = (state: Readonly<T>) => (Pick<T, keyof T>);

export function bind<TState extends ReactState, K extends keyof TState>(state: TState, resolver: Pick<TState, K>): ClassDecorator {
    return function<T>(constructor: Function) {
        if (state instanceof ReactState && React.Component.prototype.isPrototypeOf(constructor.prototype)) {
            state["_components"].push(constructor.prototype);
        }
    }
}

export class ReactState {
    private _components: React.Component[] = [];
    public test: string;
    public whatever: string;

}

interface IState {
    name: string;
}

@bind(new ReactState(), {
    whatever: "",
    test: ""
})
class Component extends React.Component<{}, IState> {
    
}