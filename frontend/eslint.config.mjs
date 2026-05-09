import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'

const config = [
  ...nextVitals,
  ...nextTypescript,
  {
    ignores: [
      'components/ui/carousel.tsx',
      'components/ui/sidebar.tsx',
      'components/ui/use-mobile.tsx',
      'components/ui/use-toast.ts',
      'hooks/use-mobile.ts',
      'hooks/use-toast.ts',
    ],
  },
]

export default config
