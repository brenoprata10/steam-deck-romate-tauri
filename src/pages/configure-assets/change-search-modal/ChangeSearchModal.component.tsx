import {useCallback, useContext, useState} from 'react'
import {useAsyncFn} from 'react-use'
import {getGameAssetsByName} from '@/api/steam-grid.api'
import {CommonDispatchContext} from '@/context'
import useSteamGridApiKey from '@/hooks/useSteamGridApiKey'
import {EAction} from '@/reducer'
import TGame from '@/types/TGame'
import Button from '@/uikit/button/Button.component'
import Loader from '@/uikit/loader/Loader.component'
import Modal from '@/uikit/modal/Modal.component'
import {getGameSearchTerm} from '@/utils/game'
import styles from './ChangeSearchModal.module.scss'

const ChangeSearchModal = ({game, onClose}: {game: TGame; onClose: () => void}) => {
	const apiKey = useSteamGridApiKey()
	const dispatch = useContext(CommonDispatchContext)
	const searchTerm = getGameSearchTerm(game)
	const [inputSearchTerm, setInputSearchTerm] = useState(searchTerm)
	const [state, fetchAssets] = useAsyncFn(async () => {
		if (!apiKey) {
			throw Error('No API key provided')
		}
		const gameAssets = await getGameAssetsByName({gameName: inputSearchTerm, apiKey})
		if (!gameAssets) {
			alert(`No assets were located for search term: "${searchTerm}".`)
			throw Error('No assets found')
		}
		dispatch({type: EAction.UPDATE_GAME_SEARCH_TERM, payload: {gameId: game.id, searchTerm: inputSearchTerm}})
		dispatch({type: EAction.UPDATE_GAMES_ASSETS, payload: [{gameId: game.id, assets: gameAssets}]})
		onClose()
	}, [apiKey, game, inputSearchTerm])

	const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		setInputSearchTerm(event.target.value)
	}, [])

	return (
		<Modal
			isOpened={true}
			title={'Change Search Term'}
			className={styles['change-search-modal']}
			footerTrailing={
				<div className={styles.save}>
					<Button disabled={!searchTerm || state.loading} onClick={fetchAssets}>
						Save
					</Button>
				</div>
			}
			onClose={onClose}
		>
			{state.loading ? (
				<div className={styles.loader}>
					<Loader />
				</div>
			) : (
				<p>
					<label htmlFor={'search-term'}>New Search Term:</label>{' '}
					<input id={'search-term'} autoFocus value={inputSearchTerm} type={'text'} onChange={onChange} />
				</p>
			)}
		</Modal>
	)
}

export default ChangeSearchModal
