import styled from '@emotion/styled'
import { breakpoints, breakpointsPortrait } from '../../breakpoints'

const IS_DEBUG = process.env.SL_DEBUG === 'true'

export const Container = styled.div`
  ${IS_DEBUG && 'background: green;'}
  width: 100%;
  height: 100%;

  display: flex;

  --banner-height: 155px;
  --banner-padding: 17px;
  --sidebar-width: 450px;
  --video-player-position: absolute;
  --transition-duration: .5s;

  --show-in-animation: show-in .3s ease forwards var(--transition-duration);

  @keyframes show-in {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
  }

  ${breakpoints(`
    --banner-height: 95px;
    --banner-padding: 10px;
    --sidebar-width: 300px;
  `)}

  ${breakpointsPortrait(`
    flex-direction: column;
    height: auto;

    --video-player-position: static;
    --banner-height: 0px;
    --banner-padding: 0px;
    --sidebar-width: 0px;
  `)}
`

export const ContentContainer = styled.div`
  ${IS_DEBUG && 'background: blue;'}
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;

  transition: width .5s ease;
`

export const Sidebar = styled.div`
  ${IS_DEBUG && 'background: orange;'}
  overflow: hidden;

  transition: width .5s ease;
`

export const SideBarOverlay = styled.div`
  ${IS_DEBUG && 'background: purple;'}
  margin: auto;
  width: 100%;
  max-width: 450px;
  display: block;

  @keyframes grow-in-sidebar {
      from {
          max-width: 0px;
      }
      to {
          max-width: 450px;
      }
  }
`

export const Banner = styled.div`
  ${IS_DEBUG && 'background: yellow;'}
  width: 100%;

  transition: height .5s ease;
  box-sizing: border-box;
`

export const VideoContainer = styled.div`
  ${IS_DEBUG && 'background: red;'}
  flex: 1 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;

  transition: height .5s ease;
`

export const VideoBox = styled.div`
  width: 100%;
  aspect-ratio: 16/9;
  position: relative;
`

export const VideoPlayer = styled.div`
  ${IS_DEBUG && 'background: black;'}
  position: var(--video-player-position);
  height: 100%;
  inset: 0;
`

export const Overlay = styled.div`
   position: absolute;
    bottom: 41px;
    left: 56px;
    z-index: 11;
    background: transparent;
    flex-shrink: 0;
    max-width: 450px;
    max-height: min(640px, 100%);
    display: flex;
    border-radius: 24px;
    overflow: hidden;
    width: 100%;

    .PromoOverlayContainer {
        animation: grow-in-overlay .3s ease forwards;
        transform-origin: bottom;

        @keyframes grow-in-overlay {
            from {
                transform: scaleY(0);
            }
            to {
                transform: scaleY(1);
            }
        }

        > div {
            opacity: 0;
            animation: show-in-overlay .3s ease forwards .3s;

            @keyframes show-in-overlay {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }
        }
    }

    > div {
        max-width: 100%;
        width: 100%;
    }

    .PromoOverlay {
        max-height: 640px;

        ${breakpoints(`
            max-height: min(377px, calc(100dvh - 16px));
        `)}
    }

    ${breakpoints(`
        max-width: 300px;
        max-height: min(377px, calc(100dvh - 16px));
        left: 16px;
        bottom: 8px;
    `)}
`

export const Notification = styled.div`
  position: absolute;
  width: 100%;
  bottom: 0;
  left: 0;

  ${IS_DEBUG && 'background: brown;'}

  ${breakpointsPortrait(`
      position: static;
      margin-top: -4px;
  `)}

  .SL_Rich_Notification {
    margin-left: 56px;
    margin-bottom: 20px;

    ${breakpoints(`
      margin-left: 32px;
      margin-bottom: -4px;
    `)}

    ${breakpointsPortrait(`
        margin-top: -35px;
        margin-left: 8px;
        margin-right: 8px;
    `)}
  }

  .SL_Lower_Third_Notification {
    ${breakpointsPortrait(`
      transform: translateY(-100%);
    `)}

    @media only screen and (max-width: 768px) and (orientation: portrait) {
      transform: translateY(0);
    }
  }
`

export const PointsContainer = styled.div`
  position: absolute;
  top: 15px;
  left: 15px;
`

export const InApp = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
`