//TODO migrate
//import {homedir} from 'os'
import path from 'path'
import {getBufferFileData, getFolderContents, getTextFileData} from '@/utils/files'
import fsPromise from 'fs/promises'
import TUserData from '@/types/TUserData'
import VDF from 'vdf-parser'
import TSteamLocalConfig from '@/types/TSteamLocalConfig'
import EPlatform from '@/enums/EPlatform'
import {getPlatform} from '@/utils/platform'
import ESteamUserDataPath from '@/enums/ESteamUserDataPath'

const STEAM_AVATAR_AKAMAI_URL = 'https://avatars.akamai.steamstatic.com'

export const getSteamPathConfig = async (
	steamId?: string | null
): Promise<
	| {
			hasSteamId: true
			userDataDirectory: string
			shortcutsFile: string
			localConfigFile: string
			assetsDirectory: string
	  }
	| {hasSteamId: false; userDataDirectory: string}
> => {
	const platform = await getPlatform()
	const isWindows = platform === EPlatform.WINDOWS

	const userDataDirectory = isWindows
		? path.join(ESteamUserDataPath.WINDOWS, 'userdata')
		// TODO migrate
		//: path.join(homedir(), ESteamUserDataPath.LINUX, 'userdata')
		: path.join(ESteamUserDataPath.LINUX, 'userdata')

	if (!steamId) {
		return {hasSteamId: false, userDataDirectory}
	}

	return {
		hasSteamId: true,
		userDataDirectory,
		assetsDirectory: path.join(userDataDirectory, steamId, 'config', 'grid'),
		shortcutsFile: path.join(userDataDirectory, steamId, 'config', 'shortcuts.vdf'),
		localConfigFile: path.join(userDataDirectory, steamId, 'config', 'localconfig.vdf')
	}
}

export const getSteamLocalConfigData = async (userId: string): Promise<TSteamLocalConfig> => {
	const steamPathConfig = await getSteamPathConfig(userId)
	if (steamPathConfig.hasSteamId) {
		const localConfigPath = steamPathConfig.localConfigFile
		const localConfigData = await getTextFileData(localConfigPath)
		return VDF.parse(localConfigData) as TSteamLocalConfig
	}
	throw Error('User ID is not available.')
}

export const getAvailableUserAccounts = async (): Promise<TUserData[]> => {
	const steamPathConfig = await getSteamPathConfig()
	const usersId = getFolderContents(steamPathConfig.userDataDirectory)
	const users: TUserData[] = usersId.map((userId) => ({
		id: userId.name
	}))

	for (const user of users) {
		try {
			const localConfigData = await getSteamLocalConfigData(user.id)
			const userData = localConfigData.UserLocalConfigStore.friends[user.id]
			user.name = userData.name ?? userData.NameHistory?.[0]
			user.avatarPictureSrc = `${STEAM_AVATAR_AKAMAI_URL}/${userData.avatar}_full.jpg`
		} catch (error) {
			console.error(`Could not load localconfig.vdf file for user: ${user.id}`)
		}
	}

	return users
}

export const getSteamShortcuts = async ({
	steamUserId
}: {
	steamUserId: string
}): Promise<{shortcuts: {[id: string]: {[name: string]: string | number}}}> => {
	try {
		const steamPathConfig = await getSteamPathConfig(steamUserId)
		if (steamPathConfig.hasSteamId) {
			const buffer = await getBufferFileData(steamPathConfig.shortcutsFile)
			//TODO migrate
			//return readVdf(buffer) as {shortcuts: {[id: string]: {[name: string]: string | number}}}
			return {} as {shortcuts: {[id: string]: {[name: string]: string | number}}}

		}
		throw Error('User ID is not available.')
	} catch (error) {
		console.warn('Could not locate shortcuts.vdf file.')
		return {shortcuts: {}}
	}
}

export const saveSteamShortcuts = async ({shortcuts, steamUserId}: {shortcuts:{[name: string]: string | number}; steamUserId: string}) => {
			//TODO migrate
	//const outBuffer = writeVdf(shortcuts)
	const outBuffer = {} as unknown as any

	const steamPathConfig = await getSteamPathConfig(steamUserId)
	if (steamPathConfig.hasSteamId) {
		await fsPromise.writeFile(steamPathConfig.shortcutsFile, outBuffer)
		return
	}
	throw Error('User ID is not available.')
}
