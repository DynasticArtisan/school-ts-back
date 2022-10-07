module.exports = (string, replacements) => {
    replacements.forEach(replace => {
        string = string.replace(replace[0], replace[1])
    });
    return string
}
