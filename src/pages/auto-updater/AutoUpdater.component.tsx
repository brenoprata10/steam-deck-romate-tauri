import EAutoUpdaterMessage from '@/enums/EAutoUpdaterMessage'
//import EChannel from '@/enums/EChannel'
import TAutoUpdaterMessage from '@/types/TAutoUpdaterMessage'
import {useCallback, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useMount} from 'react-use'
import ERoute from '@/enums/ERoute'
import {getRoutePath} from '@/route'
import {isDeveloperMode} from '@/utils/node-env'
import styles from './AutoUpdater.module.scss'

const AutoUpdater = () => {
	const navigate = useNavigate()
	const [updateStatus, setUpdateStatus] = useState<TAutoUpdaterMessage>({status: EAutoUpdaterMessage.CHECKING_UPDATE})

	const goToNextScreen = useCallback(() => {
		navigate(getRoutePath(ERoute.SETUP))
	}, [navigate])

	useMount(() => {
		//TODO migrate to Command
		/*Electron.ipcRenderer.on(EChannel.AUTO_UPDATER, (_, message: TAutoUpdaterMessage) => {
			setUpdateStatus(message)
			if ([EAutoUpdaterMessage.ERROR, EAutoUpdaterMessage.UPDATE_NOT_AVAILABLE].includes(message.status)) {
				goToNextScreen()
			}
		})*/
	       alert('here')
		if (isDeveloperMode || true) {
			goToNextScreen()
		}
	})

	return (
		<div className={styles['auto-updater']}>
			<h1>
				{updateStatus.status}
				{updateStatus.text ? ` - ${updateStatus.text}` : ''}
			</h1>
		</div>
	)
}

export default AutoUpdater
