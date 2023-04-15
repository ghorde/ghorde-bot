import { Embed } from "guilded.js";

export const ErrorEmbed = () => new Embed({
    title: "Error",
    description: "An error has occurred.",
    color: 0xff0000,
})