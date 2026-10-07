import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

export default [
  ...nextVitals,
  ...nextTs,
  { ignores: ['.next/', 'src/design/', 'src/payload-types.ts', 'src/app/(payload)/', 'public/', 'media/', 'resumes/'] },
]
