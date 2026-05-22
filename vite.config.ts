import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [reactRouter(), tsconfigPaths()],
  ssr: {
    // Bundle both to share the same react-i18next module instance: when
    // remix-i18next is left external it gets its own copy of react-i18next
    // (and its own I18nContext), and useChangeLanguage logs a spurious
    // NO_I18NEXT_INSTANCE warning during SSR.
    noExternal: ['react-i18next', 'remix-i18next'],
  },
});
