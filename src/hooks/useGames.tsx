import {useContext} from 'react'
import {CommonContext} from '@/context'
import TGame from '@/types/TGame'

const useGames = (): TGame[] => {
	return useContext(CommonContext).games
}

export default useGames
