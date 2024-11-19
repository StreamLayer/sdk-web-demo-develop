import { useCallback, useEffect, useState } from 'react'
import { ContentActivateParams, StreamLayerProvider } from '@streamlayer/react'
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
    if (stage === 'activate' && type === 'advertisement') {
      setTabs(true)
    } else {
      setTabs(false)
    }
  }

  const videoPlayerController = ({ muted }: { muted: boolean }) => {
    setMuted(muted)
  }

  useEffect(() => {
    const withTheme = window.localStorage.getItem('with-theme')
    window.localStorage.clear()
    if (withTheme) {
      window.localStorage.setItem('with-theme', withTheme)
    }
  }, [])

  return (
    <Container className={cx('app-container', theme)}>
      <NavBar mode={mode} tabs={tabs} toggleMode={toggleMode} theme={theme} toggleTheme={toggleTheme} />
      <StreamLayerProvider videoPlayerController={videoPlayerController} onContentActivate={toggleNavBar} plugins={plugins as any} withAdNotification sdkKey={SDK_KEY} theme="custom-theme" production={PRODUCTION} event={EVENT_ID}>
        <Auth />
        <AppContainer>
          <SDKLayout
            mode={mode}
            points={<PointsContainer><StreamLayerSDKPoints /></PointsContainer>}
            sidebar={(
              <>
                <StreamLayerSDKReact />
                <StreamLayerSDKAdvertisement sidebar='right' persistent skipTypeCheck />
              </>
            )}
            banner={<StreamLayerSDKAdvertisement banner='bottom' persistent />}
            video={<VideoComponent muted={muted} />}
            overlay={(
              <>
                <StreamLayerSDKReact />
                <StreamLayerSDKAdvertisement persistent skipTypeCheck />
              </>
            )}
            notification={<StreamLayerSDKAdvertisement notification persistent />}
          />
        </AppContainer>
      </StreamLayerProvider>
    </Container>
  )
}

export default App
