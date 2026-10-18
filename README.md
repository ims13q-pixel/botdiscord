# بوت إرسال رسائل ديسكورد — discord.js v14

## المتطلبات
- Node.js إصدار 18.17 أو أحدث (يفضل إصدار LTS).
- تطبيق بوت من Discord Developer Portal.

## 1) إنشاء البوت ودعوته
1. افتح https://discord.com/developers/applications وأنشئ تطبيقًا جديدًا.
2. من تبويب **Bot** أنشئ البوت وانسخ **Token**. لا تشارك التوكن مع أحد.
3. من **OAuth2 > General** انسخ **Application ID**؛ ستضعه في `CLIENT_ID`.
4. من **OAuth2 > URL Generator** اختر Scopes: `bot` و `applications.commands`.
5. اختر Bot Permissions: `View Channels`, `Send Messages`, `Embed Links`. أضف `Mention Everyone` فقط إن كنت تريد السماح بخيار @everyone.
6. افتح رابط الدعوة الناتج وأضف البوت إلى سيرفرك.
7. فعّل Developer Mode في Discord، ثم اضغط بزر الفأرة الأيمن على أيقونة السيرفر واختر **Copy Server ID**؛ ستضعه في `GUILD_ID`.

## 2) إعداد ملف .env
1. انسخ `.env.example` وغيّر اسم النسخة إلى `.env` (تأكد أنه ليس `.env.txt`).
2. افتحه بالمفكرة وأدخل القيم الحقيقية:

```env
DISCORD_TOKEN=توكن_البوت_السري
CLIENT_ID=Application_ID
GUILD_ID=Server_ID
```

لا تضع علامات اقتباس حول القيم ولا تشارك ملف `.env`.

## 3) تشغيله على ويندوز
1. ثبّت Node.js من https://nodejs.org إذا لم يكن مثبتًا.
2. فك ضغط الملف وافتح مجلد `discord_message_bot`.
3. من شريط عنوان المجلد اكتب `cmd` ثم اضغط Enter لفتح موجه الأوامر داخل المجلد.
4. نفّذ الأوامر التالية واحدًا بعد الآخر:

```bash
npm install
npm run deploy
npm start
```

اترك نافذة الأوامر مفتوحة ليظل البوت يعمل. عند ظهور `البوت شغال` جرّب `/send` داخل السيرفر.

## 4) استخدام أمر /send
- `channel`: الروم النصي الذي سترسل فيه الرسالة.
- `message`: نص الرسالة؛ يمكنك وضع إيموجيات عادية أو إيموجيات السيرفر المخصصة التي يستطيع البوت استخدامها.
- `style`: اختر إيمبد أو بدون إيمبد.
- `mention`: اختياري، اختر عضوًا أو رتبة.
- `everyone`: اختر `True` فقط إذا أردت منشن الجميع؛ يتطلب صلاحية Mention Everyone للبوت في الروم.
- `color`: لون الإيمبد اختياري، مثل `#e53935`.

الأمر مقيّد للمسؤولين فقط. كتابة `@everyone` داخل النص وحدها لا تفعّل المنشن؛ يجب استخدام خيار `everyone`.

## حل المشاكل
- **الأمر لا يظهر:** تأكد من `CLIENT_ID` و`GUILD_ID` ثم نفّذ `npm run deploy` مجددًا.
- **Invalid token:** انسخ Token صحيحًا من تبويب Bot.
- **npm is not recognized:** ثبّت Node.js ثم أغلق وافتح CMD من جديد.
- **فشل الإرسال:** تأكد من صلاحيات View Channel وSend Messages، وأضف Embed Links للإيمبد أو Mention Everyone للمنشن الجماعي عند الحاجة.
