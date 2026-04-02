import Hls from "hls.js";
import { Preload, Video, VideoIFrame, InteractNote } from './styles'
import { useCallback, useEffect, useRef, useState } from 'react'
import { VideoPlayerCallback, VideoPlayerData, useStreamLayer } from "@streamlayer/react"
import { StreamLayerPauseAd } from "@streamlayer/react/pause-ad"

const pauseAdPresets = {
  streamlayer_slot: [{
    template: 'default' as const,
    url: '/23213969138/pause_ad_ctv',
    adWidth: 315,
    adHeight: 400,
  }],
  host_url: [{
    template: 'default' as const,
    url: 'https://pagead2.googlesyndication.com/gampad/ads?pvsid=7320384242204022&correlator=649374465758607&output=ldjh&gdfp_req=1&vrg=202602170101&ptt=17&impl=fif&iu_parts=5479%2Cctv.tsn.ca%2Cnba&enc_prev_ius=%2F0%2F1%2F2&prev_iu_szs=315x400&ifi=1&dids=jasper-player-pause-ad-overlay&adfs=2601896588&sfv=1-0-45&eri=1&sc=1&abxe=1&dt=1772017069904&lmt=1741681952&adxs=-12245933&adys=-12245933&biw=1920&bih=1080&scr_x=0&scr_y=0&btvi=-1&ucis=1&oid=2&u_his=4&u_h=1080&u_w=1920&u_ah=1080&u_aw=1920&u_cd=24&u_sd=1&u_tz=60&dmc=8&bc=31&nvt=1&uach=WyJtYWNPUyIsIjI2LjIuMCIsImFybSIsIiIsIjE0NS4wLjc2MzIuMTE2IixudWxsLDAsbnVsbCwiNjQiLFtbIk5vdDpBLUJyYW5kIiwiOTkuMC4wLjAiXSxbIkdvb2dsZSBDaHJvbWUiLCIxNDUuMC43NjMyLjExNiJdLFsiQ2hyb21pdW0iLCIxNDUuMC43NjMyLjExNiJdXSwwXQ..&uas=3&url=https%3A%2F%2Fbl-tsn-lg.bl-massive.com%2F%23%2Fwatch%2FNBA_Thunder_116_Raptors_107_304596%3F_k%3Drijhbk&vis=1&psz=0x-1&msz=0x-1&fws=644&ohw=1920&topics=5&tps=5&htps=5&psd=WzMxLFtdXQ..&dlt=1772016931070&idt=823&adks=3544135819&frm=20&eo_id_str=ID%3De87a1033aa910566%3AT%3D1765209356%3ART%3D1771259724%3AS%3DAA-AfjbWMgNC70JctstXr4VITd6l&pgls=CAk.',
    product: 'tsn',
    platform: 'cotv',
    platformtype: 'amazonfire',
    pagetype: 'planepage',
    content: 'cfl-news-and-highlights',
  }],
  // eslint-disable-next-line @typescript-eslint/member-ordering
} satisfies Record<string, [{ template: 'default'; url: string; [key: string]: unknown }]>

const searchParams = new URLSearchParams(window.location.search)

// @ts-ignore
const pauseAdPreset = pauseAdPresets[searchParams.get('pause_ad')] || null

export const VideoComponent: React.FC<{ muted: boolean, setMuted: React.Dispatch<React.SetStateAction<boolean>>, interacted: boolean, setInteracted: (interacted: boolean) => void, videoRef?: React.RefObject<HTMLVideoElement>
}> = ({ interacted, setInteracted, muted, videoRef: externalVideoRef }) => {
  const [showPauseAd, setShowPauseAd] = useState(false)
  const [pauseAdRendered, setPauseAdRendered] = useState(false)
  const internalVideoRef = useRef<HTMLVideoElement>(null);
  const videoRef = externalVideoRef ?? internalVideoRef;
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

  const videoPlayerController: VideoPlayerCallback = useCallback((videoPlayerData: VideoPlayerData) => {
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
        // @ts-ignore
        pauseAdExternalUrls={pauseAdPreset || (pauseAdUrl ? [
          {
            template: 'default',
            url: pauseAdUrl,
          },
        ] : undefined)}
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
      {/* {showControls && <VideoMuteButton onClick={() => setMuted((prev) => !prev)}>{muted ? 'unmute' : 'mute'}</VideoMuteButton>} */}
      {!interacted && errOnPlay && <InteractNote>Click to start</InteractNote>}
    </>
  )
}