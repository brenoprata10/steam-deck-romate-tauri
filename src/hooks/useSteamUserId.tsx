import {useContext} from 'react'
import {CommonContext} from '@/context'

const useSteamUserId = () => {
	const {steamUserId} = useContext(CommonContext)

	return steamUserId
}

export default useSteamUserId
