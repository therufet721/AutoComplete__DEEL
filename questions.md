### Answers to Questions (Part 2):

1. **Component vs PureComponent**:
   - `React.Component` does not implement `shouldComponentUpdate()`, meaning it always re-renders when state or props change.
   - `React.PureComponent` implements `shouldComponentUpdate()` with a shallow prop and state comparison, which can prevent re-renders if data structures haven't changed at the surface level.
   - **Break Example**: If you have complex objects or arrays in props, PureComponent might not re-render if only the internal data of the objects changes, because the shallow comparison doesn't detect deep changes.

```jsx
import React, { Component, PureComponent } from 'react';

class MyComponent extends Component {
  render() {
    console.log('MyComponent rendered');
    return <div>{this.props.children}</div>;
  }
}

class MyPureComponent extends PureComponent {
  render() {
    console.log('MyPureComponent rendered');
    return <div>{this.props.children}</div>;
  }
}

// Usage
const App = () => (
  <div>
    <MyComponent key={Math.random()}>Normal Component</MyComponent>
    <MyPureComponent key={Math.random()}>Pure Component</MyPureComponent>
  </div>
);

// In this example, both components will re-render every time App does, 
// but MyPureComponent will log less frequently if props and state haven't changed, 
// potentially avoiding unnecessary renders.
```

2. **Context + ShouldComponentUpdate**:
   - Using `shouldComponentUpdate` in a component that consumes Context can be problematic because `shouldComponentUpdate` does not consider changes in Context, only props and state. If Context is the only thing changing, the component won't re-render, potentially leading to bugs.

```jsx
import React, { Component, createContext } from 'react';

const MyContext = createContext();

class MyComponent extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.someValue !== this.props.someValue;
  }

  render() {
    return (
      <MyContext.Consumer>
        {value => <div>{value}</div>}  // This won't update if context value changes
      </MyContext.Consumer>
    );
  }
}
```

3. **Passing Information to Parent**:
   - **Props**: Parent can pass a function as a prop that children can call.
   - **Callback Functions**: Child invokes a parent's function with data as arguments.
   - **Lifting State Up**: Share state by moving it to the parent component and passing it down via props.

```jsx
import React, { useState } from 'react';

function Child({ onValueChange }) {
  return <button onClick={() => onValueChange('New Value')}>Change Value</button>;
}

function Parent() {
  const [value, setValue] = useState('');

  return (
    <div>
      <Child onValueChange={setValue} />
      Value in Parent: {value}
    </div>
  );
}
```

4. **Prevent Re-rendering**:
   - **React.memo**: Wraps a component to prevent re-rendering if props haven't changed.
   - **shouldComponentUpdate**: Implement this method to manually decide when to re-render.


**Using React.memo**

```jsx
import React, { memo } from 'react';

const MyComponent = memo(({ value }) => {
  console.log('Rendered:', value);
  return <div>{value}</div>;
});
```

**Using shouldComponentUpdate**

```jsx
import React, { Component } from 'react';

class MyComponent extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.value !== this.props.value;
  }

  render() {
    console.log('Rendered:', this.props.value);
    return <div>{this.props.value}</div>;
  }
}
```

5. **React Fragment**:
   - Fragments let you group a list of children without adding extra nodes to the DOM.
   - **Break Example**: If you rely on a parent component CSS that targets direct child selectors, using a fragment can disrupt this as it doesn't produce a DOM element.



```jsx
import React from 'react';

function MyComponent() {
  return (
    <>
      <h1>Title</h1>
      <p>Description here</p>
    </>
  );
}
```

6. **Examples of HOC (High-Order Component)**:
   - **withUser**: Enhances a component with user data fetched from a server.
   - **withLogger**: Adds logging functionality to any component.
   - **withTheme**: Provides theme-related props to components.

**withUser HOC**

```jsx
function withUser(Component) {
  return function WrappedComponent(props) {
    const user = { name: 'John Doe' };  // Simulated user data
    return <Component {...props} user={user} />;
  };
}

// Usage
const UserComponent = ({ user }) => <div>Hello, {user.name}</div>;
const EnhancedComponent = withUser(UserComponent);
```

7. **Exception Handling**:
   - **Promises**: Use `.catch()` for error handling.
   - **Callbacks**: Handle errors in the callback function, usually as the first argument.
   - **Async/Await**: Use `try/catch` blocks for errors.

```jsx
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
}
```

8. **setState Arguments and Async Nature**:
   - Takes two arguments: `updater` function or object, and an optional callback function.
   - It's asynchronous to optimize performance and batching updates.

```jsx
import React, { Component } from 'react';

class MyComponent extends Component {
  state = { count: 0 };

  increment = () => {
    this.setState((prevState) => ({
      count: prevState.count + 1
    }), () => console.log('Count updated:', this.state.count));
  };

  render() {
    return <button onClick={this.increment}>Increment</button>;
  }
}
```

9. **Migrating Class to Function Component**:
   - Replace `state` with `useState`.
   - Convert lifecycle methods (`componentDidMount`, etc.) to `useEffect`.
   -

 Replace `this.props` and `this.state` with props and hooks.

**Before (Class Component)**

```jsx
import React, { Component } from 'react';

class MyComponent extends Component {
  state = { count: 0 };

  increment = () => {
    this.setState({ count: this.state.count + 1 });
  };

  render() {
    return <button onClick={this.increment}>Count: {this.state.count}</button>;
  }
}
```

**After (Function Component)**

```jsx
import React, { useState } from 'react';

function MyComponent() {
  const [count, setCount] = useState(0);

  const increment = () => setCount(count + 1);

  return <button onClick={increment}>Count

: {count}</button>;
}
```

10. **Ways to Style Components**:
    - Inline styles using the `style` attribute.
    - CSS Modules for component-scoped styles.
    - Styled Components for dynamic styles.

**Inline Styles**

```jsx
const MyComponent = () => <div style={{ color: 'blue', fontSize: '14px' }}>Hello</div>;
```

**CSS Modules**

```jsx
// Assuming styles.module.css is imported
import styles from './styles.module.css';

const MyComponent = () => <div className={styles.myComponent}>Hello</div>;
```

11. **Rendering HTML from Server**:
    - Use `dangerouslySetInnerHTML` property to set HTML content directly from a string, being cautious about XSS risks.

```jsx
function DangerousComponent({ htmlString }) {
  return <div dangerouslySetInnerHTML={{ __html: htmlString }} />;
}

// Usage
const htmlContent = '<strong>Warning:</strong> This is from the server.';
```



