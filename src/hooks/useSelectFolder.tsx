//import EChannel from '@/enums/EChannel'
import {TFolderPath} from '@/types/TFilePath'

const useSelectFolder = (title: string): {trigger: () => Promise<TFolderPath>} => {
	//TODO migrate to Command
	//return {trigger: () => Electron.ipcRenderer.invoke(EChannel.SELECT_FOLDER, title)}
	return {trigger: () => Promise.resolve({canceled: false, filePaths: []})}
}

export default useSelectFolder
