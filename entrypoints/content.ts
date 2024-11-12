// content.js

// Создание нового элемента <style>
const style = document.createElement('style');

// Добавление CSS-стилей
style.textContent = `
    /* Стили для текста и всплывающего окна */
    span[data-processed] {
        position: relative;
        cursor: pointer;
        display: inline-block; /* Помогает позиционировать tooltip */
        border-radius: 0.25em;
        padding: 0 0.25em;
        margin: 0.1em;
    }

    /* Скрываем всплывающее окно по умолчанию */
    .tooltip {
        display: none;
        position: absolute;
        bottom: 100%; /* Позиционирует tooltip над словом */
        left: 50%; /* Центрирует tooltip относительно span */
        transform: translateX(-50%); /* Дополнительная центровка */
        background-color: #333;
        color: #fff;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        white-space: nowrap;
        margin-bottom: 4px;
        z-index: 1;
    }

    /* Стиль для показа всплывающего окна */
    span[data-processed]:hover .tooltip {
        display: block;
    }
`;

// Добавление стилей в <head> страницы
document.head.appendChild(style);


async function fetchPosTags(text: string) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({ "text": text });
  const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
  };

  try {
      const response = await fetch("https://part-of-speech-tool.info/pos_tagging/", requestOptions);
      return await response.json();
  } catch (error) {
      console.error('Ошибка при получении POS-тегов:', error);
      return null;
  }
}


// Определение цвета и полного названия для каждого POS-тега в одном объекте
const posTagsInfo: any = {
  ADJ: { color: 'hsla(30, 90%, 70%, 0.5)', name: 'adjective' },  // Красный
  ADP: { color: 'hsla(120, 90%, 60%, 0.5)', name: 'adposition' },  // Ярко-зеленый
  ADV: { color: 'hsla(160, 80%, 60%, 0.5)', name: 'adverb' },  // Зеленый
  AUX: { color: 'hsla(210, 80%, 75%, 0.5)', name: 'auxiliary' },  // Голубой
  CCONJ: { color: 'hsla(220, 90%, 50%, 0.5)', name: 'coordinating conjunction' },  // Яркий синий
  DET: { color: 'hsla(300, 90%, 60%, 0.5)', name: 'determiner' },  // Пурпурный
  INTJ: { color: 'hsla(10, 80%, 80%, 0.5)', name: 'interjection' },  // Оранжевый
  NOUN: { color: 'hsla(60, 80%, 60%, 0.5)', name: 'noun' },  // Желтый
  NUM: { color: 'hsla(100, 80%, 75%, 0.5)', name: 'numeral' },  // Светло-зеленый
  PART: { color: 'hsla(170, 80%, 75%, 0.5)', name: 'particle' },  // Легкий зеленый
  PRON: { color: 'hsla(220, 70%, 80%, 0.5)', name: 'pronoun' },  // Синий-зеленый
  PROPN: { color: 'hsla(270, 90%, 50%, 0.5)', name: 'proper noun' },  // Фиолетовый
  PUNCT: { color: 'hsla(320, 90%, 50%, 0.5)', name: 'punctuation' },  // Ярко-розовый
  SCONJ: { color: 'hsla(350, 90%, 60%, 0.5)', name: 'subordinating conjunction' },  // Красно-фиолетовый
  SYM: { color: 'hsla(30, 80%, 85%, 0.5)', name: 'symbol' },  // Яркий оранжевый
  VERB: { color: 'hsla(240, 90%, 45%, 0.5)', name: 'verb' },  // Темно-синий
  X: { color: 'hsla(130, 80%, 75%, 0.5)', name: 'other' }  // Зеленый
}


async function handleTextSelection() {

  const selection = window.getSelection();
  if (selection == null) return
  const selectedText = selection.toString();

  if (selectedText) {
      const data = await fetchPosTags(selectedText);
        if (!data) return;

        var fragment = document.createDocumentFragment();

        data.pos_tags.forEach(([word, pos]: [string, string]) => {
            var span = document.createElement('span');
            span.textContent = word;
            span.style.backgroundColor = posTagsInfo[pos]?.color || 'hsla(0, 0%, 80%, 0.5)';
            span.setAttribute('data-processed', 'true');

            var tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = posTagsInfo[pos]?.name || pos;
            span.appendChild(tooltip);

            fragment.appendChild(span);
            fragment.appendChild(document.createTextNode(' '));
        });

      
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(fragment);
      selection.removeAllRanges();
  }
  
}

function enableExtension() {
  document.addEventListener('mouseup', handleTextSelection);
}

function disableExtension() {
  document.removeEventListener('mouseup', handleTextSelection);
}

export default defineContentScript({
  matches: ['<all_urls>'],
  main() {
    browser.storage.local.get('toggleHighlight')
      .then((data) => {
        if (data.toggleHighlight !== undefined) {
          enableExtension() 
        }
      })
      .catch((error) => {
        console.error('Ошибка при чтении из browser.storage:', error);
      });
  },
});

browser.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local" && changes.toggleHighlight) {
    if (changes.toggleHighlight.newValue) {
      enableExtension()
    } else {
      disableExtension()
    }
  }
});
