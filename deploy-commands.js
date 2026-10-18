require('dotenv').config();
const { REST, Routes, SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

const { DISCORD_TOKEN, CLIENT_ID, GUILD_ID } = process.env;
if (!DISCORD_TOKEN || !CLIENT_ID || !GUILD_ID) {
  console.error('❌ عبّئ DISCORD_TOKEN و CLIENT_ID و GUILD_ID في ملف .env أولًا.');
  process.exit(1);
}

const command = new SlashCommandBuilder()
  .setName('send')
  .setDescription('إرسال رسالة عادية أو بإيمبد مع منشن وإيموجيات')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addChannelOption(option => option
    .setName('channel')
    .setDescription('الروم الذي سترسل فيه الرسالة')
    .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
    .setRequired(true))
  .addStringOption(option => option
    .setName('message')
    .setDescription('محتوى الرسالة، ويمكنك إضافة الإيموجيات هنا')
    .setMaxLength(2000)
    .setRequired(true))
  .addStringOption(option => option
    .setName('style')
    .setDescription('اختيار شكل الرسالة')
    .addChoices(
      { name: 'إيمبد', value: 'embed' },
      { name: 'بدون إيمبد', value: 'plain' }
    )
    .setRequired(true))
  .addMentionableOption(option => option
    .setName('mention')
    .setDescription('اختياري: اختر عضوًا أو رتبة لمنشنها'))
  .addBooleanOption(option => option
    .setName('everyone')
    .setDescription('منشن @everyone (يتطلب صلاحية Mention Everyone)'))
  .addStringOption(option => option
    .setName('color')
    .setDescription('لون الإيمبد بصيغة HEX مثل #e53935')
    .setMaxLength(7));

const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);
(async () => {
  try {
    console.log('⏳ جاري تسجيل أمر /send في السيرفر...');
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
      body: [command.toJSON()]
    });
    console.log('✅ تم تسجيل أمر /send بنجاح.');
  } catch (error) {
    console.error('❌ تعذر تسجيل الأمر:', error);
    process.exitCode = 1;
  }
})();
