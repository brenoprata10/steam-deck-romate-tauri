//import {ipcRenderer} from 'electron'
import EChannel from '@/enums/EChannel'
import EPlatform from '@/enums/EPlatform'

	//TODO migrate to Command
export const getPlatform = async (): Promise<EPlatform> => (await ipcRenderer.invoke(EChannel.PLATFORM)) as EPlatform
