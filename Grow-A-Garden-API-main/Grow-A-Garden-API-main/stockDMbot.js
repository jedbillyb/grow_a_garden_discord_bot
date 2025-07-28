const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const fetch = (...args) => import('node-fetch').then(mod => mod.default(...args));
const BOT_TOKEN = 'MTM5OTE2NDg3Mjc0MjE0MTk3Mg.Gh4K7-.iqQMmcqgDOToVJc_2XHtdhnRxjYpESy-Qqvnq0'; // Replace with your bot token
const USER_ID = '1162693800590848030';     // Replace with your Discord user ID

const client = new Client({ intents: [GatewayIntentBits.DirectMessages, GatewayIntentBits.Guilds] });

function formatStockEmbed(title, items, stockId) {
  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(items.map(item =>
      `${item.emoji || ''} **${item.name}** (${item.value} in stock)`
    ).join('\n'))
    .setFooter({ text: `Stock ID: ${stockId} • Today at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` });
}

async function checkStockAndDM() {
  try {
    const res = await fetch('http://localhost:3000/api/stock/GetStock');
    const data = await res.json();

    // Fetch weather first
    let weatherText = '';
    try {
      const weatherRes = await fetch('http://localhost:3000/api/GetWeather');
      const weatherData = await weatherRes.json();
      const activeEvents = (weatherData.events || []).filter(ev => ev.isActive);
      if (activeEvents.length > 0) {
        const emojiMap = {
          rain: '🌧️', thunderstorm: '⛈️', bloodnight: '🌑', meteorshower: '☄️',
          disco: '🪩', jandelstorm: '🌪️', night: '🌙', volcano: '🌋',
          chocolaterain: '🍫🌧️', blackhole: '🕳️', frost: '❄️', bloodmoonevent: '🩸🌕',
          gale: '💨', megaharvest: '🌾', sungod: '☀️', nightevent: '🌚',
          tropicalrain: '🌴🌧️', auroraborealis: '🌌', windy: '💨', tornado: '🌪️',
          summerharvest: '🌻', heatwave: '🔥'
        };
        weatherText = `**Weather:** ` + activeEvents.map(ev =>
          `${emojiMap[ev.name] || ''} ${ev.displayName}`
        ).join(', ');
      } else {
        weatherText = '**Weather:** None active';
      }
    } catch (e) {
      weatherText = '**Weather:** (unavailable)';
    }

    const now = new Date();
    const minute = now.getMinutes();

    // --- Seeds & Gear: every 5 minutes ---
    if (minute % 5 === 0) {
      const user = await client.users.fetch(USER_ID);
      if (weatherText) await user.send(weatherText);

      // Gears
      const gears = (data.gearStock || []).filter(item => item.value > 0);
      if (gears.length > 0) {
        const embed = formatStockEmbed('Stock Updates - Gears', gears, Date.now());
        await user.send({ embeds: [embed] });
      }

      // Seeds
      const seeds = (data.seedsStock || []).filter(item => item.value > 0);
      if (seeds.length > 0) {
        const embed = formatStockEmbed('Stock Updates - Seeds', seeds, Date.now());
        await user.send({ embeds: [embed] });
      }
    }

    // --- Egg & Event: every hour ---
    if (minute === 0) {
      const user = await client.users.fetch(USER_ID);
      if (weatherText) await user.send(weatherText);

      // Eggs
      const eggs = (data.eggStock || []).filter(item => item.value > 0);
      if (eggs.length > 0) {
        const embed = formatStockEmbed('Stock Updates - Eggs', eggs, Date.now());
        await user.send({ embeds: [embed] });
      }

      // Events
      const events = (data.eventStock || []).filter(item => item.value > 0);
      if (events.length > 0) {
        const embed = formatStockEmbed('Stock Updates - Events', events, Date.now());
        await user.send({ embeds: [embed] });
      }
    }
  } catch (err) {
    console.error('Error checking stock for DM:', err);
  }
}

client.once('ready', () => {
  console.log(`Discord bot ready as ${client.user.tag}`);
  setInterval(checkStockAndDM, 60000); // check every 60s
});

client.login(BOT_TOKEN);