import { IMode } from "../../App"
import { STUDIO_LINK } from "../../config"
import { ControlButton, Controls, ControlsSelector, ControlsSelectorContainer, LinkToStudio, Logo, NavBarContainer, ShowMenuBtn } from "./styles"

export const NavBar: React.FC<{ mode: IMode, disabled?: Partial<Record<IMode, boolean | undefined>>, toggleMode: (e: React.MouseEvent<HTMLDivElement> | React.ChangeEvent ) => void }> = ({ mode, toggleMode, disabled }) => {
    return (
        <NavBarContainer className="NavBarContainer">
            <Logo src="https://cdn.streamlayer.io/sdk-web-demo/sl-logo.png"/>
            <Controls onClick={toggleMode}>
                <ControlButton active={mode==='side-panel'} name='side-panel'>Side Panel</ControlButton>
                <ControlButton active={mode==='l-bar'} name='l-bar'>L-Bar</ControlButton>
                <ControlButton active={mode==='overlay'} disabled={disabled?.overlay} name='overlay'>Overlay</ControlButton>
            </Controls>
            <ControlsSelectorContainer>
                <ControlsSelector id="select-mode" onChange={toggleMode}>
                    <option value='side-panel' selected={mode==='side-panel'}>Side Panel</option>
                    <option value='l-bar' selected={mode==='l-bar'}>L-Bar</option>
                    <option value='overlay' selected={mode==='overlay'} disabled={disabled?.overlay}>Overlay</option>
                </ControlsSelector>
                <label htmlFor="select-mode" />
            </ControlsSelectorContainer>
            <LinkToStudio href={STUDIO_LINK} target='_blank'>
                <img src='https://cdn.streamlayer.io/assets/sdk-web/storybook-assets/studio-link.svg' />
                <span>Open Studio</span>
            </LinkToStudio>
            <ShowMenuBtn className="ShowMenuBtn">Show menu</ShowMenuBtn>
        </NavBarContainer>
    )
}