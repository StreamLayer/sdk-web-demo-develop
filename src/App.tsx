import { useCallback, useEffect, useRef, useState } from 'react'
import { StreamLayerProvider, ContentActivateParams, OnContentActivateCallback } from '@streamlayer/react'
import { StreamLayerSDKPoints } from '@streamlayer/react/points'
import { StreamLayerSDKReact } from '@streamlayer/react'
import { anonymous } from '@streamlayer/sdk-web-anonymous-auth'

import { StreamLayerSDKAdvertisement } from './components/StreamLayerSDKAdvertisement'
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
  const [promo, setPromo] = useState<ContentActivateParams>()
  const [notification, setNotification] = useState(false)
  const [showApp, setShowApp] = useState(false)
  const activeQuestionId = useRef('')
  const showPromo = promo && !notification

  useEffect(() => {
    if (!showPromo && showApp && mode === 'overlay') {
      setMode('side-panel')
    }
  }, [showPromo, showApp, mode])

  const toggleMode = useCallback((e: React.MouseEvent<HTMLDivElement> | React.ChangeEvent) => {
    if (e.target instanceof HTMLButtonElement) {
      setMode(e.target.name as IMode)
    }

    if (e.target instanceof HTMLSelectElement) {
      setMode(e.target.value as IMode)
    }
  }, [])

  const onContentActivate: OnContentActivateCallback = (params) => {
    if (params.type === 'advertisement') {
      if (params.stage === 'activate') {
        setNotification(!!params.hasNotification)
        setPromo(params)
      } else {
        setPromo(undefined)
        setNotification(false)
      }
    } else {
      setShowApp(flag => {
        if (!flag) {
          if (params.stage === 'activate') {
            activeQuestionId.current = params.id
            return true
          }
        } else if (params.stage === 'deactivate' && typeof params.id === 'string' && params.id === activeQuestionId.current) {
          activeQuestionId.current = ''

          return false
        }

        return flag
      })

    }
  }

  const showAdByNotification = () => {
    setNotification(false)
  }

  let videoContainerStyle: any = {}

  if (showPromo && mode === 'l-bar') {
    videoContainerStyle.aspectRatio = 'initial'
  }

  if (!showPromo || mode === 'overlay') {
    videoContainerStyle.height = '100%'
  }

  useEffect(() => {
    window.localStorage.clear()
  }, [])

  return (
    <Container>
      <NavBar mode={mode} toggleMode={toggleMode} disabled={{ overlay: showApp }} />
      <StreamLayerProvider plugins={plugins as any} sdkKey={SDK_KEY} production={PRODUCTION} event={EVENT_ID} onContentActivate={onContentActivate}>
        <Auth />
        <AppContainer>
          <SDKLayout
            mode={mode}
            points={!promo && <PointsContainer><StreamLayerSDKPoints /></PointsContainer>}
            sidebar={(
              <>
                <StreamLayerSDKReact theme="custom-theme" event={EVENT_ID} />
                <StreamLayerSDKAdvertisement sidebar='right' persistent />
              </>
            )}
            banner={<StreamLayerSDKAdvertisement banner='bottom' persistent />}
            video={<VideoComponent />}
            overlay={(
              <>
                <StreamLayerSDKReact theme="custom-theme" event={EVENT_ID} />
                <StreamLayerSDKAdvertisement persistent />
              </>
            )}
            notification={notification && <div onClick={showAdByNotification}><StreamLayerSDKAdvertisement notification persistent /></div>}
          />
        </AppContainer>
      </StreamLayerProvider>
    </Container>
  )
}

export default App
