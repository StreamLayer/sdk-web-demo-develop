import { useCallback, useEffect, useState } from 'react'
import { ContentActivateParams, StreamLayerProvider } from '@streamlayer/react'
import { StreamLayerSDKPoints } from '@streamlayer/react/points'
import { StreamLayerSDKReact } from '@streamlayer/react'
import { StreamLayerSDKAdvertisement } from '@streamlayer/react/advertisement'
import { anonymous } from '@streamlayer/sdk-web-anonymous-auth'

import { NavBar } from './components/NavBar'
import { VideoComponent } from './components/VideoComponent'
import { SDKLayout } from './components/SDKLayout'
import { Auth } from './components/Auth'

import { AppContainer, Container, PointsContainer } from './styles'
import '@streamlayer/react/style.css'
import { EVENT_ID, SDK_KEY, PRODUCTION } from './config'

export type IMode = 'side-panel' | 'l-bar' | 'overlay' | 'off'

const plugins = new Set([anonymous])

function App() {
  const [mode, setMode] = useState<IMode>('side-panel')
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
    window.localStorage.clear()
  }, [])

  return (
    <Container>
      <NavBar mode={mode} tabs={tabs} toggleMode={toggleMode} />
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
