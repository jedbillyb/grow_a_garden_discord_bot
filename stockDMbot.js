// ðŸ“¦ GrowGuardian Bot - Full Version with DM Controls and Stock Alerts

const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const chalk = require('chalk');
const fetch = (...args) => import('node-fetch').then(mod => mod.default(...args));
const readline = require('readline');

const BOT_TOKEN = 'MTM5OTE2NDg3Mjc0MjE0MTk3Mg.GhAS6C.-yuxATnuxTQa4Nggk19Bqm3M9uBM23ERtEq348';
const USER_IDS = [
  'USER_1_ID',
  'USER_2_ID'
];

const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.DirectMessageReactions
  ],
  partials: ['CHANNEL', 'MESSAGE', 'REACTION', 'USER']
});

let USER_MAP = new Map();
let lastStockState = { gears: new Map(), seeds: new Map(), eggs: new Map() };


const targetSeeds = ['Giant Pinecone', 'Elder Strawberry', 'Burning Bud', 'Sugar Apple', 'Ember Lily', 'Beanstalk'];
const targetGear = ['Master Sprinkler', 'Grandmaster Sprinkler'];
const targetEggs = ['Bug Egg', 'Paradise Egg'];


const prismaticColors = {
  'Prismatic Apple': 0xFF69B4,
  'Prismatic Carrot': 0xFF4500,
  'Prismatic Tomato': 0xFF0000,
  'Prismatic Blueberry': 0x0000FF,
  'Prismatic Strawberry': 0xFF1493,
  'Prismatic Bamboo': 0x228B22
};

function getItemEmoji(itemName) {
  const emojiMap = {
    'Master Sprinkler': 'ðŸ’§ðŸ‘‘',
    'Giant Pinecone': 'ðŸŒ²ðŸ”®',
    'Elder Strawberry': 'ðŸ“ðŸ‘´',
    'Burning Bud': 'ðŸ”¥ðŸŒ¸',
    'Sugar Apple': 'ðŸŽðŸ¯',
    'Ember Lily': 'ðŸ”¥ðŸŒº',
    'Beanstalk': 'ðŸŒ±ðŸ“',
    'Bug Egg': 'ðŸ›ðŸ¥š',
    'Paradise Egg': 'ðŸï¸ðŸ¥š',
    'Mythical Egg': 'âœ¨ðŸ¥š',
    'Rare Summer Egg': 'â˜€ï¸ðŸ¥š',
    'Raiju': 'âš¡ðŸº',
    'Koi': 'ðŸŸðŸŒ¸',
    'Zen Egg': 'ðŸ§˜ðŸ¥š',
    'Pet Shard Tranquill': 'ðŸ’ŽðŸ˜Œ',
    'Pet Shard Corrupted': 'ðŸ’ŽðŸ˜ˆ',
    'Trowel': 'ðŸ”¨', 'Harvest Tool': 'ðŸ§°', 'Favorite Tool': 'ðŸ’–', 'Magnifying Glass': 'ðŸ”',
    'Recall Wrench': 'ðŸ”§', 'Watering Can': 'ðŸ’§', 'Cleaning Spray': 'ðŸ§´',
    'Apple': 'ðŸŽ', 'Carrot': 'ðŸ¥•', 'Tomato': 'ðŸ…', 'Blueberry': 'ðŸ«', 'Strawberry': 'ðŸ“', 'Bamboo': 'ðŸŽ‹',
    'Prismatic Apple': 'âœ¨ðŸŽ', 'Prismatic Carrot': 'âœ¨ðŸ¥•', 'Prismatic Tomato': 'âœ¨ðŸ…',
    'Prismatic Blueberry': 'âœ¨ðŸ«', 'Prismatic Strawberry': 'âœ¨ðŸ“', 'Prismatic Bamboo': 'âœ¨ðŸŽ‹',
    'Chicken Egg': 'ðŸ¥š', 'Duck Egg': 'ðŸ¦†', 'Goose Egg': 'ðŸª¿'
  };
  return emojiMap[itemName] || 'ðŸ“¦';
}

function formatStockEmbed(title, items, stockId) {
  const embed = new EmbedBuilder()
    .setTitle(title)
    .setColor(0x5865F2)
    .setTimestamp()
    .setFooter({ text: `Stock ID: ${stockId} â€¢ Today at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` });

  if (items.length === 0) return embed.setDescription('No items in stock');

  const firstItem = items[0];
  if (firstItem && firstItem.name.includes('Prismatic')) {
    const color = prismaticColors[firstItem.name];
    if (color) embed.setColor(color);
  }

  embed.setDescription(items.map(item => `${getItemEmoji(item.name)} **${item.name}** (${item.value} in stock)`).join('\n'));
  return embed;
}

function hasStockChanged(currentItems, lastMap) {
  const newItems = [];
  for (const item of currentItems) {
    const prev = lastMap.get(item.name) || 0;
    if (item.value > prev) newItems.push(item);
    lastMap.set(item.name, item.value);
  }
  for (const [name] of lastMap.entries()) {
    if (!currentItems.find(item => item.name === name)) lastMap.set(name, 0);
  }
  return newItems;
}

async function sendToUsers(embed) {
  for (const id of USER_IDS) {
    try {
      const user = await client.users.fetch(id);
      await user.send({ embeds: [embed] });
      console.log(chalk.green(`âœ… Sent DM to ${user.username}`));
    } catch (e) {
      console.log(chalk.red(`âŒ Could not DM ${id}: ${e.message}`));
    }
  }
}

async function checkStockAndDM() {
  try {
    const res = await fetch('http://localhost:3000/api/stock/GetStock');
    const data = await res.json();

    const gears = (data.gearStock || []).filter(i => i.value > 0 && targetGear.includes(i.name));
    const seeds = (data.seedsStock || []).filter(i => i.value > 0 && targetSeeds.includes(i.name));
    const eggs = (data.eggStock || []).filter(i => i.value > 0 && targetEggs.includes(i.name));
   

    const newGears = hasStockChanged(gears, lastStockState.gears);
    const newSeeds = hasStockChanged(seeds, lastStockState.seeds);
    const newEggs = hasStockChanged(eggs, lastStockState.eggs);


    if (newGears.length) await sendToUsers(formatStockEmbed('ðŸ”§ Stock Alert - Target Gears', newGears, Date.now()));
    if (newSeeds.length) await sendToUsers(formatStockEmbed('ðŸŒ± Stock Alert - Target Seeds', newSeeds, Date.now()));
    if (newEggs.length) await sendToUsers(formatStockEmbed('ðŸ¥š Stock Alert - Target Eggs', newEggs, Date.now()));
  

  } catch (err) {
    console.error(chalk.red('Error checking stock:'), err);
  }
}

client.on('messageCreate', async (message) => {
  // Ignore bots (including yourself)
  if (message.author.bot) return;

  // Debug log for ALL incoming messages
  console.log(chalk.gray(`[DEBUG] Received message: ${message.content} (Channel type: ${message.channel.type})`));

  // Handle DMs (type 1)
  if (message.channel.type === 1) {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] ðŸ’Œ DM from ${message.author.tag}: ${message.content}`;
    
    // Clear current line and log the DM
    readline.cursorTo(process.stdout, 0);
    readline.clearLine(process.stdout, 0);
    console.log(chalk.yellow(logMessage));
    
    // Optional: Auto-reply for testing
    await message.reply("ðŸ¤– I received your message: _" + message.content + "_");

    // Redraw the prompt
    promptMessage();
  }
});


client.once('ready', async () => {
  console.log(chalk.green(`âœ… Logged in as ${client.user.tag}`));
  try {
    await client.user.setUsername('âœ§ GrowGuardian âœ§');
    console.log(chalk.blue('âœï¸  Username updated!'));
  } catch (err) {
    console.error(chalk.red('âŒ Failed to update username:'), err.message);
  }

  for (const id of USER_IDS) {
    try {
      const user = await client.users.fetch(id);
      USER_MAP.set(id, user.username);
    } catch {
      USER_MAP.set(id, 'Unknown');
    }
  }

  setInterval(checkStockAndDM, 60000);
  promptMessage();
});

client.login(BOT_TOKEN);

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function promptMessage() {
  // Clear any existing prompt
  readline.cursorTo(process.stdout, 0);
  readline.clearLine(process.stdout, 0);
  
  console.log(chalk.magenta('\nðŸ’¬ Who would you like to message?'));
  console.log(chalk.cyan('0.') + ' Broadcast to everyone');
  USER_IDS.forEach((id, i) => {
    console.log(chalk.cyan(`${i + 1}.`) + ` ${USER_MAP.get(id)} (${id})`);
  });

  rl.question(chalk.white('\nChoose a number or type "exit": '), async (input) => {
    if (input.toLowerCase() === 'exit') {
      rl.close();
      process.exit(0);
    }

    const index = parseInt(input);
    if (isNaN(index) || index < 0 || index > USER_IDS.length) {
      console.log(chalk.red('âŒ Invalid selection.'));
      return promptMessage();
    }

    const recipients = index === 0 ? USER_IDS : [USER_IDS[index - 1]];

    rl.question(chalk.white('Enter your message: '), async (message) => {
      for (const id of recipients) {
        try {
          const user = await client.users.fetch(id);
          await user.send(message);
          console.log(chalk.green(`âœ… Sent to ${user.username}`));
        } catch (err) {
          console.log(chalk.red(`âŒ Failed to send to ${id}: ${err.message}`));
        }
      }
      promptMessage();
    });
  });
}

client.on('error', error => {
  console.error(chalk.red('Client error:'), error);
});

client.on('warn', warning => {
  console.warn(chalk.yellow('Client warning:'), warning);
});