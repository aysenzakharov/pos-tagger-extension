import { useEffect, useState } from 'react';
import './App.css';
import RateUs from './RateUs';
import { FormControlLabel, FormGroup, Switch } from '@mui/material';
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
    <>
      <h2>Part-of-speech Identifier</h2>
      <div className="card">
        <FormGroup>
          <FormControlLabel
            control={
              <Switch checked={isToggleHighlight} onChange={(e, checked) => {
                setIsToggleHighlight(checked)
                setStorageRecord('toggleHighlight', checked)
              }}/>
            }
            label="Activate Magic Wand for Text Selection"
          />
        </FormGroup>
      </div>
      <p className="read-the-docs" hidden={!isToggleHighlight}>
      Magic Wand mode is enabled! Select any text on the page with your cursor to see the magic happen.
      </p>
      <RateUs
        negativeFeedbackUrl='https://docs.google.com/forms/d/e/1FAIpQLSdn-G6hvmwvxbsGsTwsjEY2IVplfWXHiY6yRv-v5Xj9eyJbeA/viewform'
        positiveFeedbackUrl=''
        />
    </>
  );
}

export default App;
