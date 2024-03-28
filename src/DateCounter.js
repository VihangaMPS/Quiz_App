import {useReducer, useState} from "react";

function reducer(state, action) {
  console.log(state, action);

  /*if (action.type === 'inc' ) {
    return state + action.payload;
  }
  if (action.type === 'dec') {
    return state - action.payload;
  }
  if (action.type === 'setCount') {
    return action.payload;
  }*/

  switch (action.type) {
    case 'dec': return {...state, count: state.count - 1};
    case 'inc': return {...state, count: state.count + 1};
    case 'setCount': return {...state, count: action.payload};
    case 'setStep': return {...state, step: action.payload};

    default : throw new Error("Unknown action")
  }
}

function DateCounter() {
  //const [step, setStep] = useState(1);
  const initialState = {count: 0, step: 1};

  // const [count, setCount] = useState(0);
  const [state, dispatch] = useReducer(reducer, initialState);

const {count, step} = state;

  // This mutates the date object.
  const date = new Date("june 21 2027");
  date.setDate(date.getDate() + count);

  const dec = function () {
    // setCount((count) => count - 1);
    // setCount((count) => count - step);

    dispatch({type: 'dec', payload: -1});
  };

  const inc = function () {
    // setCount((count) => count + 1);
    // setCount((count) => count + step);

    dispatch({type: 'inc', payload: 1});
  };

  const defineCount = function (e) {
    // setCount(Number(e.target.value));
    dispatch({type: 'setCount', payload: Number(e.target.value)});
  };

  const defineStep = function (e) {
    //setStep(Number(e.target.value));
    dispatch({type: 'setStep', payload: Number(e.target.value)});
  };

  const reset = function () {
    // setCount(0);
    //setStep(1);
  };

  return (
    <div className="counter">
      <div>
        <input
          type="range"
          min="0"
          max="10"
          value={step}
          onChange={defineStep}
        />
        <span>{step}</span>
      </div>

      <div>
        <button onClick={dec}>-</button>
        <input value={count} onChange={defineCount} />
        <button onClick={inc}>+</button>
      </div>

      <p>{date.toDateString()}</p>

      <div>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
}
export default DateCounter;
