import {platform, Platform} from '@tauri-apps/plugin-os'

export const getPlatform = async (): Promise<Platform> => {
	return Promise.resolve(platform())
}
