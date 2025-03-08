use crate::enums::error::Error;
use std::{fs, io::Write};
use tauri_plugin_http::reqwest;

#[tauri::command]
pub async fn download_asset(
    url: String,
    file_name: String,
    directory: String,
) -> Result<(), Error> {
    // Create directories path if it does not exist
    fs::create_dir_all(&directory)?;

    let mut file = fs::File::create(format!("{directory}/{file_name}"))?;
    let image = reqwest::get(url).await?.bytes().await?;
    file.write_all(&image)?;

    Ok(())
}
