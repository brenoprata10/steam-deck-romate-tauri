use steam_shortcuts_util::{self, Shortcut};
use std::fs;
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
pub struct ParsedShortcut {
    app_id: String,
    app_name: String,
    exe: String,
    icon: String,
    launch_options: Option<String>
}

impl ParsedShortcut {
    fn new<'a>(shortcut: Shortcut<'a>) -> ParsedShortcut {
        let Shortcut {app_name, exe, app_id, icon, launch_options, ..} = shortcut;
        ParsedShortcut { 
            app_id: app_id.to_string(),
            app_name: app_name.to_string(),
            exe: exe.to_string(),
            icon: icon.to_string(),
            launch_options: Some(launch_options.to_string()) 
        }
    }
}

#[tauri::command]
pub fn get_shortcuts(shortcut_path: &str) -> Result<Vec<ParsedShortcut>, String> {
    println!("{}", shortcut_path);
    let content = fs::read(shortcut_path).map_err(|error| error.to_string())?;
    let steam_shortcuts = steam_shortcuts_util::parse_shortcuts(content.as_slice())?;

    let parsed_shortcuts = steam_shortcuts.into_iter().map(|shortcut| ParsedShortcut::new(shortcut)).collect();
    Ok(parsed_shortcuts)
}

