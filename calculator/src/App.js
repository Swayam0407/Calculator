import React, { useReducer, useEffect } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";
import "./App.css";

const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose",
  CLEAR: "clear",
  DEL_DIGIT: "delete",
  EVALUATE: "evaluate",
};

function App() {

  const INTEGER_FORMAT = new Intl.NumberFormat("en-us",{
    maximumFractionDigits:0,
  })

  function format(operand){
    if(operand==null)return
    const[integer, decimal]=operand.split(".")
  
  if(decimal==null)return INTEGER_FORMAT.format(integer)
   
return `${INTEGER_FORMAT.format(integer)}.${decimal}`;

  }


  function reducer(state, { type, payload }) {
    switch (type) {
      case ACTIONS.ADD_DIGIT:
        if (state.overwrite) {
          return {
            ...state,
            currentOperand: payload.digit,
            overwrite: false,
          };
        }
        if (payload.digit === "0" && state.currentOperand === "0") {
          return state;
        }
        if (payload.digit === "." && state.currentOperand.includes(".")) {
          return state;
        }
        return {
          ...state,
          currentOperand: `${state.currentOperand || ""}${payload.digit}`,
        };

      case ACTIONS.CLEAR:
        return {
          currentOperand: "",
          previousOperand: null,
          operation: null,
          overwrite: false,
        };

      case ACTIONS.EVALUATE:
        if (
          state.operation == null ||
          state.currentOperand == null ||
          state.previousOperand == null
        ) {
          return state;
        }

        return {
          ...state,
          overwrite: true,
          operation: null,
          previousOperand: null,
          currentOperand: evaluate(state),
        };

       case ACTIONS.DEL_DIGIT:
        if(state.overwrite){
          return {
          ...state,
          overwrite:false,
          currentOperand:null,
        }
      }
        if(state.currentOperand==null)return state

        if(state.currentOperand.length===1){
          return {...state, currentOperand:null}
        }

        return{
          ...state,
          currentOperand:state.currentOperand.slice(0,-1),
        }
      

      case ACTIONS.CHOOSE_OPERATION:
        if (state.currentOperand == null && state.previousOperand == null) {
          return state;
        }
        if (state.previousOperand == null) {
          return {
            ...state,
            operation: payload.operation,
            previousOperand: state.currentOperand,
            currentOperand: null,
          };
        }

        if (state.currentOperand == null) {
          return {
            ...state,
            operation: payload.operation,
          };
        }

        return {
          ...state,
          previousOperand: evaluate(state),
          operation: payload.operation,
          currentOperand: null,
        };

      default:
        return state;
    }
  }

  function evaluate({ currentOperand, previousOperand, operation }) {
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    if (isNaN(prev) || isNaN(current)) return "";

    let computation = "";
    switch (operation) {
      case "+":
        computation = prev + current;
        break;

      case "-":
        computation = prev - current;
        break;

      case "*":
        computation = prev * current;
        break;

      case "/":
        computation = prev / current;
        break;

      default:
        return "";
    }

    return computation.toString();
  }

  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {
      currentOperand: "",
      previousOperand: null,
      operation: null,
      overwrite: false,
    }
  );

  useEffect(() => {
    function handleKeyboardInput(event) {
      const { key } = event;

      if (/\d/.test(key)) {
        dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: key } });
      } else if (key === ".") {
        dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: key } });
      } else if (key === "+" || key === "-" || key === "*" || key === "/") {
        dispatch({
          type: ACTIONS.CHOOSE_OPERATION,
          payload: { operation: key },
        });
      } else if (key === "Enter") {
        dispatch({ type: ACTIONS.EVALUATE });
      } else if (key === "Escape") {
        dispatch({ type: ACTIONS.CLEAR });
      }
    }

    document.addEventListener("keydown", handleKeyboardInput);

    return () => {
      document.removeEventListener("keydown", handleKeyboardInput);
    };
  }, []);

  return (
    <div className="conatiner">
      <div className="calculator-grid">
        <div className="Output">
          <div className="Previous">
            {format(previousOperand)} {operation}
          </div>
          <div className="Current">{format(currentOperand)}</div>
        </div>
        <button
          className="span-two"
          onClick={() => dispatch({ type: ACTIONS.CLEAR })}
        >
          AC
        </button>
        <button onClick={() => dispatch({ type: ACTIONS.DEL_DIGIT })}>
          DEL
        </button>
        <OperationButton operation="/" dispatch={dispatch} />
        <DigitButton digit="1" dispatch={dispatch} />
        <DigitButton digit="2" dispatch={dispatch} />
        <DigitButton digit="3" dispatch={dispatch} />
        <OperationButton operation="*" dispatch={dispatch} />
        <DigitButton digit="4" dispatch={dispatch} />
        <DigitButton digit="5" dispatch={dispatch} />
        <DigitButton digit="6" dispatch={dispatch} />
        <OperationButton operation="+" dispatch={dispatch} />
        <DigitButton digit="7" dispatch={dispatch} />
        <DigitButton digit="8" dispatch={dispatch} />
        <DigitButton digit="9" dispatch={dispatch} />
        <OperationButton operation="-" dispatch={dispatch} />
        <DigitButton digit="." dispatch={dispatch} />
        <DigitButton digit="0" dispatch={dispatch} />
        <button
          className="span-two"
          onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
          onKeyDown={(e) =>
            e.key === "Enter" && dispatch({ type: ACTIONS.EVALUATE })
          }
        >
          =
        </button>
      </div>
      <footer className="footer">@swayam_aggarwal</footer>
    </div>
  );
}

export default App;
export { ACTIONS };
