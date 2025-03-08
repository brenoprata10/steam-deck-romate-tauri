import {useMount} from 'react-use'
import TParserConfig from '@/types/TParserConfig'
import EStorageKey from '@/enums/EStorageKey'
import {useState} from 'react'
import ParserCheckboxList from '@/pages/configure-parsers/parser-checkbox-list/ParserCheckboxList.component'
import {readTextFile, BaseDirectory} from '@tauri-apps/plugin-fs'

const ParserImport = ({onImport}: {onImport: (parsers: TParserConfig[]) => void}) => {
	const [parsers, setParsers] = useState<TParserConfig[]>([])

	useMount(async () => {
		const parsers = await readTextFile(`${EStorageKey.PARSERS}.json`, {
			baseDir: BaseDirectory.Desktop
		})
		setParsers(JSON.parse(parsers))
	})

	return <ParserCheckboxList parsers={parsers} ctaLabel={'Confirm'} title={'Import Parsers'} onSubmit={onImport} />
}

export default ParserImport
