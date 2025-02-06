use crate::api::steam_grid::fetch_asset;

#[tauri::command]
pub fn download_asset() -> String {
    fetch_asset()
}
