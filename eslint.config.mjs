import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const config = [
  ...nextVitals,
  ...nextTs,
  { ignores: ['.next/', 'src/design/', 'src/payload-types.ts', 'src/app/(payload)/', 'public/', 'media/', 'resumes/', 'src/migrations/'] },
]

export default config
