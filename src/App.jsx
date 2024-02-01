import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import axios from 'axios';

const BuscarPerro = () => {
  const [numero, setNumero] = useState('');
  const [images, setImages] = useState([]);
  const { transcript, browserSupportsSpeechRecognition, resetTranscript } = useSpeechRecognition();

  const convertirpalabrasanumeros = (word) => {
    const numberMap = {
      uno: '1',
      dos: '2',
      tres: '3',
      cuatro: '4',
      cinco: '5',
      seis: '6',
      siete: '7',
      ocho: '8',
      nueve: '9',
      diez: '10',
    };
    return numberMap[word] || word;
  };

  const getImagenesPerros = async () => {
    try {
      const convertedNumero = convertirpalabrasanumeros(numero.toLowerCase());
      const apiKey = 'live_Epxkld1ZIROgnl5nmPvkp4DlyQ1FlXGXQToYkIe68ZtN8lbVsMwpUXENHZY765Gm';
      const response = await axios.get(`https://api.thedogapi.com/v1/images/search?limit=${convertedNumero}`, {
        headers: {
          'x-api-key': apiKey,
        },
      });
      console.log('API Response:', response.data);
      setImages(response.data);
    } catch (error) {
      console.error('Error haciendo el fetch a la imagen:', error);
    }
  };

  useEffect(() => {
    if (transcript) {
      setNumero(convertirpalabrasanumeros(transcript.toLowerCase()));
    }
  }, [transcript]);

  useEffect(() => {
    if (numero) {
      getImagenesPerros();
      resetTranscript();
    }
  }, [numero, resetTranscript]);

  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  return (
    <div>
      <h1>App por voz para mostrar fotos de perros segun el numero que digas.</h1>
      <p>Al darle al botón de empezar, debes decir el número de fotos de perros que quieres buscar:</p>
      <p>Maximo 10 perros para que la pobre api no chashee, si pides mas de 10 a parte de que la app no te lo reconocera la api te daria un maximo de 10 imagenes</p>

      <div>
        <button onClick={() => SpeechRecognition.startListening()}>Empezar</button>
        <button onClick={() => SpeechRecognition.stopListening()}>Parar</button>
      </div>

      <div>
        {images.length > 0 && (
          <div>
            <h2>{`Imagenes de ${numero} perros`}</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {images.map((image, index) => (
                <img key={index} src={image.url} alt={`Dog ${index + 1}`} style={{ width: '200px', margin: '10px' }} />
              ))}
            </div>
            <h2>Miralos que lindos 🥰🥰</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuscarPerro;

