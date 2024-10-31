import Hls from "hls.js";
import { Preload, Video} from './styles'
import { useEffect, useRef, useState } from 'react'
import { useStreamLayer } from "@streamlayer/react"
import { FALLBACK_VIDEO } from "../../config"

export const VideoComponent: React.FC<{ src?: string }> = ({ src = FALLBACK_VIDEO }) => {
  const videoRef = useRef() as React.RefObject<HTMLVideoElement>;
  const sdk = useStreamLayer()
  const [streamSrc, setStreamSrc] = useState('')

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
  }, [streamSrc, src])

  if (!streamSrc) {
    return <Preload><img src="https://cdn.streamlayer.io/sdk-web-demo/loader.png" /></Preload>
  }

  return (
    <Video
      src={streamSrc}
      ref={videoRef}
      muted
      autoPlay
      loop
      playsInline
    />
  )
}