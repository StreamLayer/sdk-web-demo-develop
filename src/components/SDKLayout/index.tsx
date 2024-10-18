import { useCallback, useEffect, useRef } from 'react'
import { Banner, Container, Notification, PointsContainer, ContentContainer, Overlay, Sidebar, SideBarOverlay, VideoBox, VideoContainer, VideoPlayer } from './styles'

type SDKLayoutProps = {
  mode: 'side-panel' | 'l-bar' | 'overlay' | 'off'
  sidebar?: React.ReactNode
  banner?: React.ReactNode
  video?: React.ReactNode
  overlay?: React.ReactNode
  notification?: React.ReactNode
  points?: React.ReactNode
}

export const SDKLayout: React.FC<SDKLayoutProps> = ({ mode, points, sidebar, overlay, notification, banner, video }) => {
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

  return (
    <Container className="Container">
      <ContentContainer className="ContentContainer" style={{
        width: mode !== 'off' ? 'calc(100% - var(--sidebar-width))' : '100%',
      }}>
        <VideoContainer className="VideoContainer" ref={videoContainerRef} style={{
          height: mode === 'l-bar' ? 'calc(100% - var(--banner-height))' : '100%',
        }}>
          <VideoBox ref={videoBoxRef} className="VideoBox">
            <VideoPlayer className="VideoPlayer">{video}</VideoPlayer>
            <PointsContainer>{points}</PointsContainer>
          </VideoBox>
        </VideoContainer>
        <Banner className="Banner" style={{
          height: mode === 'l-bar' ? 'var(--banner-height)' : '0px',
          padding: mode === 'l-bar' ? 'var(--banner-padding)' : '0px',
        }}>
          {mode === 'l-bar' && banner}
        </Banner>
        {notification && <Notification>{notification}</Notification>}
        {mode === 'overlay' && <Overlay>{overlay}</Overlay>}
      </ContentContainer>
      <Sidebar style={{ width: mode === 'l-bar' || mode === 'side-panel' ? 'var(--sidebar-width)' : '0px' }} className="Sidebar">
        {(mode === 'l-bar' || mode === 'side-panel') && sidebar}
      </Sidebar>
      {mode !== 'off' && <SideBarOverlay className="Demo-SideBarOverlay">
        {overlay}
      </SideBarOverlay>}
    </Container>
  )
}
