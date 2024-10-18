import styled from '@emotion/styled'

export const Video = styled.video`
    object-fit: contain;
    width: 100%;
    height: 100%;
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