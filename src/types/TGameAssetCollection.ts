import EAssetType from '@/enums/EAssetType'
import {TSteamGridAsset} from '@/types/TApiSteamGridAssets'

type TGameAssetCollection = {
	[asset in EAssetType]: TSteamGridAsset[]
}

export default TGameAssetCollection
