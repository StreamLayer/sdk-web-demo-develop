import { useStreamLayer } from "@streamlayer/react"
import { useEffect } from "react"
import '@streamlayer/sdk-web-anonymous-auth'

export const Auth = () => {
    const sdk = useStreamLayer()

    useEffect(() => {
        sdk?.anonymousAuthorization()
    }, [sdk])

    return null
}