import styled from '@emotion/styled'
import { breakpoints } from './breakpoints'

export const Container = styled.div`
    width: 100dvw;
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
`

export const PointsContainer = styled.div`
    backdrop-filter: blur(1px);
`