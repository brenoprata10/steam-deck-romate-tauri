//import EChannel from '@/enums/EChannel'
import TSteamCategory from '@/types/TSteamCategory'

//TODO migrate
export const getCategoriesByUser = ({steamUserId}: {steamUserId: string}) => {
	return []
}
//Electron.ipcRenderer.invoke(EChannel.FETCH_STEAM_USER_COLLECTIONS, steamUserId) as Promise<TSteamCategory[]>

export const saveCategoryByUser = ({
	steamUserId,
	collection
}: {
	steamUserId: string
	collection: {key: string; value: TSteamCategory['value']}
}) => {} //Electron.ipcRenderer.invoke(EChannel.SAVE_STEAM_COLLECTION, steamUserId, collection) as Promise<void>

export const isSteamCategoriesReady = ({steamUserId}: {steamUserId: string}) => {
	return false
}
//Electron.ipcRenderer.invoke(EChannel.IS_STEAM_CATEGORIES_READY, steamUserId) as Promise<boolean>
