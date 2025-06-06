import {createContext} from 'react'
import {TAction, TCommonState} from '@/reducer'

type TCommonContext = TCommonState

export const CommonContext = createContext({} as TCommonContext)
export const CommonDispatchContext = createContext({} as React.Dispatch<TAction>)
