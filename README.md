# Reactive
Typescript state management library for React. 

## Binding example

```typescript

let stateOfTruth = new ReactiveState({
    version: "1.0"
});

@bind(state)
class Component extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            version: stateOfTruth.state.version
        }
    }
}

```
