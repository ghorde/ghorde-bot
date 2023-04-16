# ghorde-bot
Welcome to the bot lib of ghorde 🥳

### Ghorde Bot Framework
The Ghorde Bot Framework aims to provide a scalable folder structure with common globals setup for even the average joe with bare minimum TypeScript knowledge to be able to make a command. It is based on the popular Guilded.js API wrapper for the Guilded API.

### How to add a command
Simply open the directory `./src/commands` and add the code of your command similar to samples provided, a good starting point might be `./src/commands/ping.command.ts` after that simply just add you command to the commands object in `./commands.ts` and voila if your code is right, everything should work. 

### Functional Paradigm
All the object oriented that had to be done has already been done, so you can sit back, relax and just type a few functions to get your command out there as fast as possible.

### Recommendations 
It is recommended that all API bullshittery be kept limited to the scope of the command but oh hey, it's open so if you know what you are doing, let your own brain guide you!