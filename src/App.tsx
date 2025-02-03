import { useCallback, useEffect, useState } from 'react'
import { ContentActivateParams, StreamLayerProvider, StreamLayerSDKNotification } from '@streamlayer/react'
import { StreamLayerSDKPoints } from '@streamlayer/react/points'
import { StreamLayerSDKReact } from '@streamlayer/react'
import { StreamLayerSDKAdvertisement } from '@streamlayer/react/advertisement'
import { anonymous } from '@streamlayer/sdk-web-anonymous-auth'
import { cx } from '@emotion/css'

import { NavBar } from './components/NavBar'
import { VideoComponent } from './components/VideoComponent'
import { SDKLayout } from './components/SDKLayout'
import { Auth } from './components/Auth'

import { AppContainer, Container, PointsContainer } from './styles'
import '@streamlayer/react/style.css'
import { EVENT_ID, SDK_KEY, PRODUCTION } from './config'

export type IMode = 'side-panel' | 'l-bar' | 'overlay' | 'off'
export type ITheme = 'light' | 'dark' | 'tgl'

const plugins = new Set([anonymous])

function App() {
  const [mode, setMode] = useState<IMode>('side-panel')
  const [theme, setTheme] = useState<ITheme>('dark')
  const [tabs, setTabs] = useState(false)
  const [muted, setMuted] = useState(false)
  const [interacted, setInteracted] = useState(false)

  const toggleMode = useCallback((e: React.MouseEvent<HTMLDivElement> | React.ChangeEvent) => {
    if (e.target instanceof HTMLButtonElement) {
      setMode(e.target.name as IMode)
    }

    if (e.target instanceof HTMLSelectElement) {
      setMode(e.target.value as IMode)
    }
  }, [])

  const toggleTheme = useCallback((e: React.MouseEvent<HTMLDivElement> | React.ChangeEvent) => {
    if (e.target instanceof HTMLButtonElement) {
      setTheme(e.target.name as ITheme)
    }

    if (e.target instanceof HTMLSelectElement) {
      setTheme(e.target.value as ITheme)
    }
  }, [])

  const toggleNavBar = ({ stage, type }: ContentActivateParams) => {
    console.log('onContentActivate', { stage, type })
    if (stage === 'activate' && type === 'advertisement') {
      setTabs(true)
    } else {
      setTabs(false)
    }
  }

  const videoPlayerController = ({ muted }: { muted: boolean }) => {
    console.log('videoPlayerController', muted)
    setMuted(muted)
  }

  useEffect(() => {
    const withTheme = window.localStorage.getItem('with-theme')
    const withDebug = window.localStorage.getItem('SL_DEBUG')
    // window.localStorage.clear()
    if (withTheme) {
      window.localStorage.setItem('with-theme', withTheme)
    }
    if (withDebug) {
      window.localStorage.setItem('SL_DEBUG', withDebug)
    }
  }, [])

  return (
    <Container className={cx('app-container', theme)} onClick={() => setInteracted(true)}>
      <NavBar mode={mode} tabs={tabs} toggleMode={toggleMode} theme={theme} toggleTheme={toggleTheme} />
      <StreamLayerProvider themeMode={theme === 'dark' ? 'dark' : 'light'} videoPlayerController={videoPlayerController} onContentActivate={toggleNavBar} plugins={plugins as any} withAdNotification sdkKey={SDK_KEY} theme="custom-theme" production={PRODUCTION} event={EVENT_ID}>
        <Auth />
        <AppContainer>
          <SDKLayout
            mode={mode}
            interacted={interacted}
            points={<PointsContainer><StreamLayerSDKPoints /></PointsContainer>}
            sidebar={(
              <>
                <StreamLayerSDKReact withSidebarNotification={false} />
                <StreamLayerSDKAdvertisement sidebar='right' persistent skipTypeCheck />
                {interacted && <StreamLayerSDKAdvertisement sidebar='right' persistent skipTypeCheck externalAd />}
              </>
            )}
            banner={<StreamLayerSDKAdvertisement banner='bottom' persistent />}
            video={<VideoComponent setInteracted={setInteracted} muted={muted} interacted={interacted} />}
            overlay={(
              <>
                <StreamLayerSDKReact withSidebarNotification={false} />
                <StreamLayerSDKAdvertisement persistent skipTypeCheck />
                {interacted && <StreamLayerSDKAdvertisement persistent skipTypeCheck externalAd />}
              </>
            )}
            appNotification={<StreamLayerSDKNotification />}
            adNotification={<StreamLayerSDKAdvertisement notification persistent />}
          />
        </AppContainer>
      </StreamLayerProvider>
    </Container>
  )
}

export default App
