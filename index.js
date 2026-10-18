require('dotenv').config();
const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  PermissionFlagsBits
} = require('discord.js');

const { DISCORD_TOKEN } = process.env;
if (!DISCORD_TOKEN) {
  console.error('❌ لم يتم العثور على DISCORD_TOKEN في ملف .env');
  process.exit(1);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const HEX_COLOR = /^#?(?:[0-9a-fA-F]{6})$/;

client.once('ready', () => {
  console.log(`✅ البوت شغال باسم ${client.user.tag}`);
  console.log('💬 استخدم /send داخل السيرفر.');
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand() || interaction.commandName !== 'send') return;

  // حماية إضافية: الأمر للمسؤولين فقط.
  if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
    return interaction.reply({ content: '❌ هذا الأمر مخصص للمسؤولين فقط.', ephemeral: true });
  }

  const channel = interaction.options.getChannel('channel', true);
  const message = interaction.options.getString('message', true);
  const style = interaction.options.getString('style', true);
  const mentionable = interaction.options.getMentionable('mention');
  const everyone = interaction.options.getBoolean('everyone') ?? false;
  const rawColor = interaction.options.getString('color') ?? '#e53935';

  if (!channel.isTextBased() || channel.isDMBased() || !channel.guild) {
    return interaction.reply({ content: '❌ اختر رومًا نصيًا داخل السيرفر.', ephemeral: true });
  }

  const botMember = interaction.guild.members.me;
  const perms = channel.permissionsFor(botMember);
  if (!perms?.has(PermissionFlagsBits.ViewChannel) || !perms.has(PermissionFlagsBits.SendMessages)) {
    return interaction.reply({ content: '❌ البوت لا يملك صلاحية مشاهدة الروم أو إرسال الرسائل فيه.', ephemeral: true });
  }
  if (style === 'embed' && !perms.has(PermissionFlagsBits.EmbedLinks)) {
    return interaction.reply({ content: '❌ امنح البوت صلاحية Embed Links في الروم المحدد.', ephemeral: true });
  }
  if (everyone && !perms.has(PermissionFlagsBits.MentionEveryone)) {
    return interaction.reply({ content: '❌ البوت لا يملك صلاحية Mention Everyone في هذا الروم؛ لم تُرسل الرسالة.', ephemeral: true });
  }

  let mentionText = '';
  let users = [];
  let roles = [];
  if (mentionable) {
    if (mentionable.user) {
      mentionText = `<@${mentionable.id}>`;
      users = [mentionable.id];
    } else {
      mentionText = `<@&${mentionable.id}>`;
      roles = [mentionable.id];
    }
  }

  const allowedMentions = {
    parse: everyone ? ['everyone'] : [],
    users,
    roles,
    repliedUser: false
  };
  const prefix = [everyone ? '@everyone' : '', mentionText].filter(Boolean).join(' ');

  let payload;
  if (style === 'embed') {
    let color = '#e53935';
    if (HEX_COLOR.test(rawColor)) color = rawColor.startsWith('#') ? rawColor : `#${rawColor}`;
    const embed = new EmbedBuilder().setColor(color).setDescription(message);
    payload = { content: prefix || undefined, embeds: [embed], allowedMentions };
  } else {
    payload = { content: [prefix, message].filter(Boolean).join(' ').slice(0, 2000), allowedMentions };
  }

  try {
    const sent = await channel.send(payload);
    return interaction.reply({
      content: `✅ تم إرسال الرسالة بنجاح في <#${channel.id}>.\n[اضغط هنا لعرض الرسالة](${sent.url})`,
      ephemeral: true
    });
  } catch (error) {
    console.error('فشل إرسال الرسالة:', error);
    const reply = {
      content: '❌ تعذر إرسال الرسالة. تأكد من صلاحيات البوت ومن أن الروم يسمح بالإرسال.',
      ephemeral: true
    };
    if (interaction.replied || interaction.deferred) return interaction.followUp(reply).catch(() => {});
    return interaction.reply(reply).catch(() => {});
  }
});

client.login(DISCORD_TOKEN).catch(error => {
  console.error('❌ فشل تسجيل الدخول. راجع التوكن في ملف .env:', error.message);
  process.exit(1);
});
