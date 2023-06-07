// Real programming happens here, in regex
export function removeArgs(command: string): string {
  const regex = /-\w+\s+(['"`])?.*?\1/g;
  return command.replace(regex, "").trim();
}

export function getArgs(command: string): Record<string, string> {
  const regex = /-(\w+)\s+(['"`]?)([^-]*)\2/g;
  const matches = command.matchAll(regex);
  const flags: Record<string, string> = {};

  for (const match of matches) {
    const flagName = match[1];
    const flagValue = match[3];
    flags[flagName] = flagValue.trim();
  }

  return flags;
}

export function removeFlags(input) {
  const regex = /(\s|^)--(\w+)(\s|$)/g;
  return input.replace(regex, '$1$3').trim();
}

export function parseFlags(str) {
  const regex = /^--(\w+)/; // regex to match "--" followed by one or more word characters
  const matches = regex.exec(str); // find the first match in the input string

  if (matches && matches.length > 1) {
    const key = matches[1]; // extract the key from the regex match
    const data = { [key]: true }; // create and return an object with the key and value
    console.log(data);
    return data;
  } else {
    return {}; // no match found, return an empty object
  }
}