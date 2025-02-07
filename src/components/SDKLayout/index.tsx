import { useCallback, useEffect, useRef, useState } from 'react'
import { Banner, Container, Notification, PointsContainer, ContentContainer, Overlay, Sidebar, SideBarOverlay, VideoBox, VideoContainer, VideoPlayer, InApp } from './styles'
import { useStreamLayerUI } from '@streamlayer/react'
import throttle from 'lodash.throttle'

type SDKLayoutProps = {
  mode: 'side-panel' | 'l-bar' | 'overlay' | 'off'
  sidebar?: React.ReactElement
  banner?: React.ReactNode
  video?: React.ReactNode
  overlay?: React.ReactNode
  appNotification?: React.ReactNode
  adNotification?: React.ReactNode
  points?: React.ReactNode
  interacted: boolean
}

const useResponsive = () => {
  const [store, setStore] = useState<'desktop' | 'mobile'>('desktop')

  useEffect(() => {
    const updateScreenSize = throttle(() => {
      const screenWidth = window.innerWidth
      const screenHeight = window.innerHeight

      const orientation = screenWidth > screenHeight ? 'landscape' : 'portrait'

      setStore(screenWidth < 1024 && orientation === 'portrait' ? 'mobile' : 'desktop')
    }, 200)

    window.addEventListener('resize', updateScreenSize)

    return () => {
      window.removeEventListener('resize', updateScreenSize)
    }
  }, [])

  return store
}

export const SDKLayout: React.FC<SDKLayoutProps> = ({ mode, interacted, points, sidebar, overlay, appNotification, adNotification, banner, video }) => {
  const uiState = useStreamLayerUI()

  const videoContainerRef = useRef<HTMLDivElement>(null)
  const videoBoxRef = useRef<HTMLDivElement>(null)

  const updateAspectRatio = useCallback(() => {
    const videoBoxElement = videoBoxRef.current
    const videoContainerElement = videoContainerRef.current

    if (!videoBoxElement || !videoContainerElement) {
      return
    }

    const { width, height } = videoBoxElement.getBoundingClientRect()
    const { width: pwidth, height: pheight } = videoContainerElement.getBoundingClientRect()

    if (width > pwidth || height > pheight) {
      if (videoBoxElement.style.width === '100%') {
        videoBoxElement.style.height = '100%'
        videoBoxElement.style.width = 'auto'
      } else {
        videoBoxElement.style.width = '100%'
        videoBoxElement.style.height = 'auto'
      }
    }
  }, [])

  useEffect(() => {
    if (videoContainerRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.contentBoxSize) {
            updateAspectRatio()
          }
        }
      });

      resizeObserver.observe(videoContainerRef.current)

      return () => {
        resizeObserver.disconnect()
      }
    }
  }, [])

  useEffect(updateAspectRatio)

  const layoutType = useResponsive()

  let hasSidebar = (mode === 'l-bar' || mode === 'side-panel') && (uiState.app || uiState.promotionSidebar)
  let hasOverlay = (mode === 'overlay') && (uiState.promotionOverlay || uiState.promotionSidebar)
  const hasBanner = (mode === 'l-bar') && (uiState.promotionBanner)
  const hasPromotionNotification = uiState.promotionNotification && !uiState.onboardingNotification
  const hasAppNotification = uiState.appNotification || uiState.onboardingNotification
  let hasPromotion = uiState.promotionBanner || uiState.promotionOverlay || uiState.promotionSidebar || uiState.promotionNotification

  if (!interacted && uiState.promotionExternalAd) {
    hasSidebar = false
    hasOverlay = false
    hasPromotion = false
  }

  return (
    <Container className="Container">
      <ContentContainer className="ContentContainer" style={{
        width: hasSidebar ? 'calc(100% - var(--sidebar-width))' : '100%',
      }}>
        <VideoContainer className="VideoContainer" ref={videoContainerRef} style={{
          height: mode === 'l-bar' ? 'calc(100% - var(--banner-height))' : '100%',
        }}>
          <VideoBox ref={videoBoxRef} className="VideoBox">
            <VideoPlayer className="VideoPlayer">{video}</VideoPlayer>
            {!hasPromotion && <PointsContainer>{points}</PointsContainer>}
            {hasAppNotification && appNotification && <InApp>{appNotification}</InApp>}
          </VideoBox>
        </VideoContainer>
        <Banner className="Banner" style={{
          height: hasBanner ? 'var(--banner-height)' : '0px',
          padding: hasBanner ? 'var(--banner-padding)' : '0px',
        }}>
          {hasBanner && banner}
        </Banner>
        {hasPromotionNotification && adNotification && <Notification>{adNotification}</Notification>}
        {hasOverlay && layoutType === 'desktop' && <Overlay className="Overlay">{overlay}</Overlay>}
      </ContentContainer>
      {layoutType === 'desktop' && <Sidebar style={{ width: hasSidebar ? 'var(--sidebar-width)' : '0px' }} className="Sidebar">
        {hasSidebar && sidebar}
      </Sidebar>}
      {(hasSidebar || hasOverlay) && layoutType === 'mobile' && <SideBarOverlay className="Demo-SideBarOverlay">
        {overlay}
      </SideBarOverlay>}
    </Container>
  )
}
