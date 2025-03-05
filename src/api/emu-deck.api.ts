import TParserConfig from '@/types/TParserConfig'
import {fetch} from '@tauri-apps/plugin-http'

export const getEmuDeckConfigFile = async (emulationFolderPath: string): Promise<TParserConfig[]> => {
	try {
		const response = await fetch(
			'https://raw.githubusercontent.com/dragoonDorise/EmuDeck/refs/heads/main/configs/steam-deck-romate/userConfigurations.json'
		)

		const emuDeckParserFile = (await response.json()) as TParserConfig[]
		return emuDeckParserFile.map((parser) => ({
			...parser,
			id: parser.id,
			name: parser.name,
			supportedFileTypes: parser.supportedFileTypes,
			romDirectory: `${emulationFolderPath}/${parser.romDirectory}`
		}))
	} catch (error) {
		console.error(error)
		throw Error('Could not load EmuDeck config file.')
	}
}
