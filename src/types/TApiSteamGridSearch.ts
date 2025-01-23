import TBaseApiSteamGrid from '@/types/TBaseApiSteamGrid'

type TSteamGridSearch = TBaseApiSteamGrid<{id: number; name: string; types: string[]; verified: boolean}[]>

export default TSteamGridSearch
