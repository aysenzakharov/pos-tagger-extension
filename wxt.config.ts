import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: '__MSG_appName__',
    description: '__MSG_shortDesc__',
    default_locale: 'en',
    permissions: ['storage', 'contextMenus'],
    host_permissions: [
      "https://part-of-speech-tool.info/*"
    ]
  }
});
