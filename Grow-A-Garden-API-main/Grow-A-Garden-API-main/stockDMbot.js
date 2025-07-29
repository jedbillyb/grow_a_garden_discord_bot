// 📦 GrowGuardian Bot - Full Version with DM Controls and Stock Alerts

const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const chalk = require('chalk');
const fetch = (...args) => import('node-fetch').then(mod => mod.default(...args));
const readline = require('readline');

const BOT_TOKEN = 'MTM5OTE2NDg3Mjc0MjE0MTk3Mg.Gh4K7-.iqQMmcqgDOToVJc_2XHtdhnRxjYpESy-Qqvnq0';
const USER_IDS = [
  '1162693800590848030',
  '1085337880022483014',
  '1358644289198100611',
  '838205645307248671',
  '869152480724938793',
  '1283307434579988596'
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
let lastStockState = { gears: new Map(), seeds: new Map(), eggs: new Map(), events: new Map() };

const targetSeeds = ['Giant Pinecone', 'Elder Strawberry', 'Burning Bud', 'Sugar Apple', 'Ember Lily', 'Beanstalk'];
const targetGear = ['Master Sprinkler'];
const targetEggs = ['Bug Egg', 'Paradise Egg'];
const targetEvents = ['Raiju', 'Koi', 'Zen Egg', 'Pet Shard Tranquill', 'Pet Shard Corrupted'];

const prismaticColors = {
<<<<<<< HEAD
  'Prismatic Apple': 0xFF69B4,
  'Prismatic Carrot': 0xFF4500,
  'Prismatic Tomato': 0xFF0000,
  'Prismatic Blueberry': 0x0000FF,
  'Prismatic Strawberry': 0xFF1493,
  'Prismatic Bamboo': 0x228B22
=======
'Prismatic Apple': 0xFF69B4,
'Prismatic Carrot': 0xFF4500, 
'Prismatic Tomato': 0xFF0000,
'Prismatic Blueberry': 0x0000FF,
'Prismatic Strawberry': 0xFF1493,
'Prismatic Bamboo': 0x228B22
>>>>>>> main
};

function getItemEmoji(itemName) {
  const emojiMap = {
    'Master Sprinkler': '💧👑',
    'Giant Pinecone': '🌲🔮',
    'Elder Strawberry': '🍓👴',
    'Burning Bud': '🔥🌸',
    'Sugar Apple': '🍎🍯',
    'Ember Lily': '🔥🌺',
    'Beanstalk': '🌱📏',
    'Bug Egg': '🐛🥚',
    'Paradise Egg': '🏝️🥚',
    'Mythical Egg': '✨🥚',
    'Rare Summer Egg': '☀️🥚',
    'Raiju': '⚡🐺',
    'Koi': '🐟🌸',
    'Zen Egg': '🧘🥚',
    'Pet Shard Tranquill': '💎😌',
    'Pet Shard Corrupted': '💎😈',
    'Trowel': '🔨', 'Harvest Tool': '🧰', 'Favorite Tool': '💖', 'Magnifying Glass': '🔍',
    'Recall Wrench': '🔧', 'Watering Can': '💧', 'Cleaning Spray': '🧴',
    'Apple': '🍎', 'Carrot': '🥕', 'Tomato': '🍅', 'Blueberry': '🫐', 'Strawberry': '🍓', 'Bamboo': '🎋',
    'Prismatic Apple': '✨🍎', 'Prismatic Carrot': '✨🥕', 'Prismatic Tomato': '✨🍅',
    'Prismatic Blueberry': '✨🫐', 'Prismatic Strawberry': '✨🍓', 'Prismatic Bamboo': '✨🎋',
    'Chicken Egg': '🥚', 'Duck Egg': '🦆', 'Goose Egg': '🪿'
  };
  return emojiMap[itemName] || '📦';
}

function formatStockEmbed(title, items, stockId) {
<<<<<<< HEAD
  const embed = new EmbedBuilder()
    .setTitle(title)
    .setColor(0x5865F2)
    .setTimestamp()
    .setFooter({ text: `Stock ID: ${stockId} • Today at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` });

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
      console.log(chalk.green(`✅ Sent DM to ${user.username}`));
    } catch (e) {
      console.log(chalk.red(`❌ Could not DM ${id}: ${e.message}`));
    }
  }
=======
const embed = new EmbedBuilder()
.setTitle(title)
.setColor(0x5865F2)
.setTimestamp()
.setFooter({ 
text: `Stock ID: ${stockId} • Today at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` 
});

if (items.length === 0) {
embed.setDescription('No items in stock');
return embed;
}

// Check if this is a prismatic item category and set special color
const firstItem = items[0];
if (firstItem && firstItem.name && firstItem.name.includes('Prismatic')) {
const prismaticColor = prismaticColors[firstItem.name];
if (prismaticColor) {
embed.setColor(prismaticColor);
}
}

const description = items.map(item => {
const emoji = getItemEmoji(item.name) || '📦';
return `${emoji} **${item.name}** (${item.value} in stock)`;
}).join('\n');

embed.setDescription(description);
return embed;
}

function getItemEmoji(itemName) {
const emojiMap = {
// Gears
'Trowel': '🔨',
'Harvest Tool': '🧰', 
'Favorite Tool': '💖',
'Magnifying Glass': '🔍',
'Recall Wrench': '🔧',
'Watering Can': '💧',
'Cleaning Spray': '🧴',

// Seeds
'Apple': '🍎',
'Carrot': '🥕',
'Tomato': '🍅',
'Blueberry': '🫐',
'Strawberry': '🍓',
'Bamboo': '🎋',

// Prismatic versions
'Prismatic Apple': '✨🍎',
'Prismatic Carrot': '✨🥕',
'Prismatic Tomato': '✨🍅',
'Prismatic Blueberry': '✨🫐',
'Prismatic Strawberry': '✨🍓',
'Prismatic Bamboo': '✨🎋',

// Eggs
'Chicken Egg': '🥚',
'Duck Egg': '🦆',
'Goose Egg': '🪿'
};

return emojiMap[itemName] || '📦';
}

async function checkWeatherEvents() {
try {
const weatherRes = await fetch('https://api.joshlee.com/weather');
const weatherData = await weatherRes.json();
    console.log('Weather API Response:', JSON.stringify(weatherData, null, 2));
const activeEvents = (weatherData.weather || []).filter(ev => ev.active);

// Create set of current active event names
const currentActiveEvents = new Set(activeEvents.map(ev => ev.weather_id));

// Check if events have changed
const eventsChanged = 
currentActiveEvents.size !== lastActiveEvents.size ||
[...currentActiveEvents].some(event => !lastActiveEvents.has(event));

if (eventsChanged) {
const user = await client.users.fetch(USER_ID);

if (activeEvents.length > 0) {
const emojiMap = {
rain: '🌧️', thunderstorm: '⛈️', bloodnight: '🌑', meteorshower: '☄️',
disco: '🪩', jandelstorm: '🌪️', night: '🌙', volcano: '🌋',
chocolaterain: '🍫🌧️', blackhole: '🕳️', frost: '❄️', bloodmoonevent: '🩸🌕',
gale: '💨', megaharvest: '🌾', sungod: '☀️', nightevent: '🌚',
tropicalrain: '🌴🌧️', auroraborealis: '🌌', windy: '💨', tornado: '🌪️',
summerharvest: '🌻', heatwave: '🔥'
};

const weatherEmbed = new EmbedBuilder()
.setTitle('🌤️ Weather Event Update!')
.setColor(0xFFD700)
.setDescription(activeEvents.map(ev =>
`${emojiMap[ev.weather_id] || '🌟'} **${ev.weather_id}** - Active now!`
).join('\n'))
.setTimestamp()
.setFooter({ text: 'Grow A Garden Weather Alert' });

await user.send({ embeds: [weatherEmbed] });
} else {
const weatherEmbed = new EmbedBuilder()
.setTitle('🌤️ Weather Clear')
.setColor(0x87CEEB)
.setDescription('No weather events currently active.')
.setTimestamp()
.setFooter({ text: 'Grow A Garden Weather Alert' });

await user.send({ embeds: [weatherEmbed] });
}

// Update last active events
lastActiveEvents = currentActiveEvents;
}
} catch (err) {
console.error('Error checking weather events:', err);
}
>>>>>>> main
}

async function checkStockAndDM() {
try {
const res = await fetch('http://localhost:3000/api/stock/GetStock');
const data = await res.json();

<<<<<<< HEAD
    const gears = (data.gearStock || []).filter(i => i.value > 0 && targetGear.includes(i.name));
    const seeds = (data.seedsStock || []).filter(i => i.value > 0 && targetSeeds.includes(i.name));
    const eggs = (data.eggStock || []).filter(i => i.value > 0 && targetEggs.includes(i.name));
    const events = (data.eventStock || []).filter(i => i.value > 0 && targetEvents.includes(i.name));

    const newGears = hasStockChanged(gears, lastStockState.gears);
    const newSeeds = hasStockChanged(seeds, lastStockState.seeds);
    const newEggs = hasStockChanged(eggs, lastStockState.eggs);
    const newEvents = hasStockChanged(events, lastStockState.events);

    if (newGears.length) await sendToUsers(formatStockEmbed('🔧 Stock Alert - Target Gears', newGears, Date.now()));
    if (newSeeds.length) await sendToUsers(formatStockEmbed('🌱 Stock Alert - Target Seeds', newSeeds, Date.now()));
    if (newEggs.length) await sendToUsers(formatStockEmbed('🥚 Stock Alert - Target Eggs', newEggs, Date.now()));
    if (newEvents.length) await sendToUsers(formatStockEmbed('🎉 Stock Alert - Target Events', newEvents, Date.now()));

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
    const logMessage = `[${timestamp}] 💌 DM from ${message.author.tag}: ${message.content}`;
    
    // Clear current line and log the DM
    readline.cursorTo(process.stdout, 0);
    readline.clearLine(process.stdout, 0);
    console.log(chalk.yellow(logMessage));
    
    // Optional: Auto-reply for testing
    await message.reply("🤖 I received your message: _" + message.content + "_");

    // Redraw the prompt
    promptMessage();
  }
});


client.once('ready', async () => {
  console.log(chalk.green(`✅ Logged in as ${client.user.tag}`));
  try {
    await client.user.setUsername('✧ GrowGuardian ✧');
    console.log(chalk.blue('✏️  Username updated!'));
  } catch (err) {
    console.error(chalk.red('❌ Failed to update username:'), err.message);
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
  
  console.log(chalk.magenta('\n💬 Who would you like to message?'));
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
      console.log(chalk.red('❌ Invalid selection.'));
      return promptMessage();
    }

    const recipients = index === 0 ? USER_IDS : [USER_IDS[index - 1]];

    rl.question(chalk.white('Enter your message: '), async (message) => {
      for (const id of recipients) {
        try {
          const user = await client.users.fetch(id);
          await user.send(message);
          console.log(chalk.green(`✅ Sent to ${user.username}`));
        } catch (err) {
          console.log(chalk.red(`❌ Failed to send to ${id}: ${err.message}`));
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
=======
const now = new Date();
const minute = now.getMinutes();

// --- Seeds & Gear: every 5 minutes ---
if (minute % 5 === 0) {
const user = await client.users.fetch(USER_ID);

// Gears
const gears = (data.gearStock || []).filter(item => item.value > 0);
if (gears.length > 0) {
const embed = formatStockEmbed('🔧 Stock Updates - Gears', gears, Date.now());
await user.send({ embeds: [embed] });
}

// Seeds
const seeds = (data.seedsStock || []).filter(item => item.value > 0);
if (seeds.length > 0) {
const embed = formatStockEmbed('🌱 Stock Updates - Seeds', seeds, Date.now());
await user.send({ embeds: [embed] });
}
}

// --- Egg & Event: every hour ---
if (minute === 0) {
const user = await client.users.fetch(USER_ID);

// Eggs
const eggs = (data.eggStock || []).filter(item => item.value > 0);
if (eggs.length > 0) {
const embed = formatStockEmbed('🥚 Stock Updates - Eggs', eggs, Date.now());
await user.send({ embeds: [embed] });
}

// Events
const events = (data.eventStock || []).filter(item => item.value > 0);
if (events.length > 0) {
const embed = formatStockEmbed('🎉 Stock Updates - Events', events, Date.now());
await user.send({ embeds: [embed] });
}
}
} catch (err) {
console.error('Error checking stock for DM:', err);
}
}

client.once('ready', () => {
console.log(`Discord bot ready as ${client.user.tag}`);
setInterval(checkStockAndDM, 60000); // check stock every 60s
setInterval(checkWeatherEvents, 30000); // check weather events every 30s for faster detection
});
>>>>>>> main
