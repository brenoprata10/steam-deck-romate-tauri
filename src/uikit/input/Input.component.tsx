import {faPaste} from '@fortawesome/free-solid-svg-icons'
import {InputHTMLAttributes, useCallback} from 'react'
import Button, {EButtonVariant} from '@/uikit/button/Button.component'
import styles from './Input.module.scss'
import { readText } from '@tauri-apps/plugin-clipboard-manager';

const Input = ({
	nativeProps,
	onClipboardPaste
}: {
	nativeProps: InputHTMLAttributes<HTMLInputElement>
	onClipboardPaste?: (value: string) => void
}) => {
	const onPaste = useCallback(async () => {
		const text = await readText()
		onClipboardPaste?.(text)
	}, [onClipboardPaste])

	return (
		<div className={styles['input-wrapper']} style={onClipboardPaste ? {display: 'flex'} : undefined}>
			<input {...nativeProps} />{' '}
			{onClipboardPaste && (
				<Button variant={EButtonVariant.SECONDARY} className={styles['paste-button']} icon={faPaste} onClick={onPaste}>
					Paste
				</Button>
			)}
		</div>
	)
}

export default Input
