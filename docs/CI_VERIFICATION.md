# CI Verification

This file exists to trigger a pull-request CI run after the workflow was corrected for repositories without a committed `package-lock.json`.

The CI gate runs prompt-engine tests, ESLint, and a production Vite build.
