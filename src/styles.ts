import styled from '@emotion/styled'

export const Container = styled.div`
    width: 100dvw;
    height: 100dvh;
    background: rgba(0, 22, 43, 0.90);
`

export const AppContainer = styled.div`
    height: calc(100% - var(--nav-bar-height));
`

export const PointsContainer = styled.div`
    border: 1px solid rgba(255,255,255, .5);
    border-radius: 40px;
    backdrop-filter: blur(1px);
`