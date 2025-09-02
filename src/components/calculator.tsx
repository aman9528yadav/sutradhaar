
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Clock, RefreshCw, Trash2, RotateCcw, Divide, X, Minus, Plus, Equal, Delete } from 'lucide-react';

const buttonClasses = {
  gray: "bg-gray-700 hover:bg-gray-600 text-white",
  blue: "bg-blue-500 hover:bg-blue-400 text-white",
  dark: "bg-gray-800 hover:bg-gray-700 text-white",
  operator: "bg-primary text-primary-foreground hover:bg-primary/90 text-2xl"
};

const CalculatorButton = ({
  onClick,
  label,
  className = "",
  span = "col-span-1",
}: {
  onClick: () => void;
  label: React.ReactNode;
  className?: string;
  span?: string;
}) => (
  <Button
    onClick={onClick}
    className={`h-20 text-3xl rounded-xl ${span} ${className}`}
  >
    {label}
  </Button>
);

export function Calculator() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState<string[]>([]);

  const handleButtonClick = (value: string) => {
    if (result) {
        setExpression(result + value);
        setResult('');
    } else {
        setExpression(prev => prev + value);
    }
  };

  const handleClear = () => {
    setExpression('');
    setResult('');
  };

  const handleBackspace = () => {
    if (result) {
        setExpression('');
        setResult('');
    } else {
        setExpression(prev => prev.slice(0, -1));
    }
  };

  const handleCalculate = () => {
    try {
      // Avoid using eval in production. This is a simplified example.
      // A safer approach would be to use a library like math.js
      const evalResult = new Function('return ' + expression)();
      const formattedResult = evalResult.toLocaleString(undefined, { maximumFractionDigits: 5, useGrouping: true });
      setResult(formattedResult);
      const newHistoryEntry = `${expression} = ${formattedResult}`;
      setHistory(prev => [newHistoryEntry, ...prev]);
    } catch (error) {
      setResult('Error');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-4 text-white">
        <div className="bg-card p-4 rounded-xl flex flex-col gap-4">
            {/* Display */}
            <div className="text-right h-28 flex flex-col justify-end p-4">
                <p className="text-3xl text-gray-400 break-all">{expression}</p>
                <p className="text-6xl font-bold break-all">{result || ' '}</p>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-4 gap-3">
                <CalculatorButton onClick={() => {}} label="e" className={buttonClasses.gray} />
                <CalculatorButton onClick={() => {}} label="μ" className={buttonClasses.gray} />
                <CalculatorButton onClick={() => {}} label="sin" className={buttonClasses.gray} />
                <CalculatorButton onClick={() => {}} label="deg" className={buttonClasses.gray} />

                <CalculatorButton onClick={handleClear} label="AC" className={buttonClasses.gray} />
                <CalculatorButton onClick={handleBackspace} label={<Delete />} className={buttonClasses.gray} />
                <CalculatorButton onClick={() => handleButtonClick('/')} label={<Divide />} className={buttonClasses.operator} />
                <CalculatorButton onClick={() => handleButtonClick('*')} label={<X />} className={buttonClasses.operator} />

                <CalculatorButton onClick={() => handleButtonClick('7')} label="7" className={buttonClasses.dark} />
                <CalculatorButton onClick={() => handleButtonClick('8')} label="8" className={buttonClasses.dark} />
                <CalculatorButton onClick={() => handleButtonClick('9')} label="9" className={buttonClasses.dark} />
                <CalculatorButton onClick={() => handleButtonClick('-')} label={<Minus />} className={buttonClasses.operator} />

                <CalculatorButton onClick={() => handleButtonClick('4')} label="4" className={buttonClasses.dark} />
                <CalculatorButton onClick={() => handleButtonClick('5')} label="5" className={buttonClasses.dark} />
                <CalculatorButton onClick={() => handleButtonClick('6')} label="6" className={buttonClasses.dark} />
                <CalculatorButton onClick={() => handleButtonClick('+')} label={<Plus />} className={buttonClasses.operator} />

                <CalculatorButton onClick={() => handleButtonClick('1')} label="1" className={buttonClasses.dark} />
                <CalculatorButton onClick={() => handleButtonClick('2')} label="2" className={buttonClasses.dark} />
                <CalculatorButton onClick={() => handleButtonClick('3')} label="3" className={buttonClasses.dark} />
                <CalculatorButton onClick={handleCalculate} label={<Equal />} className={`${buttonClasses.operator} row-span-2`} />

                <CalculatorButton onClick={() => handleButtonClick('0')} label="0" className={`${buttonClasses.dark} col-span-2`} />
                <CalculatorButton onClick={() => handleButtonClick('.')} label="." className={buttonClasses.dark} />

            </div>
        </div>
         {history.length > 0 && (
          <div className="bg-card p-4 rounded-xl flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg flex items-center gap-2"><Clock size={20} /> History</h3>
                <RefreshCw size={18} className="text-muted-foreground cursor-pointer hover:text-white" onClick={() => setHistory([])}/>
              </div>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                  {history.slice(0, 5).map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 rounded hover:bg-background group">
                        <span>{item}</span>
                         <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash2 size={16} className="cursor-pointer hover:text-white" onClick={() => setHistory(h => h.filter((_, i) => i !== index))} />
                        </div>
                      </div>
                  ))}
              </div>
          </div>
      )}
    </div>
  );
}

