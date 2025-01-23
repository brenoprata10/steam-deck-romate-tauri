import {TSteamGridAsset} from '@/types/TApiSteamGridAssets'

export const getSelectedAsset = ({assets}: {assets: TSteamGridAsset[]}): TSteamGridAsset | undefined =>
	assets.find((asset) => asset.isSelected) ?? assets?.[0]
