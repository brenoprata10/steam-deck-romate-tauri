enum EAutoUpdaterMessage {
	CHECKING_UPDATE = 'Checking for update...',
	UPDATE_AVAILABLE = 'Update available...',
	UPDATE_NOT_AVAILABLE = 'Update not available...',
	ERROR = 'Error in auto-updater',
	DOWNLOAD_IN_PROGRESS = 'Downloading update',
	UPDATE_DOWNLOADED = 'Update downloaded. Installing...',
	UPDATE_INSTALLED = 'Update Installed'
}

export default EAutoUpdaterMessage
