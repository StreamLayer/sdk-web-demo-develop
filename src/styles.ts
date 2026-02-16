import styled from '@emotion/styled'
import { breakpoints } from './breakpoints'

export const Container = styled.div`
    width: 100%;
    height: 100dvh;
    background: rgba(0, 22, 43, 0.90);
`

export const AppContainer = styled.div`
    height: calc(100% - var(--nav-bar-height));

    .SL-AdvertisementUIWrap {
        font-size: 24px !important;

        ${breakpoints(`
            font-size: 16px !important;
        `)}
    }

    .SLPolymarketButton {
        position: absolute;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 1000;
    }
`

export const PointsContainer = styled.div`
    backdrop-filter: blur(1px);
`