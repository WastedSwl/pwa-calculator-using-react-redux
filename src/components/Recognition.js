import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import * as Tesseract from 'tesseract.js';
import * as math from 'mathjs';

const CalculatorApp = () => {
  const [result, setResult] = useState(null);

  const onDrop = async (acceptedFiles) => {
    const image = acceptedFiles[0];

    if (image) {
      const { data: { text } } = await Tesseract.recognize(image, 'eng');
      const expression = text.replace(/[^0-9+\-*/().]/g, '');
      
      try {
        const calculatedResult = math.evaluate(expression);
        setResult(calculatedResult);
      } catch (error) {
        setResult('Ошибка в выражении');
      }
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'image/*' });

  return (
    <div>
      <div {...getRootProps()} style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center' }}>
        <input {...getInputProps()} />
        <p>Перетащите сюда изображение с математическим примером</p>
      </div>
      {result && <p>Результат: {result}</p>}
    </div>
  );
};

export default CalculatorApp;
