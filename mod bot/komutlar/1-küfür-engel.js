const Discord = require('discord.js')
const db = require('quick.db')
const ayarlar = require('../ayarlar.json')
let prefix = ayarlar.prefix

exports.run = async (client ,message, args) => {
if(args[0] === 'aç') {
db.set(`${message.guild.id}.kufur`, true)
const salvo = new Discord.MessageEmbed()  
  .addField("İşlem Başarılı",`Küfür Engel Başarılı Bir Şekilde Akif Edildi`)
  .setColor("GREEN")
  .setFooter("LAREX ❤️ PLANTA")
return message.channel.send(salvo)
}
if (args[0] === 'kapat') {
db.delete(`${message.guild.id}.kufur`)
const salvo = new Discord.MessageEmbed() 
  .addField("İşlem Başarılı",`Küfür Engel Başarılı Bir Şekilde Kapatıldı`)
  .setColor("GREEN")
  .setFooter("LAREX ❤️ PLANTA")
return message.channel.send(salvo)
}
{
const salvo = new Discord.MessageEmbed() 
  .addField("Hatalı Kullanım",`Örnek Kullanım: **${prefix}küfür-engel aç/kapat**`)
  .setColor("RED")
  .setFooter("LAREX ❤️ PLANTA")
return message.channel.send(salvo)
}
};

exports.conf = {
 enabled: true,
 guildOnly: false,
 aliases: ['küfürengel','küfür-engel'], 
 permLevel: 0
};

exports.help = {
 name: 'küfür-engel',
 description: 'Küfürleri Engeller',
 usage: 'küfür-engel'
};

