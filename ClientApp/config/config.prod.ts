// config/config.dev.ts the configuration file corresponding to the test environment
import { defineConfig } from 'umi';

/**
 * Exported multi-environment variable naming convention: always capitalize and use underscore to separate words
 * Note: After adding the variable, you need to add the declaration of the variable in src/typing.d.ts, otherwise the IDE will report an error when using the variable.
 */
export default defineConfig({
  define: {
    MY_INVOICE_BASE_URL: 'https://myinvois.hasil.gov.my', // API address
  },
});