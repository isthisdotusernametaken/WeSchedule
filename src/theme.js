/*
    Exports: THEMES (object), setTheme (function)
    The THEMES object can be externally viewed to select a theme. One of its
    keys (not properties - to simplify external selection code) can then be
    provided to setTheme to replace the page's stylesheet.
*/

// These objects are used only as unchanging dictionaries, and property naming
// conventions are ignored to simplify the code that sets the theme.
const THEMES_DICT = Object.freeze({
    "Dark 1": ["Vapor", "https://bootswatch.com/5/vapor/bootstrap.min.css"],
    "Dark 2": ["Darkly", "https://bootswatch.com/5/darkly/bootstrap.min.css"],
    "Light 1": ["Pulse", "https://bootswatch.com/5/pulse/bootstrap.min.css"],
    "Light 2": ["Sandstone", "https://bootswatch.com/5/sandstone/bootstrap.min.css"],
});
export const THEMES = Object.freeze(Object.fromEntries(
    Object.entries(THEMES_DICT).map(
        ([label, [name, _]]) => [label, name]
    ) // Avoiding a list here makes THEMES truly immutable and safe to export
));

export const setTheme = (theme) => {
    if (!Object.keys(THEMES_DICT).includes(theme))
        return false;

    document.getElementById("css-theme").href = THEMES_DICT[theme][1];
    return true;
}