export default defineBackground(() => {
  // console.log('Hello background!', { id: browser.runtime.id });
  browser.runtime.onInstalled.addListener((details) => {
    if (details.reason === browser.runtime.OnInstalledReason.INSTALL) {
      // Code to be executed on first install
      // eg. open a tab with a url
      browser.tabs.create({
        url: "https://part-of-speech-tool.info/welcome",
      });
    } else if (details.reason === browser.runtime.OnInstalledReason.UPDATE) {
      // When extension is updated
    } else if (
      details.reason === browser.runtime.OnInstalledReason.CHROME_UPDATE
    ) {
      // When browser is updated
    } else if (
      details.reason === browser.runtime.OnInstalledReason.SHARED_MODULE_UPDATE
    ) {
      // When a shared module is updated
    }
  });
 
  browser.runtime.onInstalled.addListener(() => {
    browser.contextMenus.create({
      id: "POSContextMenu",
      title: "Identify parts of speech",
      contexts: ["selection"], // Показывать меню только при выделении текста
    });
  })

  browser.contextMenus.onClicked.addListener((info) => {
    if (info.menuItemId === "POSContextMenu" && info.selectionText) {
      console.log("Selected text:", info.selectionText);
      const encodedText = encodeURIComponent(info.selectionText);
      const url = `https://part-of-speech-tool.info/?text=${encodedText}`;
      browser.tabs.create({ url });
    }
  })
});
