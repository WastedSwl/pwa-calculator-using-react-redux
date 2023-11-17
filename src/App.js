import React, { useState } from "react";
import Calculator from "./components/Calculator";
import Recognition from "./components/Recognition";

function App() {
  const [selectedCalculator, setSelectedCalculator] = useState(null);

  const handleCalculatorChange = (calculator) => {
    setSelectedCalculator(calculator);
  };

  return (
    <>
      <label htmlFor="calculatorSelect">Выберите калькулятор: </label>
      <select
        id="calculatorSelect"
        onChange={(e) => handleCalculatorChange(e.target.value)}
        value={selectedCalculator || ""}
      >
        <option value="" disabled hidden>
          Choose option
        </option>
        <option value="calculator">Калькулятор</option>
        <option value="recognition">ФОТО</option>
      </select>

      {selectedCalculator === "calculator" && <Calculator />}
      {selectedCalculator === "recognition" && <Recognition />}
    </>
  );
}

export default App;
