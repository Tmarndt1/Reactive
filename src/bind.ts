import React = require("react");

type Pick<T, K extends keyof T> = {
    [P in K]: string;
};

export function bind<TState extends ReactiveState, K extends keyof TState>(state: TState, map: Pick<TState, K>): ClassDecorator {
    return function<T>(constructor: Function) {
        if (state instanceof ReactiveState && React.Component.prototype.isPrototypeOf(constructor.prototype)) {
            state["_resolvers"].push([ constructor.prototype, map ]);
        }
    }
}

function define(state: ReactiveState, key: string) {
    let value: any;

    const getter = function() {
        return value;
    }

    const setter = function(newVal: any) {
        value = newVal;

        state["_resolvers"]?.forEach(resolver => {
            if (resolver[1].hasOwnProperty(key)) {
                resolver[0].setState({
                    key, value
                });
            }
        });
    }

    Object.defineProperty(state, key, {
        get: getter,
        set: setter
    });
}

export class ReactiveState {
    private _resolvers: [ component: React.Component, map: Object ][] = [];

    constructor() {
        for (let key in this) {
            define(this, key);
        }
    }
}