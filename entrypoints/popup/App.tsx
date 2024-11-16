import { useEffect, useState } from 'react';
import './App.css';
import RateUs from './RateUs';
import { getStorageRecord, hasStorageRecord, setStorageRecord } from '../utils/localStorage';

function App() {
  const [isToggleHighlight, setIsToggleHighlight] = useState<boolean>(false);

  useEffect(() => {
    hasStorageRecord('toggleHighlight')
      .then((value) => {
        if (!value) {
          // first time run
          return setStorageRecord('toggleHighlight', isToggleHighlight)
        }
        return new Promise((res: (value: void) => void)  => res())
      })
      .then(() => {
        return getStorageRecord('toggleHighlight')
      })
      .then((value) => {
        if (typeof value === 'boolean') {
          setIsToggleHighlight(value)
        } else {
          throw new Error(`Incorrect value type of key ${'toggleHighlight'}: ${typeof value}`)
        }
      })
      .catch((error) => {
        console.error(`Error: ${error}`);
      })
  }, [])

  return (
    <div className="p-4 bg-white-100 min-w-[20em] mx-auto text-center">
      <h1 className="text-lg font-semibold text-gray-700">Part of Speech Identifier</h1>
      <p className='py-2 text-center text-gray-800 italic'>To use this extension, </p>
      <p className="text-sm text-gray-600">
        simply select any text on the page, then right-click to open the context menu and select the "Identify parts of speech" option.
      </p>
      <p className='py-2 text-center text-gray-800 italic'>or</p>
      <div className='text-center'>
        <a className='text-[#4285f4] uppercase' target='_blank' href="https://part-of-speech-tool.info">Open the web version of this extension</a>
      </div>
      <RateUs
        negativeFeedbackUrl='https://docs.google.com/forms/d/e/1FAIpQLSdn-G6hvmwvxbsGsTwsjEY2IVplfWXHiY6yRv-v5Xj9eyJbeA/viewform'
        positiveFeedbackUrl=''
        />
    </div>
  );
}

export default App;
