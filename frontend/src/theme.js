/*
    Exports: THEMES (array), setTheme (function)
*/

// Create an immutable array of name-link pairs
const THEMES_AND_LINKS = Object.freeze([
    ["Dark 1", "https://bootswatch.com/5/vapor/bootstrap.min.css"],
    ["Dark 2", "https://bootswatch.com/5/darkly/bootstrap.min.css"],
    ["Light 1", "https://bootswatch.com/5/pulse/bootstrap.min.css"],
    ["Light 2", "https://bootswatch.com/5/sandstone/bootstrap.min.css"],
].map(Object.freeze));

// External view for theme names
export const THEMES = Object.freeze(THEMES_AND_LINKS.map(
    ([name, _]) => name // Extract only the name
));

export const setTheme = (ind) => {
    if (ind < 0 || ind >= THEMES.length)
        return false;

    document.getElementById("css-theme").href = THEMES_AND_LINKS[ind][1];
    return true;
}