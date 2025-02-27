import { IMode, ITheme } from "../../App"
import { STUDIO_LINK } from "../../config"
import { ControlButton, Controls, ControlsSelector, ControlsSelectorContainer, LinkToStudio, Logo, NavBarContainer, ShowMenuBtn } from "./styles"

type NavBarProps = {
    tabs: boolean,
    mode: IMode,
    theme: ITheme,
    disabled?: Partial<Record<IMode, boolean | undefined>>,
    toggleTheme: (e: React.MouseEvent<HTMLDivElement> | React.ChangeEvent ) => void,
    toggleMode: (e: React.MouseEvent<HTMLDivElement> | React.ChangeEvent ) => void
}

const debugTheme = window.localStorage.getItem('with-theme')

export const NavBar: React.FC<NavBarProps> = ({ mode, theme, tabs, toggleMode, toggleTheme, disabled }) => {
    return (
        <NavBarContainer className="NavBarContainer">
            <Logo src="https://cdn.streamlayer.io/sdk-web-demo/sl-logo.png"/>
            {tabs && <Controls onClick={toggleMode}>
                <ControlButton active={mode==='side-panel'} name='side-panel'>Sidebar</ControlButton>
                <ControlButton active={mode==='l-bar'} name='l-bar'>L-Bar</ControlButton>
                <ControlButton active={mode==='overlay'} disabled={disabled?.overlay} name='overlay'>Overlay</ControlButton>
            </Controls>}
            {tabs && <ControlsSelectorContainer>
                <ControlsSelector id="select-mode" onChange={toggleMode}>
                    <option value='side-panel' selected={mode==='side-panel'}>Sidebar</option>
                    <option value='l-bar' selected={mode==='l-bar'}>L-Bar</option>
                    <option value='overlay' selected={mode==='overlay'} disabled={disabled?.overlay}>Overlay</option>
                </ControlsSelector>
                <label htmlFor="select-mode" />
            </ControlsSelectorContainer>}
            {!!debugTheme && <ControlsSelectorContainer style={{ display: 'block' }}>
                <ControlsSelector style={{ display: 'flex' }} id="select-theme" onChange={toggleTheme}>
                    <option value='light' selected={theme==='light'}>Light</option>
                    <option value='dark' selected={theme==='dark'}>Dark</option>
                    <option value='tgl' selected={theme==='tgl'}>TGL</option>
                </ControlsSelector>
                <label htmlFor="select-mode" />
            </ControlsSelectorContainer>}
            <LinkToStudio href={STUDIO_LINK} target='_blank'>
                <img src='https://cdn.streamlayer.io/assets/sdk-web/storybook-assets/studio-link.svg' />
                <span>Open Studio</span>
            </LinkToStudio>
            <ShowMenuBtn className="ShowMenuBtn">Show menu</ShowMenuBtn>
        </NavBarContainer>
    )
}