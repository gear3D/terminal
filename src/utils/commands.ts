import packageJson from "../../package.json";
import themes from "../../themes.json";
import { history } from "../stores/history";
import { theme } from "../stores/theme";
import { theme as themeStore } from "../stores/theme";
import { todoManager } from "./todo";

const hostname = window.location.hostname;

const themesArray = ["3024day","3024night","aci","aco","adventuretime","afterglow","alienblood","argonaut","arthur","atom","aura","ayudark","ayulight","ayumirage","azu","belafonteday","belafontenight","bim","birdsofparadise","blazer","blulocolight","blulocozshlight","borland","broadcast","brogrammer","c64","cai","chalk","chalkboard","chameleon","ciapre","cloneofubuntu","clrs","cobalt2","cobaltneon","colorcli","crayonponyfish","darkpastel","darkside","dehydration","desert","dimmedmonokai","dissonance","dracula","earthsong","elemental","elementary","elic","elio","espresso","espressolibre","fairyfloss","fairyflossdark","fishtank","flat","flatland","flatremix","foxnightly","freya","frontenddelight","frontendfunforrest","frontendgalaxy","geohot","github","gogh","gooey","googledark","googlelight","gotham","grape","grass","gruvbox","gruvboxdark","hardcore","harper","hemisudark","hemisulight","highway","hipstergreen","homebrew","horizonbright","horizondark","hurtado","hybrid","ibm3270(highcontrast)","ibm3270","icgreenppl","icorangeppl","idletoes","irblack","jackiebrown","japanesque","jellybeans","jup","kibble","kokuban","laserwave","laterthisevening","lavandula","liquidcarbon","liquidcarbontransparent","lunariadark","lunariaeclipse","lunarialight","maia","manpage","mar","material","mathias","medallion","misterioso","miu","molokai","monalisa","mono-amber","mono-cyan","mono-green","mono-red","mono-white","mono-yellow","monokaidark","monokaipro","monokaiproristretto","monokaisoda","morada","n0tch2k","neon-night","neopolitan","nep","neutron","nightlionv1","nightlionv2","nightowl","nighty","nord","nordlight","novel","obsidian","ocean","oceandark","oceanicnext","ollie","omni","onedark","onehalfblack","onelight","palenight","pali","panda","papercolordark","papercolorlight","paraisodark","paulmillr","pencildark","pencillight","peppermint","pixiefloss","pnevma","powershell","pro","purplepeopleeater","redalert","redsands","relaxed","rippedcasts","royal","sat","seafoampastel","seashells","seti","shaman","shel","slate","smyck","snazzy","softserver","solarizeddarcula","solarizeddark","solarizeddarkhighercontrast","solarizedlight","sonokai","spacedust","spacegray","spacegrayeighties","spacegrayeightiesdull","spring","square","srcery","summer-pop","sundried","sweet-eliverlara","sweetterminal","symphonic","synthwave","teerb","tender","terminalbasic","terminixdark","thayerbright","tin","tokyonight","tokyonightlight","tokyonightstorm","tomorrow","tomorrownight","tomorrownightblue","tomorrownightbright","tomorrownighteighties","toychest","treehouse","twilight","ura","urple","vag","vaughn","vibrantink","vscodedark+","vscodelight+","warmneon","wez","wildcherry","wombat","wryan","wzoreck","zenburn"]
let lastIndex: number | null = null;

export const commands: Record<string, (args: string[]) => Promise<string> | string> = {
  help: () => {
    const categories = {
      System: ["help", "clear", "date", "exit"],
      Productivity: ["todo", "weather"],
      Customization: ["theme", "banner"],
      Links: ["tuckshop", "planner", "onedrive", "sharepoint", "network"],
    };

    let output = "Available commands:\n\n";

    for (const [category, cmds] of Object.entries(categories)) {
      output += `${category}:\n`;
      output += cmds.map((cmd) => `  ${cmd}`).join("\n");
      output += "\n\n";
    }

    output +=
      'Type "[command] help" or "[command]" without args for more info.';

    return output;
  },

  tuckshop: (args: string[]) => {
    window.open("https://tuckshop.victorycollege.com/wp/Profile/Accounts");
  },
  planner: (args: string[]) => {
    window.open("https://planner.cloud.microsoft/webui/myplans/recent?tid=316b7750-5b50-462b-b596-61016ec97f10");
  },
  onedrive: (args: string[]) => {
    window.open("https://vcqld-my.sharepoint.com/?login_hint=c%2Ewright%40victorycollege%2Ecom&source=waffle");
  },
  sharepoint: (args: string[]) => {
    window.open("https://vcqld.sharepoint.com/_layouts/15/sharepoint.aspx?login_hint=c.wright%40victorycollege.com");
  },
  network: (args: string[]) => {
    window.open("https://common.cloud.hpe.com/");
  },
  glpi: (args: string[]) => {
    window.open("https://helpdesk.victorycollege.com/front/helpdesk.public.php");
  },
  vici: (args: string[]) => {
    window.open("https://vici.victorycollege.com/");
  },
  theme: (args: string[]) => {
    const usage = `Usage: theme [args].
    [args]:
      ls: list all available themes
      set: set theme to [theme]

    [Examples]:
      theme ls
      theme set gruvboxdark
    `;
    if (args.length === 0) {
      return usage;
    }

    switch (args[0]) {
      case "ls": {
        let result = themes.map((t) => t.name.toLowerCase()).join(", ");
        result += `You can preview all these themes here: ${packageJson.repository.url}/tree/master/docs/themes`;

        return result;
      }

      case "random": {
        let randomIndex: number;
        do {
          randomIndex = Math.floor(Math.random() * themesArray.length);
        } while (themesArray.length > 1 && randomIndex === lastIndex);

        lastIndex = randomIndex;
        const randomTheme = themesArray[randomIndex];

        const t = themes.find((t) => t.name.toLowerCase() === randomTheme);
        theme.set(t);
        
        return `Random theme selected: ${randomTheme}`;
      }

      case "set": {
        if (args.length !== 2) {
          return usage;
        }

        const selectedTheme = args[1];
        const t = themes.find((t) => t.name.toLowerCase() === selectedTheme);

        if (!t) {
          return `Theme '${selectedTheme}' not found. Try 'theme ls' to see all available themes.`;
        }

        theme.set(t);

        return `Theme set to ${selectedTheme}`;
      }

      default: {
        return usage;
      }
    }
  },
  clear: () => {
    history.set([]);

    return "";
  },
  weather: async (args: string[]) => {
    const city = args.join("+");

    if (!city) {
      return "Usage: weather [city]. Example: weather Brussels";
    }

    const weather = await fetch(`https://wttr.in/${city}?ATm`);

    return weather.text();
  },
  exit: () => {
    return "Please close the tab to exit.";
  },
  curl: async (args: string[]) => {
    if (args.length === 0) {
      return "curl: no URL provided";
    }

    const url = args[0];

    try {
      const response = await fetch(url);
      const data = await response.text();

      return data;
    } catch (error) {
      return `curl: could not fetch URL ${url}. Details: ${error}`;
    }
  },
  banner: () => {
    if (hostname === "gear3d.duckdns.org") {
    return `
 ██████╗ ███████╗ █████╗ ██████╗ ██████╗ ██████╗ 
██╔════╝ ██╔════╝██╔══██╗██╔══██╗╚════██╗██╔══██╗
██║  ███╗█████╗  ███████║██████╔╝ █████╔╝██║  ██║
██║   ██║██╔══╝  ██╔══██║██╔══██╗ ╚═══██╗██║  ██║
╚██████╔╝███████╗██║  ██║██║  ██║██████╔╝██████╔╝
 ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚═════╝   v${packageJson.version}

Type 'help' to see list of available commands.
`} else {
  return `
██╗      ██████╗  ██████╗ █████╗ ██╗     
██║     ██╔═══██╗██╔════╝██╔══██╗██║     
██║     ██║   ██║██║     ███████║██║     
██║     ██║   ██║██║     ██╔══██║██║     
███████╗╚██████╔╝╚██████╗██║  ██║███████╗
╚══════╝ ╚═════╝  ╚═════╝╚═╝  ╚═╝╚══════╝   v${packageJson.version}

`
  }
},
  todo: (args: string[]) => {
    const usage = `Usage: todo [command] [args]

Commands:
  add <text>     Add a new todo
  ls [filter]    List todos (filter: all, completed, pending)
  done <id>      Mark todo as completed
  rm <id>        Remove a todo
  clear [completed]  Clear todos (add 'completed' to clear only completed)
  stats          Show todo statistics

Examples:
  todo add Buy groceries
  todo ls
  todo ls pending
  todo done 1
  todo rm 2
  todo clear completed`;

    if (args.length === 0) {
      return usage;
    }

    const [subCommand, ...subArgs] = args;

    switch (subCommand) {
      case "add":
        if (subArgs.length === 0) {
          return "Error: Please provide todo text. Example: todo add Buy milk";
        }
        return todoManager.add(subArgs.join(" "));

      case "ls":
      case "list":
        const filter = subArgs[0] as
          | "all"
          | "completed"
          | "pending"
          | undefined;
        if (filter && !["all", "completed", "pending"].includes(filter)) {
          return "Error: Invalid filter. Use: all, completed, or pending";
        }
        return todoManager.list(filter);

      case "done":
      case "complete":
        const completeId = parseInt(subArgs[0]);
        if (isNaN(completeId)) {
          return "Error: Please provide a valid todo ID number";
        }
        return todoManager.complete(completeId);

      case "rm":
      case "remove":
      case "delete":
        const removeId = parseInt(subArgs[0]);
        if (isNaN(removeId)) {
          return "Error: Please provide a valid todo ID number";
        }
        return todoManager.remove(removeId);

      case "clear":
        const onlyCompleted = subArgs[0] === "completed";
        return todoManager.clear(onlyCompleted);

      case "stats":
        return todoManager.stats();

      default:
        return `Unknown todo command: ${subCommand}\n\n${usage}`;
    }
  },
};
