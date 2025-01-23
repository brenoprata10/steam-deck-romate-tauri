import {useContext} from 'react'
import {CommonContext} from '@/context'

const useCustomParsers = () => {
	const {customParsers} = useContext(CommonContext)

	return customParsers
}

export default useCustomParsers
