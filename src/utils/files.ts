import {BaseDirectory, readDir, readTextFile, readFile} from '@tauri-apps/plugin-fs'

export const getFolderContents = async (
	folderPath: string,
	options?: {scanSubDirectories: boolean}
): Promise<Array<{path: string; name: string}>> => {
	try {
		const folderContents = await readDir(folderPath, {baseDir: BaseDirectory.Home})
		if (!options?.scanSubDirectories) {
			return folderContents.map((content) => ({path: folderPath, name: content.name}))
		}

		let folderContentsWithSubdirectories: {path: string; name: string}[] = []
		for (const content of folderContents) {
			if (content.isDirectory) {
				const innerFolderContents = await getFolderContents(`${folderPath}/${content.name}`, {scanSubDirectories: true})
				folderContentsWithSubdirectories = [...folderContentsWithSubdirectories, ...innerFolderContents]
				continue
			}
			folderContentsWithSubdirectories.push({path: folderPath, name: content.name})
		}

		return folderContentsWithSubdirectories
	} catch (error) {
		console.warn(error)
		console.log(`Could not find ${folderPath}`)
		return []
	}
}

export const getTextFileData = (path: string): Promise<string> => {
	return readTextFile(path)
}

export const getBufferFileData = async (path: string): Promise<Buffer> => {
	return Buffer.from(await readFile(path))
}

export const getFileExtension = (fileName: string) => {
	return fileName.match('\\w+$')?.[0] ?? ''
}

export const getFileNameWithoutExtension = (fileName: string) => {
	return fileName.match('^.+\\.')?.[0].replace(new RegExp('\\.$'), '') ?? fileName
}
