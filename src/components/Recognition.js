import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import * as Tesseract from 'tesseract.js';
import * as math from 'mathjs';
import { clipboard } from 'clipboard-polyfill';
import './styles/Recognition.css'; //

const CalculatorApp = () => {
  const [result, setResult] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [showAnotherExampleButton, setShowAnotherExampleButton] = useState(false);

  const onDrop = async (acceptedFiles) => {
    const newImage = acceptedFiles[0];

    if (newImage) {
      setLoading(true);

      setImage(newImage);
      setImageUploaded(true);

      const { data: { text } } = await Tesseract.recognize(newImage, 'eng');
      const expression = text.replace(/[^0-9+\-*/().x]/g, ''); // Добавляем "x" для переменных

      try {
        // Имитация задержки в 5 секунд
        setTimeout(() => {
          const solvedEquation = solveEquation(expression);
          setResult(solvedEquation);
          setLoading(false);
          setShowAnotherExampleButton(true);
        }, 5000);
      } catch (error) {
        setResult('Ошибка в уравнении');
        setLoading(false);
        setShowAnotherExampleButton(true);
      }
    }
  };

  const onPaste = async (event) => {
    const clipboardData = event.clipboardData || window.clipboardData;
    const items = clipboardData.items;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf('image') !== -1) {
        setLoading(true);

        const blob = item.getAsFile();
        const reader = new FileReader();

        reader.onload = async () => {
          const base64Image = reader.result.split(',')[1];
          const buffer = Buffer.from(base64Image, 'base64');
          const blobImage = new Blob([buffer], { type: 'image/png' });

          setImage(blobImage);
          setImageUploaded(true);

          const { data: { text } } = await Tesseract.recognize(blobImage, 'eng');
          const expression = text.replace(/[^0-9+\-*/().x]/g, ''); // Добавляем "x" для переменных

          try {
            // Имитация задержки в 5 секунд
            setTimeout(() => {
              const solvedEquation = solveEquation(expression);
              setResult(solvedEquation);
              setLoading(false);
              setShowAnotherExampleButton(true);
            }, 5000);
          } catch (error) {
            setResult('Ошибка в уравнении');
            setLoading(false);
            setShowAnotherExampleButton(true);
          }
        };

        reader.readAsDataURL(blob);
        break;
      }
    }
  };

  // Добавляем функцию для решения уравнения
  const solveEquation = (equation) => {
    try {
      // Пример упрощенного решения для демонстрации
      // Реальный код для обработки уравнений может быть более сложным
      const solvedEquation = math.simplify(equation);
      return solvedEquation.toString();
    } catch (error) {
      throw new Error('Ошибка при решении уравнения');
    }
  };

  const resetState = () => {
    setResult(null);
    setImage(null);
    setLoading(false);
    setImageUploaded(false);
    setShowAnotherExampleButton(false);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'image/*' });

  useEffect(() => {
    document.addEventListener('paste', onPaste);
    return () => {
      document.removeEventListener('paste', onPaste);
    };
  }, []);

  return (
    <div>
      {!imageUploaded && (
        <div {...getRootProps()} style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center' }}>
          <input {...getInputProps()} />
          <p>Перетащите сюда изображение с математическим примером</p>
          <p>Или вставьте изображение (Ctrl+V)</p>
        </div>
      )}
      {loading && <p>Loading...</p>}
      {result && (
        <div>
          <img src={URL.createObjectURL(image)} alt="Math problem" style={{ maxWidth: '100%' }} />
          <p>Решение: {result}</p>
          {showAnotherExampleButton && (
            <button onClick={resetState}>Решить еще один пример</button>
          )}
        </div>
      )}
    </div>
  );
};

export default CalculatorApp;
