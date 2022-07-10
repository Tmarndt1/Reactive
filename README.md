# TsExtensions
Typescript library comprised of multiple reusable decorators

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
