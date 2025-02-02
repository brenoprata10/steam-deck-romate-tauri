import {open} from '@tauri-apps/plugin-dialog'

const useSelectMultipleFiles = ({
	title,
	extensions = []
}: {
	title: string
	extensions: string[]
}): {trigger: () => Promise<string[] | null>} => {
	return {
		trigger: async () => {
			const selected = await open({title, multiple: true, filters: [{name: '', extensions}]})
			if (selected === null) {
				return []
			}
			return Array.isArray(selected) ? selected : [selected]
		}
	}
}

export default useSelectMultipleFiles
