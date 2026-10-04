import React from 'react';

const App = () => {
    const [count, setCount] = React.useState(0);

    const increment = () => {
        setCount(count + 1);
    };

    const reset = () => {
        setCount(0);
    };

    const decrement = () => {
        setCount(count - 1);
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <h1>Counter App</h1>

            <div>{count}</div>

            <button onClick={increment}>+</button>
            <button onClick={reset}>Reset</button>
            <button onClick={decrement}>-</button>
        </div>
    );
};

export default App;