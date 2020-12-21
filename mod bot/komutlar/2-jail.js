  const Discord = require("discord.js");

exports.run = async(client, message, args, ayar, emoji) => {
 if (!message.member.roles.cache.has("785629452532187213") && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(new Discord.MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setColor(0x00bfff).addField("Yetersiz Yetki",`Bu Komutu Kullanmak içi Yeterli Yetkiniz Yok`)).then(m => m.delete({timeout: 7000}));
  let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  let reason = args.splice(1).join(" ");
  if(!uye || !reason) return message.channel.send(new Discord.MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setColor(0x00bfff).setDescription("Geçerli bir üye ve sebep belirtmelisin!")).then(x => x.delete({timeout: 5000}));
  if (message.member.roles.highest.position <= uye.roles.highest.position) return message.channel.send(new Discord.MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setColor(0x00bfff).setDescription(`Belirttiğin kişi senden üstün veya onunla aynı yetkidesin!`)).then(x => x.delete({timeout: 5000}));
  await uye.roles.set(uye.roles.cache.has("786187248357081099") ? ["785629452460621868", "786187248357081099"] : ["785629452460621868"]).catch();
  if(uye.voice.channel) uye.voice.kick().catch();
  message.channel.send(new Discord.MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setColor(0x00bfff).setDescription(`${uye} üyesi, ${message.author} tarafından **${reason}** nedeniyle jaile atıldı!`)).catch();
  client.channels.cache.get("786997820758294587").send(new Discord.MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setColor(0x00bfff).setDescription(`${uye} İsimli Kullanıcı Jail'e Atıldı\n\n• Yetkili <@!${message.author.id}> \`${message.author.id}\`\n• Kullanıcı: <@!${uye.id}> \`${uye.id}\`\n\n• Sebep: **${reason}**`)).catch();
};
exports.conf = {
    enabled: true,
    guildOnly: false,
    permLevel: 0,
    aliases: ["jail","karantina"]
    }
    
    exports.help = {
  name: "jail",
  aliases: ['cezalı', 'ceza'],
  usage: "jail [üye] [sebep]",
  description: "Belirtilen üyeyi jaile atar."
    }