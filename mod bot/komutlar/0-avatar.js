const Discord = require('discord.js')

exports.run = function(client, message, args) {  
const salvokullanıcı = message.mentions.users.first()
let salvouser;
if (message.mentions.users.first())  {salvouser = message.mentions.users.first();}
else {salvouser = message.author;}
return message.channel.send(new Discord.MessageEmbed()
.setColor("RANDOM")
.setDescription(`**${salvouser.tag}** Avatar;`)
.setImage(salvouser.avatarURL()))
};

exports.conf = {
enabled: false,
guildOnly: false,
aliases: ["pp","avatar","profil-fotoğrafı"],
permLevel: 0 
};  
exports.help = {
name: 'avatar'
};
