# Reactive
Typescript state management library for React. 

## Binding example

```typescript

let sourceOfTruth = new ReactiveStore({
    version: "1.0.0"
});

@bind(sourceOfTruth)
class Component extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            version: sourceOfTruth.state.version
        }
    }
}

```
