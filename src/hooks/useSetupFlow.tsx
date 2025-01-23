import {useContext} from 'react'
import {CommonContext} from '@/context'

const useSetupFlow = () => {
	const {setupFlow} = useContext(CommonContext)

	return setupFlow
}

export default useSetupFlow
