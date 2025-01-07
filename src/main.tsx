import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import appleIconUrl from './assets/apple-touch-icon.png'
import falconPunchUrl from './assets/falconPunch.png'
import favicon16Url from './assets/favicon-16x16.png'
import favicon32Url from './assets/favicon-32x32.png'
import manifestUrl from './assets/site.webmanifest'
import ErrorPage from './pages/ErrorPage'
import HomePage from './pages/HomePage'
import MinecraftMap from './pages/MinecraftMap'
import MtgRandoPage from './pages/MtgRandoPage'
import SkaPage from './pages/SkaPage'
import { Layout } from './Layout'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          {
            path: '',
            element: <HomePage />,
          },
          {
            path: 'ska',
            element: <SkaPage />,
            caseSensitive: false,
          },
          {
            path: 'minecraft',
            element: <MinecraftMap />,
            caseSensitive: false,
          },
          {
            path: 'mtg-rando',
            element: <MtgRandoPage />,
            caseSensitive: false,
          },
        ],
      },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <Helmet>
        <title>Falcon Syndicate</title>
        <meta
          name="description"
          content="I really don't know anymore man, this is mostly the MtG Randomizer."
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="The Falcon Syndicate" />
        <meta name="twitter:creator" content="@SternerStock" />
        <meta
          name="twitter:description"
          content="You better be playing Falcon!"
        />
        <meta name="twitter:image" content={falconPunchUrl} />
        <link rel="apple-touch-icon" sizes="180x180" href={appleIconUrl} />
        <link rel="icon" type="image/png" sizes="32x32" href={favicon32Url} />
        <link rel="icon" type="image/png" sizes="16x16" href={favicon16Url} />
        <link rel="manifest" href={manifestUrl} />
      </Helmet>
      <RouterProvider router={router} />
    </HelmetProvider>
  </StrictMode>
)
