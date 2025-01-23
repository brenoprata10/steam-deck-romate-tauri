import ParserCheckboxList from '@/pages/configure-parsers/parser-checkbox-list/ParserCheckboxList.component'

import TParserConfig from '@/types/TParserConfig'

const ParserExport = ({
	parsers,
	onExport
}: {
	parsers: TParserConfig[]
	onExport: (parsers: TParserConfig[]) => void
}) => {
	return <ParserCheckboxList parsers={parsers} ctaLabel={'Confirm'} title={'Export Parsers'} onSubmit={onExport} />
}

export default ParserExport
