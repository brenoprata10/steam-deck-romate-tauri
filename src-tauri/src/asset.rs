use tauri_plugin_http::reqwest;
use std::{fs, io::Write};

#[tauri::command]
pub async fn download_asset(url: String, file_name: String, directory: String) -> Result<(), String> {
    // Create directories path if it does not exist
    fs::create_dir_all(&directory).map_err(|error| error.to_string())?;

    let mut file = fs::File::create(format!("{directory}/{file_name}"))
        .map_err(|error| error.to_string())?;
    let image = reqwest::get(url)
        .await.map_err(|error| error.to_string())?
        .bytes().await.map_err(|error| error.to_string())?;
    file.write_all(&image).map_err(|error| error.to_string())?;

    Ok(())
}
