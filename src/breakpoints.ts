export const breakpoints = (value: string) => `
    @media only screen and (max-width: 1024px) {
        ${value}
    }

    @media only screen and (max-width: 1366px) and (orientation: landscape) {
        ${value}
    }
`

export const breakpointsPortrait = (value: string) => `
    @media only screen and (max-width: 1024px) and (orientation: portrait) {
        ${value}
    }
`