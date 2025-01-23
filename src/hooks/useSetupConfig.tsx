import ESetup from '@/enums/ESetup'
import {getSetupConfig} from '@/utils/setup-config'

const useSetupConfig = ({setup}: {setup: ESetup}) => {
	return getSetupConfig(setup)
}

export default useSetupConfig
