import TGame from '@/types/TGame'
import TParserConfig from '@/types/TParserConfig'
import {getFileExtension, getFolderContents, getFileNameWithoutExtension} from '@/utils/files'
import {generateShortAppId} from '@/utils/generate-app-id'
import {getGameSearchTerm} from '@/utils/game'

export const getGamesFromParser = async (parser: TParserConfig): Promise<TGame[]> => {
	const files = await getFolderContents(parser.romDirectory, {scanSubDirectories: true})
	const romsFileNames = files.filter((file) =>
		parser.supportedFileTypes.some((fileType) => fileType === getFileExtension(file.name))
	)

	return romsFileNames
		.map((romFileName): TGame => {
			const name = getFileNameWithoutExtension(romFileName.name)
			const path = `${romFileName.path}/${romFileName.name}`
			const exec = parser.executable.path.replace('${filePath}', path)
			const launchOptions = parser.executable.arguments?.replace('${filePath}', path)

			return {
				id: generateShortAppId(parser.romDirectory, name),
				exec,
				name,
				collections: parser.category ? [parser.category] : [],
				path,
				launchOptions
			}
		})
		.map((game): TGame => ({...game, searchTerm: getGameSearchTerm(game)}))
}

export const getGamesFromParsers = async (parsers: TParserConfig[]): Promise<TGame[]> => {
	const games = []
	for (const parser of parsers) {
		games.push(...(await getGamesFromParser(parser)))
	}

	return games
}
