import styled from '@emotion/styled'
import { breakpoints, breakpointsPortrait } from '../../breakpoints'

export const NavBarContainer = styled.nav<{ mobile?: boolean }>`
    position: sticky;
    z-index: 12;
    top: -40px;
    background: #fff;
    height: var(--nav-bar-height);
    width: 100%;
    padding: 6px 20px;
    box-sizing: border-box;
    display: ${({ mobile }) => mobile ? 'none' : 'flex'};
    justify-content: space-between;
    align-items: center;
    z-index: 10;

    ${breakpoints(`
        position: absolute;
        height: 40px;
    `)}

    ${breakpointsPortrait(`
        position: static;
        top: 0;
    `)}

    &:hover {
        top: 0;

        .ShowMenuBtn {
            display: none;
        }
    }

`

export const ShowMenuBtn = styled.button`
    border-radius: 48px;
    background: rgba(0, 0, 0, 0.40);
    border: none;
    padding: 8px 16px;
    color: #fff;
    font-size: 14px;
    font-family: 'SF Pro Text', Arial, Helvetica, sans-serif;

    position: absolute;
    top: 46px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;

    &:before {
        content: '';
        display: block;
        position: absolute;
        top: 0;
        bottom: 0;
        left: -50px;
        right: -50px;
    }

    display: none;

    ${breakpoints(`
        display: block;
    `)}

    ${breakpointsPortrait(`
        display: none;
    `)}
`

export const Logo = styled.img`
    height: 20px;

    ${breakpointsPortrait(`
        width: 20px;
        object-fit: cover;
        object-position: left;
    `)}
`

export const LinkToStudio = styled.a`
    text-decoration: none;
    color: #1D7BFF;
    font-size: 16px;
    font-weight: 500;
    line-height: 28px;
    letter-spacing: -0.32px;
    display: flex;
    align-items: center;
    column-gap: 8px;
    height: 100%;

    &:hover, &:visited, &:focus {
        text-decoration: none;
        color: #1D7BFF;
    }

    span {
        ${breakpointsPortrait(`
            display: none;
        `)}
    }
`;

export const Controls = styled.div`
    display: flex;
    align-items: center;
    border-radius: 50px;
    background: rgba(29, 123, 255, 0.10);

    ${breakpointsPortrait(`
        display: none;
    `)}
`

export const ControlsSelectorContainer = styled.div`
    position: relative;

    label {
        display: block;
        position: absolute;
        top: calc(50% - 3px);
        right: 16px;
        width: 10px;
        height: 6px;
        background-image: url(https://cdn.streamlayer.io/sdk-web-demo/select-arr.png);
        background-size: contain;
        background-repeat: no-repeat;
    }

    display: none;

    ${breakpointsPortrait(`
        display: block;
    `)}
`

export const ControlsSelector = styled.select`
    display: none;
    border: none;
    font-weight: 500;
    font-size: 14px;
    padding: 0px;
    padding-left: 16px;
    padding-right: 34px;
    align-items: center;
    justify-content: center;
    gap: 4px;
    line-height: 28px;
    letter-spacing: -0.32px;
    border-radius: 50px;
    color: #fff;
    appearance: none;
    outline: none !important;
    position: relative;
    text-align: center;

    &::-ms-expand {
        display: none;
    }

    ${breakpointsPortrait(`
        display: flex;
    `)}

    background-blend-mode: soft-light, normal;
    background: linear-gradient(99deg, rgba(255, 255, 255, 0.00) 3.5%, rgba(255, 255, 255, 0.75) 35.2%, rgba(255, 255, 255, 0.90) 48.49%, rgba(255, 255, 255, 0.75) 66.48%, rgba(255, 255, 255, 0.00) 93.48%), #1D7BFF;
`

export const ControlButton = styled.button<{ active: boolean }>`
    height: 100%;
    border: none;
    color: #1D7BFF;
    cursor: pointer;
    outline: none;
    transition: all 0.3s;
    font-weight: 500;
    font-size: 14px;
    padding: 0px 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    line-height: 28px;
    letter-spacing: -0.32px;
    border-radius: 50px;
    background-color: transparent;

    ${({ active }) => !active && `
        &:hover {
            opacity: 0.5;
        }
    `}

    &:focus {
        outline: none;
    }

    &:disabled {
        opacity: 0.5;
    }

    ${({ active }) => active && `
        background: linear-gradient(99deg, rgba(255, 255, 255, 0.00) 3.5%, rgba(255, 255, 255, 0.75) 35.2%, rgba(255, 255, 255, 0.90) 48.49%, rgba(255, 255, 255, 0.75) 66.48%, rgba(255, 255, 255, 0.00) 93.48%), #1D7BFF;
        background-blend-mode: soft-light, normal;
        color: #fff;
        cursor: default;
    `}
`
