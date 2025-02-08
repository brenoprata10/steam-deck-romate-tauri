use steam_shortcuts_util::{self, app_id_generator::calculate_app_id, Shortcut};
use std::fs;
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct ParsedShortcut {
    #[serde(rename = "appId")]
    app_id: String,
    #[serde(rename = "appName")]
    app_name: String,
    exe: String,
    icon: String,
    #[serde(rename = "launchOptions")]
    launch_options: String
}

impl ParsedShortcut {
    fn new<'a>(shortcut: Shortcut<'a>) -> ParsedShortcut {
        let Shortcut {app_name, exe, app_id, icon, launch_options, ..} = shortcut;
        ParsedShortcut { 
            app_id: app_id.to_string(),
            app_name: app_name.to_string(),
            exe: exe.to_string(),
            icon: icon.to_string(),
            launch_options: launch_options.to_string()
        }
    }
}

#[tauri::command]
pub fn get_shortcuts(shortcut_path: &str) -> Result<Vec<ParsedShortcut>, String> {
    let content = fs::read(shortcut_path).map_err(|error| error.to_string())?;
    let steam_shortcuts = steam_shortcuts_util::parse_shortcuts(content.as_slice())?;
    let parsed_shortcuts = steam_shortcuts
        .into_iter()
        .map(|shortcut| ParsedShortcut::new(shortcut))
        .collect();

    Ok(parsed_shortcuts)
}

#[tauri::command]
pub fn save_shortcuts(shortcut_path: &str, shortcuts: Vec<ParsedShortcut>) -> Result<(), String> {
    let empty_string = String::new();
    let parsed_shortcuts = shortcuts
        .iter()
        .map(|shortcut| {
            let mut steam_shortcut = Shortcut::new(
                &empty_string,
                &shortcut.app_name,
                &shortcut.exe,
                &empty_string, 
                &shortcut.icon,
                &empty_string,
                &shortcut.launch_options
            );
            steam_shortcut.app_id = shortcut.app_id
                .parse()
                .unwrap_or(
                    calculate_app_id(&shortcut.exe, &shortcut.app_name)
                );
            steam_shortcut
        }).collect();
    let shortcut_bytes_vec = steam_shortcuts_util::shortcuts_to_bytes(&parsed_shortcuts);
    fs::write(shortcut_path,shortcut_bytes_vec).map_err(|error| error.to_string())?;

    Ok(())
}

