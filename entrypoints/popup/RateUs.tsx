import { useEffect, useState } from 'react'
import { Rating } from '@mui/material'
import { getStorageRecord, hasStorageRecord, setStorageRecord } from '../utils/localStorage';

export const RATING_KEY = 'app_rating_score'

function RateUs({ negativeFeedbackUrl, positiveFeedbackUrl }: { negativeFeedbackUrl: string, positiveFeedbackUrl: string }) {
  const [rating, setRating] = useState<number | null>(0)

  useEffect(() => {
    hasStorageRecord(RATING_KEY)
      .then((value) => {
        if (!value) {
          return setStorageRecord(RATING_KEY, 0)
        }
        return new Promise((res: (value: void) => void) => res())
      })
      .then(() => {
        return getStorageRecord(RATING_KEY)
      })
      .then((r) => {
          setRating(+r)
      })
      .catch((error: Error) => {
        console.error('Read error in browser.storage:', error);
      })
  }, [])

  const handleClick = (e: React.SyntheticEvent, r: number | null) => {
    if (r == null) throw new Error('rating is null')
    setRating(r)
    setStorageRecord(RATING_KEY, r)
      .finally(() => {
        window.open(r > 3 ? positiveFeedbackUrl : negativeFeedbackUrl, '_blank', 'noreferrer')
      })
  }

  return (<>
    <div className="py-4 grid grid-cols-2">
      <p>Do you enjoy it?</p>
      <Rating
        name="size-small"
        value={rating}
        size="small"
        onChange={handleClick}
      />
    </div>
  </>)
}

export default RateUs