import {open} from '@tauri-apps/plugin-dialog'

const useSelectFolder = (title: string): {trigger: () => Promise<string | null>} => {
	return {
		trigger: () =>
			open({
				title,
				multiple: false,
				directory: true,
				recursive: false
			})
	}
}

export default useSelectFolder
