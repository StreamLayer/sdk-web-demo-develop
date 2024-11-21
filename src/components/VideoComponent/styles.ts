import styled from '@emotion/styled'

export const Video = styled.video`
    object-fit: contain;
    width: 100%;
    height: 100%;
`

export const VideoIFrame = styled.iframe`
    object-fit: contain;
    width: 100%;
    height: 100%;
    border: none;
    margin: 0;
    padding: 0;
`

export const Preload = styled.div`
    width: 100%;
    padding-top: 28.125%;
    padding-bottom: 28.125%;
    text-align: center;

    > img {
        width: 60px;
        height: 60px;

        animation: spin 2s linear infinite;

        @keyframes spin {
            from {
                transform:rotate(0deg);
            }
            to {
                transform:rotate(360deg);
            }
        }
    }
`

export const InteractNote = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, .7);
    backdrop-filter: blur(1px);
    cursor: pointer;

    display: flex;
    align-items: center;
    justify-content: center;
`