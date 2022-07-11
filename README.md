# Reactive
Typescript state management library for React with the goal to simplify the the way React developers setState. With Reactive, a developer can simply apply a bind attribute to a class component to auto dispatch updates to the component's state.

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
