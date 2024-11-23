import { useEffect, useState } from 'react';
import './App.css';
import RateUs from './RateUs';
import { getStorageRecord, hasStorageRecord, setStorageRecord } from '../utils/localStorage';
import POSTagger from './POSTagger';

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
    <div className="p-4 bg-white-100 min-w-[40em] mx-auto">
      <h1 className="text-lg font-semibold text-gray-700 text-center">Part of Speech Identifier</h1>
      <POSTagger/>
      <div className='my-4'>
        <a className='text-[#4285f4] uppercase' target='_blank' href="https://part-of-speech-tool.info">Open the web version of this extension</a>
      </div>
      <RateUs
        negativeFeedbackUrl='https://docs.google.com/forms/d/e/1FAIpQLSdn-G6hvmwvxbsGsTwsjEY2IVplfWXHiY6yRv-v5Xj9eyJbeA/viewform'
        positiveFeedbackUrl='https://chromewebstore.google.com/detail/part-of-speech-identifier/oimigldckaamflcomakgjkkkahfopfkm'
        />
    </div>
  );
}

export default App;
