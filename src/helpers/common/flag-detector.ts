// Real programming happens here, in regex
export function removeFlags(command: string): string {
  const regex = /-\w+\s+(['"`])?.*?\1/g;
  return command.replace(regex, "").trim();
}

export function getFlags(command: string): Record<string, string> {
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
