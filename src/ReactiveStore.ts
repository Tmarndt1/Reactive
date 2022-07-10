
function define(obj: ReactiveStore<any>, key: string) {
    let value: any;

    const getter = function() {
        return value;
    }

    const setter = function(newVal: any) {
        value = newVal;

        obj["_resolvers"]?.forEach(resolver => {
            if (resolver[0] == null) return;

            // If the caller hasn't overridden the state keys to map to, then the algorithm will use the same key from the 
            // reactive state as the component's state key if there is a match
            if (resolver[1] == null) {
                // Ensure the types match before setting state
                if (typeof((resolver[0].state as any)[key]) !== typeof(value)) return;

                (resolver[0].state as any)[key] = value;

                resolver[0].setState({
                    key: value
                });
            }
            // Otherwise check if the caller has provided a map from reactive state to the component's state 
            else if (resolver[1].hasOwnProperty(key)) {
                let mappedKey: string = resolver[1][key];

                // Ensure the types match before setting state
                if (typeof((resolver[0].state as any)[mappedKey]) !== typeof(value)) return;

                (resolver[0].state as any)[mappedKey] = value;
                
                resolver[0].setState({
                    mappedKey: value
                });
            }
        });
    }

    Object.defineProperty(obj.state, key, {
        get: getter,
        set: setter
    });
}

/**
 * ReactiveStore class provides the functionality to override the get and set methods on the provided objects properties and listen for state changes. 
 * If the state changes, all applicable (from key map) and listening components will be notified.
 */
export class ReactiveStore<S extends {}> {
    private _state: S = null;

    /**
     * Gets the state of the ReactiveStore
     */
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

    /**
     * Sets the state of the ReactiveStore
     * @param {Pick<S, K>} state the optional key values to set in the ReactiveStore's state 
     */
    public setState<K extends keyof S>(
        state: ((prevState: Readonly<S>) => (Pick<S, K> | S | null)) | (Pick<S, K> | S | null)
    ): void {
        for (let key in state) {
            (this._state as any)[key] = (state as any)[key];
        }
    }
}