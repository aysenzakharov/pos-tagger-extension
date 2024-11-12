import { useEffect, useState } from 'react'
import { Rating, Stack, Typography } from '@mui/material'

export const RATING_KEY = 'app_rating_score'

function RateUs({ negativeFeedbackUrl, positiveFeedbackUrl }: { negativeFeedbackUrl: string, positiveFeedbackUrl: string }) {
  const [rating, setRating] = useState<number | null>(0)

  useEffect(() => {
    browser.storage.local.get(RATING_KEY)
      .then((items) => {
        if (RATING_KEY in items) {
          let rating = items[RATING_KEY]
          setRating(+rating)
        }
      })
      .catch((error: Error) => {
        console.error('Read error in browser.storage:', error);
      })
  }, [])

  const handleClick = (e: React.SyntheticEvent, r: number | null) => {
    if (r === null) throw new Error('rating is null')
    setRating(r)

    if (r > 3) {
      window.open(positiveFeedbackUrl, '_blank', 'noreferrer')
    } else {
      window.open(negativeFeedbackUrl, '_blank', 'noreferrer')
    }

    browser.storage.local.set({ [RATING_KEY]: r })
  }

  return (<>
    <Stack direction={'row'} className="rating-widget" justifyContent={'center'} alignItems={'center'} paddingTop={'3px'}>
      <Typography variant={'body2'} sx={{ marginRight: '5px' }}>Rate us</Typography>
      <Rating
        name="size-small"
        value={rating}
        size="small"
        sx={{ marginRight: '10px' }}
        onChange={handleClick}
      />
    </Stack>
  </>)
}

export default RateUs