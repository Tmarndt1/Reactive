# Reactive
Typescript state management library for React. 

## Binding example

```typescript

// Create a ReactiveStore to bind the class Component
let sourceOfTruth = new ReactiveStore({
    version: "1.0.0"
});

// Binding the ReactiveStore to the class Component will auto render the Component when the then the version changes.
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
