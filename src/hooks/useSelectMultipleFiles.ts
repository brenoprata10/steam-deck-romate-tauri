//import EChannel from '@/enums/EChannel'
import {TFolderPath} from '@/types/TFilePath'

const useSelectMultipleFiles = ({
	title,
	extensions = []
}: {
	title: string
	extensions: string[]
}): {trigger: () => Promise<TFolderPath>} => {
	//TODO migrate to Command
	//return {trigger: () => Electron.ipcRenderer.invoke(EChannel.SELECT_MULTIPLE_FILES, title, ...extensions)}
	return {trigger: () => Promise.resolve({canceled: false, filePaths: []})}
}

export default useSelectMultipleFiles
