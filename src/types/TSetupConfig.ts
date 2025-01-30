import {Platform} from '@tauri-apps/plugin-os'

type TSetupConfig = {
	label: string
	image: string
	supportedPlatforms: Platform[]
}

export default TSetupConfig
