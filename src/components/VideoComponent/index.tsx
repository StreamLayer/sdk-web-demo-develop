import Hls from "hls.js";
import { Preload, Video, VideoIFrame, InteractNote } from './styles'
import { useEffect, useRef, useState } from 'react'
import { useStreamLayer } from "@streamlayer/react"
import { FALLBACK_VIDEO } from "../../config"

export const VideoComponent: React.FC<{ src?: string, muted: boolean, interacted: boolean, setInteracted: (interacted: boolean) => void
}> = ({ src = FALLBACK_VIDEO, interacted, setInteracted, muted }) => {
  const videoRef = useRef() as React.RefObject<HTMLVideoElement>;
  const sdk = useStreamLayer()
  const [streamSrc, setStreamSrc] = useState('')
  const [errOnPlay, setErrOnPlay] = useState(false)

  useEffect(() => {
    if (sdk) {
      return sdk.streamSummary().subscribe((value) => {
        if (value.loading === false && value.error === undefined && value.data) {
          setStreamSrc(value.data.summary?.stream ? `${value.data.summary.stream}` : src)
        }
      })
    }
  }, [sdk, src])

  useEffect(()=>{
    if (streamSrc && streamSrc.includes('m3u8')) {
      if (Hls.isSupported() && videoRef.current) {
        const hls = new Hls({
          "debug": false
        });

        hls.loadSource(streamSrc);
        hls.attachMedia(videoRef.current)

        hls.on(Hls.Events.ERROR, () => {
          setStreamSrc(src)
        });
      } else {
        setStreamSrc(src)
      }
    }
    if (videoRef.current) {
      videoRef.current.volume = 0.1
      videoRef.current.play().then(() => setInteracted(true)).catch(() => {
        setErrOnPlay(true)
      })
    }
  }, [streamSrc, src])

  useEffect(() => {
    if (interacted && errOnPlay) {
      videoRef.current?.play()
    }
  }, [interacted, errOnPlay])

  if (!streamSrc) {
    return <Preload><img src="https://cdn.streamlayer.io/sdk-web-demo/loader.png" /></Preload>
  }

  if (streamSrc.includes('player.castr.com')) {
    return <VideoIFrame src={`${streamSrc}?loop=on&fullscreen=off&airplay=off&cast=off&pip=off`} width="100%" height="100%" frameBorder="0" scrolling="no" allow="autoplay"></VideoIFrame>
  }

  return (
    <>
      <Video
        src={streamSrc}
        ref={videoRef}
        muted={muted}
        autoPlay
        loop
        playsInline
        controls
        controlsList="nodownload nofullscreen noremoteplayback"
      />
      {!interacted && errOnPlay && <InteractNote>Click to start</InteractNote>}
    </>
  )
}