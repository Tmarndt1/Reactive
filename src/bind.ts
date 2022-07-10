import React = require("react");

type Pick<T, K extends keyof T> = {
    [P in K]: string;
};

export function bind<TState extends ReactiveState<any>, K extends keyof TState>(obj: TState, map?: Pick<TState, K>): ClassDecorator {
    return function<T extends { new(...args: any[]): React.Component }>(constructor: T) {
        return class extends constructor {
            constructor(...args: any[]) {
                super(...args);

                if (obj instanceof ReactiveState && this instanceof React.Component) {
                    obj["_resolvers"].push([ this, map ]);
                }
            }
        }
    } as ClassDecorator;
}

function define(obj: ReactiveState<any>, key: string) {
    let value: any;

    const getter = function() {
        return value;
    }

    const setter = function(newVal: any) {
        value = newVal;

        obj["_resolvers"]?.forEach(resolver => {
            if (resolver[0] == null) return;

            if (resolver[1] == null) {
                if (typeof((resolver[0].state as any)[key] !== typeof(value))) return;

                (resolver[0].state as any)[key] = value;

                resolver[0].setState({
                    key: value
                });
            } else if (resolver[1].hasOwnProperty(key)) {
                let mappedKey: string = resolver[1][key];

                if (typeof((resolver[0].state as any)[mappedKey] !== typeof(value))) return;

                (resolver[0].state as any)[mappedKey] = value;
                
                resolver[0].setState({
                    mappedKey, value
                });
            }
        });
    }

    Object.defineProperty(obj.state, key, {
        get: getter,
        set: setter
    });
}

export class ReactiveState<S extends {}> {
    private _state: S = null;

    public get state(): Readonly<S> {
        return this._state;
    }

    private _resolvers: [ component: React.Component, map: { [key: string]: any } ][] = [];

    public constructor(state: S) {
        this._state = state;

        for (let key in this.state) {
            define(this, key);
        }
    }

    public setState<K extends keyof S>(
        state: ((prevState: Readonly<S>) => (Pick<S, K> | S | null)) | (Pick<S, K> | S | null)
    ): void {
        for (let key in state) {
            (this._state as any)[key] = (state as any)[key];
        }
    }
}
