const Discord = require('discord.js')

exports.run = async(client, message, args) => {
if (!message.member.hasPermission('MANAGE_NICKNAMES')) return message.channel.send(new Discord.MessageEmbed().setColor("RANDOM").setDescription(`Bu Komutu Kullanabilmek İçin **Kullanıcı Adlarını Yönet** Yetkisine Sahip Olmalısın.`));
let salvokullanıcı = message.mentions.members.first()
if (!salvokullanıcı) return message.channel.send(new Discord.MessageEmbed().setColor("RANDOM").addField("Hatalı Kullanım",`Lütfen Bir Kullanıcı Etiketleyiniz`))
let salvoisim = args.slice(1).join(' ')
if (!salvokullanıcı) return message.channel.send(new Discord.MessageEmbed().setColor("RANDOM").addField("Hatalı Kullanım",`Lütfen Bir İsim Yazınız`))
salvokullanıcı.setNickname(salvoisim)
message.channel.send(new Discord.MessageEmbed().setColor("RANDOM").addField("İşlem Başarılı",`${salvokullanıcı} İsimli Kullanıcının Yeni İsmi **${salvoisim}\** Olarak Ayarlandı!`))
}

exports.conf = {
  name: true,
  guildonly: false,
  aliases: ['isim', 'i-değiştir', 'isimdeğiştir', 'değiştir-isim'],
  permlevel: 0
}
exports.help = {
  name: 'İsim',
  usage: 'isim @kullanıcı <İsim>',
  description: 'Kullanıcının İsmini Düzenler'
}

  