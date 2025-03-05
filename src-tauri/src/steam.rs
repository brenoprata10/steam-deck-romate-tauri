use crate::enums::error::Error;
use sysinfo::System;

#[tauri::command]
pub fn is_steam_running() -> Result<bool, Error> {
    let mut system = System::new_all();
    system.refresh_all();

    for process in system.processes().values() {
        let process_name = process.name();
        if process_name.to_str().unwrap_or("").contains("steamweb") {
            return Ok(true);
        }
    }

    Ok(false)
}
