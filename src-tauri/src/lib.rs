use asset::download_asset;
use steam::is_steam_running;
use steam_shortcut::{get_shortcuts, save_shortcuts};

mod asset;
mod enums;
mod steam;
mod steam_shortcut;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .invoke_handler(tauri::generate_handler![
            download_asset,
            get_shortcuts,
            save_shortcuts,
            is_steam_running
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
