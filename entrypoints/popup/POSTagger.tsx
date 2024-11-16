import React, { useCallback, useEffect, useState } from 'react';
import './POSTagger.css';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { Button, CircularProgress, LinearProgress } from '@mui/material';
import { getTags, Tag } from './../utils/backend'
import BorderColorIcon from '@mui/icons-material/BorderColor';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

export const tagsColors = [
    { code: 'ADJ', color: 'hsla(30, 90%, 70%, 0.5)', name: 'Adjective' },  // Красный
    { code: 'ADP', color: 'hsla(120, 90%, 60%, 0.5)', name: 'Adposition' },  // Ярко-зеленый
    { code: 'ADV', color: 'hsla(160, 80%, 60%, 0.5)', name: 'Adverb' },  // Зеленый
    { code: 'AUX', color: 'hsla(210, 80%, 75%, 0.5)', name: 'Auxiliary' },  // Голубой
    { code: 'CCONJ', color: 'hsla(220, 90%, 50%, 0.5)', name: 'Coordinating conjunction' },  // Яркий синий
    { code: 'DET', color: 'hsla(300, 90%, 60%, 0.5)', name: 'Determiner' },  // Пурпурный
    { code: 'INTJ', color: 'hsla(10, 80%, 80%, 0.5)', name: 'Interjection' },  // Оранжевый
    { code: 'NOUN', color: 'hsla(60, 80%, 60%, 0.5)', name: 'Noun' },  // Желтый
    { code: 'NUM', color: 'hsla(100, 80%, 75%, 0.5)', name: 'Numeral' },  // Светло-зеленый
    { code: 'PART', color: 'hsla(170, 80%, 75%, 0.5)', name: 'Particle' },  // Легкий зеленый
    { code: 'PRON', color: 'hsla(220, 70%, 80%, 0.5)', name: 'Pronoun' },  // Синий-зеленый
    { code: 'PROPN', color: 'hsla(270, 90%, 50%, 0.5)', name: 'Proper noun' },  // Фиолетовый
    { code: 'PUNCT', color: 'hsla(320, 90%, 50%, 0.5)', name: 'Punctuation' },  // Ярко-розовый
    { code: 'SCONJ', color: 'hsla(350, 90%, 60%, 0.5)', name: 'Subordinating conjunction' },  // Красно-фиолетовый
    { code: 'SYM', color: 'hsla(30, 80%, 85%, 0.5)', name: 'Symbol' },  // Яркий оранжевый
    { code: 'VERB', color: 'hsla(240, 90%, 45%, 0.5)', name: 'Verb' },  // Темно-синий
    { code: 'X', color: 'hsla(130, 80%, 75%, 0.5)', name: 'Other' }  // Зеленый
]

const SAMPLE_TEXT = `Once upon a time, in a quiet village nestled between misty mountains, there lived a boy named Finn. Every morning, he would climb to the top of the tallest hill to watch the sun rise over the valley, painting the world in shades of gold.

Finn dreamed of adventure beyond the village, of discovering lands unknown and meeting creatures of legend. The villagers often laughed, saying he had his head in the clouds, but Finn’s curiosity only grew with each passing day.`

export default function POSTagger() {
    const [text, setText] = useState<string>(SAMPLE_TEXT)
    const [isTagMode, setIsTagMode] = useState<boolean>(false)
    const [tags, setTags] = useState<Tag[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isTextFromUrl, setIsTextFromUrl] = useState<boolean>(false)
    
    const onButtonClick = useCallback(() => {
        if (isTagMode) {
            setIsTagMode(false)
            return
        }
        if (text === '') return
        setIsLoading(true)
        getTags(text).then(setTags).finally(() => {
            setIsTagMode(true)
            setIsLoading(false)
        })
    }, [isTagMode, text])
    
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const t = urlParams.get('text');
        if (t !== null) {
            setIsTextFromUrl(true)
            setText(t)
        }
        onButtonClick()
    }, [])
    
    useEffect(() => {
        if (isTextFromUrl) {
            setIsTextFromUrl(false)
            onButtonClick()
        }
    }, [text, isTextFromUrl, onButtonClick])
    
    return (
        <>
        <strong>{isTagMode ? 'Tags' : 'Text'}:</strong>
        {isLoading ? <LinearProgress className='my-1' hidden={!isLoading} /> : <></>}
        <div className=''>
            <TextareaAutosize
                hidden={isTagMode}
                className='whitespace-pre-wrap w-full my-2 text-sm font-normal font-sans leading-normal p-3 rounded-xl rounded-br-none shadow-lg shadow-slate-100 dark:shadow-slate-900 focus:shadow-outline-purple dark:focus:shadow-outline-purple focus:shadow-lg border border-solid border-slate-300 hover:border-purple-500 dark:hover:border-purple-500 focus:border-purple-500 dark:focus:border-purple-500 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-300 focus-visible:outline-0 box-border'
                aria-label="empty textarea"
                placeholder="Empty"
                minRows={6}
                value={text}
                onChange={(e) => setText(e.target.value != null ? e.target.value : '')}
            />
            <div
                hidden={!isTagMode}
                className='whitespace-pre-wrap w-full my-2 text-sm font-normal font-sans leading-normal p-3 rounded-xl rounded-br-none shadow-lg shadow-slate-100 dark:shadow-slate-900 focus:shadow-outline-purple dark:focus:shadow-outline-purple focus:shadow-lg border border-solid border-slate-300 hover:border-purple-500 dark:hover:border-purple-500 focus:border-purple-500 dark:focus:border-purple-500 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-300 focus-visible:outline-0 box-border'
            >
                {tags.map((tag, i) => 
                    tag[1] === 'SPACE' ? tag[0]:
                    <span
                        key={'tag-id-' + i}
                        data-processed={true}
                        style={{
                            backgroundColor: tagsColors.find(t => t.code === tag[1])?.color || 'hsla(0, 0%, 80%, 0.5)'
                        }}
                    >
                        {tag[0]}
                        <div className='tooltip text-center'>
                            <p>{tagsColors.find(t => t.code === tag[1])?.name}</p>
                            <span>▼</span>
                        </div>
                    </span>
                )}
            </div>
        </div>
            <Button
                disabled={isLoading}
                className='py-'
                variant="contained"
                color="primary"
                onClick={onButtonClick}
                startIcon={isLoading ? <CircularProgress color='warning' size={'1em'} /> : (isTagMode ? <BorderColorIcon /> : <AutoFixHighIcon/>)}
            >
                {isTagMode ? 'Edit text' : 'Tag it'}
            </Button>
        </>
    );
}
