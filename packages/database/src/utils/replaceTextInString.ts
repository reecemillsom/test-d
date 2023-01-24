export function replaceTextInString(string, replacerText) {
  return function (regex) {
    return string.replace(regex, replacerText);
  };
}
