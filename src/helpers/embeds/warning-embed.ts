import { Embed } from "guilded.js";

export const WarningEmbed = () => new Embed({
    title: "Warning",
    description: "You do not have permission to use this command.",
    color: 0xffff00,
});
