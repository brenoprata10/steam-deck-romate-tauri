import {useCallback, useContext, useState} from 'react'
import {useMount} from 'react-use'
import {CommonDispatchContext} from '@/context'
import useCustomParsers from '@/hooks/useCustomParsers'
import {EAction} from '@/reducer'
import TParserConfig from '@/types/TParserConfig'
import Button, {EButtonVariant} from '@/uikit/button/Button.component'
import Modal from '@/uikit/modal/Modal.component'
import {generateId} from '@/utils/generate-id'
import styles from './ConfigureParsers.module.scss'
import ParserForm from '@/pages/configure-parsers/parser-form/ParserForm.component'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faWarning} from '@fortawesome/free-solid-svg-icons'
import {useNavigate} from 'react-router-dom'
import {getRoutePath} from '@/route'
import ERoute from '@/enums/ERoute'
import {getGamesFromParsers} from '@/utils/parser'
import ELocalStorageKey from '@/enums/ELocalStorageKey'
import ParserImport from '@/pages/configure-parsers/parser-import/ParserImport.component'
import ParserExport from '@/pages/configure-parsers/parser-export/ParserExport.component'
import {create, BaseDirectory} from '@tauri-apps/plugin-fs'
import EStorageKey from '@/enums/EStorageKey'

enum EContentType {
	PARSER_CONFIG = 'PARSER_CONFIG',
	IMPORT = 'IMPORT',
	EXPORT = 'EXPORT'
}

const ConfigureParsers = () => {
	const navigate = useNavigate()
	const customParsers = useCustomParsers()
	const dispatch = useContext(CommonDispatchContext)
	const [selectedParserId, setSelectedParser] = useState<string | undefined>()
	const [contentType, setContentType] = useState(EContentType.PARSER_CONFIG)
	const selectedParser = customParsers?.find(({id}) => id === selectedParserId)
	const customParsersCount = customParsers?.length ?? 0

	useMount(() => {
		if (!customParsers || customParsers?.length === 0) {
			addEmptyParser()
		} else {
			setSelectedParser(customParsers?.[0].id)
		}
	})

	const handleBackNavigation = useCallback(() => {
		dispatch({type: EAction.SET_CUSTOM_PARSERS, payload: []})
		navigate(getRoutePath(ERoute.SETUP))
	}, [navigate, dispatch])

	const deleteSelectedParser = () => {
		setSelectedParser(customParsers?.find((parser) => parser.id !== selectedParserId)?.id)
		dispatch({
			type: EAction.SET_CUSTOM_PARSERS,
			payload: customParsers?.filter((parser) => parser.id !== selectedParserId) ?? []
		})
	}

	const selectParser = useCallback((parserId: string) => {
		setContentType(EContentType.PARSER_CONFIG)
		setSelectedParser(parserId)
	}, [])

	const addParser = useCallback(
		(parser: TParserConfig) => {
			dispatch({type: EAction.SET_CUSTOM_PARSERS, payload: [...(customParsers ?? []), parser]})
			selectParser(parser.id)
		},
		[customParsers, dispatch, selectParser]
	)

	const addEmptyParser = useCallback(
		() =>
			addParser({
				id: generateId().toString(),
				name: `Parser #${customParsersCount + 1}`,
				supportedFileTypes: ['zip', 'iso'],
				romDirectory: '<ROM_DIRECTORY>',
				executable: {path: '${filePath}'}
			}),
		[addParser, customParsersCount]
	)

	const onEditParser = useCallback(
		(parser: TParserConfig) => {
			dispatch({
				type: EAction.SET_CUSTOM_PARSERS,
				payload: customParsers?.map((customParser) => (customParser.id === parser.id ? parser : customParser)) ?? []
			})
		},
		[customParsers, dispatch]
	)

	const exportParsers = useCallback(async (exportedParsers: TParserConfig[]) => {
		console.log('here')
		const file = await create(`${EStorageKey.PARSERS}.json`, {baseDir: BaseDirectory.Desktop})
		await file.write(new TextEncoder().encode(JSON.stringify(exportedParsers)))
		await file.close()
		alert(`File ${EStorageKey.PARSERS}.json saved.\n\nThe file is located under the same path as this executable.`)
	}, [])

	const importParsers = useCallback(
		(storageParsers: TParserConfig[]) => {
			const customParsersWithoutDuplicates =
				customParsers?.filter((parser) => storageParsers.every((storageParser) => storageParser.id !== parser.id)) ?? []
			dispatch({
				type: EAction.SET_CUSTOM_PARSERS,
				payload: [...customParsersWithoutDuplicates, ...storageParsers]
			})
			alert(`Imported ${storageParsers.length} parser${storageParsers.length > 1 ? 's' : ''} successfully.`)
		},
		[dispatch, customParsers]
	)

	const handleSave = useCallback(async () => {
		if (!customParsers) {
			throw Error('Parser is not configured.')
		}

		const games = await getGamesFromParsers(customParsers.map((parser) => ({...parser, category: parser.name})))

		if (games.length === 0) {
			alert('No games were found within your parsers configuration, check your configuration.')
			return
		}

		localStorage.setItem(ELocalStorageKey.CUSTOM_PARSERS_KEY, JSON.stringify(customParsers))

		dispatch({
			type: EAction.SET_GAMES,
			payload: games
		})
		navigate(getRoutePath(ERoute.CONFIGURE_ASSETS))
	}, [navigate, dispatch, customParsers])

	const isValidParser = ({id, romDirectory, executable, supportedFileTypes, name}: TParserConfig) =>
		Boolean(id && name && romDirectory && executable.path && supportedFileTypes.length > 0)

	const isParsersValid = customParsers?.every(isValidParser)

	return (
		<Modal
			title='Create Parsers'
			isOpened={true}
			isCloseable={false}
			className={styles['configure-parsers-modal']}
			width={'min(55rem, 70%)'}
			footerLeading={
				<Button onClick={handleBackNavigation} variant={EButtonVariant.SECONDARY}>
					Back
				</Button>
			}
			footerTrailing={
				<Button disabled={customParsersCount === 0 || !isParsersValid} onClick={handleSave}>
					Save
				</Button>
			}
		>
			<div className={styles['parsers-list']}>
				{customParsers?.map((parser) => (
					<div
						key={parser.id}
						className={`${styles.item} ${!isValidParser(parser) ? styles['item-invalid'] : ''} ${
							contentType === EContentType.PARSER_CONFIG && selectedParserId === parser.id
								? styles['item-selected']
								: ''
						}`}
						onClick={() => selectParser(parser.id)}
					>
						{!isValidParser(parser) && <FontAwesomeIcon className={styles['error-icon']} icon={faWarning} />}
						<span className={styles.label}>{parser.name}</span>
					</div>
				))}
				<Button transparent={true} className={styles['parser-cta']} onClick={addEmptyParser}>
					Add Parser
				</Button>
				<Button
					transparent={contentType !== EContentType.IMPORT}
					className={styles['parser-cta']}
					onClick={() => setContentType(EContentType.IMPORT)}
				>
					Import
				</Button>
				<Button
					transparent={contentType !== EContentType.EXPORT}
					className={styles['parser-cta']}
					onClick={() => setContentType(EContentType.EXPORT)}
				>
					Export
				</Button>
			</div>
			{selectedParser && contentType === EContentType.PARSER_CONFIG && (
				<ParserForm
					key={selectedParser.id}
					parser={selectedParser}
					className={styles.form}
					onChange={onEditParser}
					onDelete={deleteSelectedParser}
				/>
			)}
			{contentType === EContentType.IMPORT && <ParserImport onImport={importParsers} />}
			{contentType === EContentType.EXPORT && <ParserExport parsers={customParsers ?? []} onExport={exportParsers} />}
		</Modal>
	)
}

export default ConfigureParsers
