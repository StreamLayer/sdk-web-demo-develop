import Hls from "hls.js";
import { Preload, Video, VideoIFrame, InteractNote, VideoMuteButton } from './styles'
import { useCallback, useEffect, useRef, useState } from 'react'
import { VideoPlayerCallback, useStreamLayer } from "@streamlayer/react"
import { StreamLayerPauseAd } from "@streamlayer/react/pause-ad"

export const VideoComponent: React.FC<{ muted: boolean, setMuted: React.Dispatch<React.SetStateAction<boolean>>, interacted: boolean, setInteracted: (interacted: boolean) => void
}> = ({ interacted, setInteracted, muted, setMuted }) => {
  const [showPauseAd, setShowPauseAd] = useState(false)
  const [pauseAdRendered, setPauseAdRendered] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const sdk = useStreamLayer()
  const [streamSrc, setStreamSrc] = useState('')
  const [pauseAdUrl, setPauseAdUrl] = useState('')
  const [errOnPlay, setErrOnPlay] = useState(false)

  const onClosePauseAd = useCallback(() => {
    setShowPauseAd(false)
  }, [])

  const onRenderPauseAd = useCallback((params: { rendered: boolean }) => {
    setPauseAdRendered(params.rendered)
  }, [])

  // Track video playing state
  const onVideoPlayWithState = useCallback(() => {
    setShowPauseAd(false)
  }, [])

  const onVideoPauseWithState = useCallback(() => {
    setShowPauseAd(true)
  }, [])

  useEffect(() => {
    if (sdk) {
      return sdk.streamSummary().subscribe((value: any) => {
        if (value.data?.summary?.stream) {
          setStreamSrc(value.data.summary.stream)
        }
        if (value.data?.summary?.pauseAdUrl?.[0]) {
          setPauseAdUrl(value.data.summary.pauseAdUrl[0])
        }
      })
    }
  }, [sdk])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  useEffect(()=> {
    if (streamSrc && streamSrc.includes('m3u8')) {
      if (Hls.isSupported() && videoRef.current) {
        const hls = new Hls({
          "debug": false
        });

        hls.loadSource(streamSrc);
        hls.attachMedia(videoRef.current)
      } else {
        setStreamSrc('')
      }
    }

    if (videoRef.current) {
      videoRef.current.volume = 0.1
      videoRef.current.play().then(() => setInteracted(true)).catch(() => {
        setErrOnPlay(true)
      })
    }
  }, [streamSrc])

  useEffect(() => {
    if (interacted && errOnPlay) {
      videoRef.current?.play()
    }
  }, [interacted, errOnPlay])

  const showControls = !pauseAdRendered

  const videoPlayerController: VideoPlayerCallback = useCallback((videoPlayerData) => {
    const video = videoRef.current

    if (!video) return

    if (videoPlayerData.play === true) {
      setShowPauseAd(false)

      video.play()
    }
  }, [])

  if (!streamSrc) {
    return <Preload><img src="https://cdn.streamlayer.io/sdk-web-demo/loader.png" /></Preload>
  }

  if (streamSrc.includes('player.castr.com')) {
    return <VideoIFrame src={`${streamSrc}?loop=on&fullscreen=off&airplay=off&cast=off&pip=off`} width="100%" height="100%" frameBorder="0" scrolling="no" allow="autoplay"></VideoIFrame>
  }

  return (
    <>
      <StreamLayerPauseAd
        showPauseAd={showPauseAd}
        onRenderPauseAd={onRenderPauseAd}
        onClosePauseAd={onClosePauseAd}
        videoPlayerController={videoPlayerController}
        pauseAdVastUrl={pauseAdUrl ?[
          {
            template: 'default',
            url: pauseAdUrl,
          },
        ] : undefined}
      >
        <Video
          src={streamSrc}
          ref={videoRef}
          muted={muted}
          onPlay={onVideoPlayWithState}
          onPause={onVideoPauseWithState}
          onEnded={onVideoPauseWithState}
          autoPlay
          loop
          playsInline
          controls={showControls}
          controlsList="nodownload nofullscreen noremoteplayback"
        />
      </StreamLayerPauseAd>
      {showControls && <VideoMuteButton onClick={() => setMuted((prev) => !prev)}>{muted ? 'unmute' : 'mute'}</VideoMuteButton>}
      {!interacted && errOnPlay && <InteractNote>Click to start</InteractNote>}
    </>
  )
}