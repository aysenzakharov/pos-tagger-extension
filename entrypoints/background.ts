export default defineBackground(() => {
  // console.log('Hello background!', { id: browser.runtime.id });
  browser.runtime.onInstalled.addListener((details) => {
    if (details.reason === browser.runtime.OnInstalledReason.INSTALL) {
      // Code to be executed on first install
      // eg. open a tab with a url
      browser.tabs.create({
        url: "https://aysenzakharov.github.io/welcome",
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
});
