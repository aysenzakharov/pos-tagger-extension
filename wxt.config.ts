import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'Part of Speech Identifier',
    permissions: ['storage', 'tabs', "activeTab"],
    host_permissions: [
      "https://part-of-speech-tool.info/*",
    ],
  }
});
