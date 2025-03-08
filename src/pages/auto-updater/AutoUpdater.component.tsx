import EAutoUpdaterMessage from '@/enums/EAutoUpdaterMessage'
import TAutoUpdaterMessage from '@/types/TAutoUpdaterMessage'
import {useCallback, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useMount} from 'react-use'
import ERoute from '@/enums/ERoute'
import {getRoutePath} from '@/route'
import styles from './AutoUpdater.module.scss'
import {check} from '@tauri-apps/plugin-updater'
import {relaunch} from '@tauri-apps/plugin-process'

const AutoUpdater = () => {
	const navigate = useNavigate()
	const [updateStatus, setUpdateStatus] = useState<TAutoUpdaterMessage>({status: EAutoUpdaterMessage.CHECKING_UPDATE})

	const goToNextScreen = useCallback(() => {
		navigate(getRoutePath(ERoute.SETUP))
	}, [navigate])

	useMount(async () => {
		try {
			const update = await check()
			if (update) {
				console.log(`found update ${update.version} from ${update.date} with notes ${update.body}`)
				let downloaded = 0
				let contentLength = 0
				// alternatively we could also call update.download() and update.install() separately
				await update.downloadAndInstall((event) => {
					switch (event.event) {
						case 'Started':
							contentLength = event.data.contentLength ?? 0
							setUpdateStatus({status: EAutoUpdaterMessage.UPDATE_AVAILABLE})
							break
						case 'Progress':
							downloaded += event.data.chunkLength
							setUpdateStatus({
								status: EAutoUpdaterMessage.DOWNLOAD_IN_PROGRESS,
								text: `Downloaded ${downloaded}/${contentLength} `
							})
							break
						case 'Finished':
							setUpdateStatus({status: EAutoUpdaterMessage.UPDATE_DOWNLOADED})
							console.log('download finished')
							break
					}
				})

				setUpdateStatus({status: EAutoUpdaterMessage.UPDATE_INSTALLED})
				await relaunch()
			}
		} catch (error) {
			console.log(`Failed to download update: ${error}`)
		} finally {
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
