import TParserConfig from '@/types/TParserConfig'
import TSteamRomManagerParserConfig from '@/types/TSteamRomManagerParserConfig'
import {fetch} from '@tauri-apps/plugin-http'

export const getEmuDeckConfigFile = async (emulationFolderPath: string): Promise<TParserConfig[]> => {
	try {
		const response = await fetch(
			'https://raw.githubusercontent.com/dragoonDorise/EmuDeck/main/configs/steam-rom-manager/userData/userConfigurations.json'
		)

		const emuDeckParserFile = (await response.json()) as TSteamRomManagerParserConfig[]
		console.log(emuDeckParserFile)
		return emuDeckParserFile.map((parser) => ({
			...parser,
			id: parser.configTitle,
			name: parser.configTitle,
			supportedFileTypes:
				parser.parserInputs.glob?.match(/\.\w+/g)?.map((match) => match.toString().replace('.', '')) ?? [],
			romDirectory: `${emulationFolderPath}/${parser.romDirectory.replace('/run/media/mmcblk0p1/', '').replace('${romsdirglobal}', 'roms')}`
		}))
	} catch (error) {
		console.error(error)
		throw Error('Could not load EmuDeck config file.')
	}
}
