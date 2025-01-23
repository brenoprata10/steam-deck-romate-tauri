import {useContext} from 'react'
import {CommonContext} from '@/context'

const usePlatform = () => {
	const {platform} = useContext(CommonContext)

	return platform
}

export default usePlatform
