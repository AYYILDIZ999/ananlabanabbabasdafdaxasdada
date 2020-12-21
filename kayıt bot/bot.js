const fs = require("fs");
const Discord = require("discord.js");
const client = new Discord.Client();
const db = require("quick.db");
const moment = require("moment");
const ayarlar = require("./ayarlar.json");
const express = require("express");
/////
const app = express();
app.get("/", (req, res) => res.send("Bot Aktif"));
app.listen(process.env.PORT, () =>
  console.log("Port ayarlandı: " + process.env.PORT)
);
//////////////////

client.on("message", message => {
  let client = message.client;
  if (message.author.bot) return;
  if (!message.content.startsWith(ayarlar.prefix)) return;
  let command = message.content.split(" ")[0].slice(ayarlar.prefix.length);
  let params = message.content.split(" ").slice(1);
  let perms = client.yetkiler(message);
  let cmd;
  if (client.commands.has(command)) {
    cmd = client.commands.get(command);
  } else if (client.aliases.has(command)) {
    cmd = client.commands.get(client.aliases.get(command));
  }
  if (cmd) {
    if (perms < cmd.conf.permLevel) return;
    cmd.run(client, message, params, perms);
  }
});

client.on("ready", () => {
  console.log(`Bütün komutlar başarıyla yüklendi!`);
  client.user.setStatus("dnd");
  client.user.setActivity("P L A N T A");
});

const log = message => {
  console.log(`[${moment().format("YYYY-MM-DD HH:mm:ss")}] ${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./komutlar/", (err, files) => {
  if (err) console.error(err);
  log(`${files.length} adet komut yüklemeye hazırlanılıyor.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut ismi: ${props.help.name.toUpperCase()}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.yetkiler = message => {
  if (!message.guild) {
    return;
  }
  let permlvl = -ayarlar.varsayilanperm;
  if (message.member.hasPermission("MANAGE_MESSAGES")) permlvl = 1;
  if (message.member.hasPermission("KICK_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 3;
  if (message.member.hasPermission("MANAGE_GUILD")) permlvl = 4;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 5;
  if (message.author.id === message.guild.ownerID) permlvl = 6;
  if (message.author.id === ayarlar.sahip) permlvl = 7;
  return permlvl;
};

client.on("message", async msg => {
  if (msg.author.bot) return;

  let i = await db.fetch(`reklamFiltre_${msg.guild.id}`);
  if (i == "acik") {
    const reklam = ["https://", "http://", "discord.gg"];
    if (reklam.some(word => msg.content.toLowerCase().includes(word))) {
      try {
        if (!msg.member.hasPermission("MANAGE_GUILD")) {
          msg.delete();
          return msg.channel
            .send(`${msg.author.tag}, Reklam Yapmak Yasak!`)
            .then(msg => msg.delete(10000));
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
  if (!i) return;
});

client.on("messageUpdate", msg => {
  const i = db.fetch(`${msg.guild.id}.kufur`);
  if (i) {
    const kufur = [
      "oç",
      "amk",
      "ananı sik iyim",
      "piç",
      "orospu çocuğu",
      "orospu",
      "oruspu"
    ];
    if (kufur.some(word => msg.content.includes(word))) {
      try {
        if (!msg.member.hasPermission("BAN_MEMBERS")) {
          msg.delete();

          return msg
            .reply("Bu Sunucuda Küfür Filtresi Aktiftir.")
            .then(msg => msg.delete(3000));
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
  if (!i) return;
});

client.on("message", async msg => {
  const i = await db.fetch(`ssaass_${msg.guild.id}`);
  if (i == "acik") {
    if (
      msg.content.toLowerCase() == "sa" ||
      msg.content.toLowerCase() == "s.a" ||
      msg.content.toLowerCase() == "selamun aleyküm" ||
      msg.content.toLowerCase() == "sea" ||
      msg.content.toLowerCase() == "selam"
    ) {
      try {
        return msg.reply("Aleyküm Selam, Hoşgeldin");
      } catch (err) {
        console.log(err);
      }
    }
  } else if (i == "kapali") {
  }
  if (!i) return;
});

client.login(process.env.Token);

//-------------------- Reklam Engel Sistemi --------------------//


//---------------------------------KOMUTLAR---------------------------------\\


client.on("guildMemberAdd", async member => {
  require("moment-duration-format");
  moment.locale("tr");
  let user = client.users.cache.get(member.id);
  let tarih = moment(member.user.createdAt.getTime()).format("LLL");
  let gün = moment
    .duration(new Date().getTime() - member.user.createdAt.getTime())
    .format("D");
  let resim = new Discord.MessageAttachment(
    "https://cdn.discordapp.com/attachments/789876551818543104/790580313818005524/fbd70a1f16c79e436737bcb0869736a4.gif"
  );
  let kişi = member.guild.memberCount;
  let kayıtcırol = "785629452532187210"; //Yetkili rolünüz ID'sini girin.
  let kanal = client.channels.cache.get("785629452612534287"); //Kanalınızın ID'sini girin.
  const kurulus = new Date().getTime() - user.createdAt.getTime();
  const gün1 = moment.duration(kurulus).format("D");
  var devtr;
  if (kurulus < 1296000000)
    devtr = "Hesabınız Şüpheli";
  if (kurulus > 1296000000)
    devtr = "Hesabınız Güvenli";
  let emoji2 = client.emojis.cache.find(emoji => emoji.name === "planta_satan");

  kanal.send(
    `<a:90:790566738743132160>  **SUNUCUMUZA HOŞ GELDİN** 
 \n<a:Plantakalp:790571101377396736> Hoşgeldin, <@${member.user.id}> Seninle beraber **${kişi}** kişiyiz.\n\n<:planta_slm:790568773315723305> Sunucuya Kayıt Olmak İçin Sol Taraftaki #Planta Registery Odalarına Geçiş Yapabilirsin \n\n<a:maden:785795976987803678> <@&785629452532187210> sizinle ilgilenecektir.\n\n${emoji2} ${devtr} \n\n<a:planta_hype:790577789354508289> Hesap kuruluş tarihi **${tarih}** [**${gün}** gün önce] \n\n   `,
  resim
  );
});
//TlhaMert Youtube Kanalı : https://youtube.com/c/TlhaMert
//
client.on("guildMemberAdd", async member => {
  member.roles.add("785629452486836249");
  const rochelle = member.guild.channels.cache.find(
    channel => channel.id === "790555048311652362"
  );
  const rochelle1 = new Discord.MessageEmbed()
    .setColor("RED")
    .addField(
      `Hoş Geldin Karşim`,
      `• ${member} adlı üye sunucumuza katıldı, <@&785629452486836249> rolünü verdim!\n • Sunucumuz artık \`${member.guild.memberCount}\` üyeye sahip.! `
    );
  rochelle.send(rochelle1);
}); // otorol
 
       

client.on('userUpdate', async user => {
  let sunucuid = "785629452289179669"; //Buraya sunucunuzun IDsini yazın
  let tag = "☥"; //Buraya tagınızı yazın
  let rol = "785808183892639755"; //Buraya tag alındığı zaman verilecek rolün IDsini yazın
  let channel = client.guilds.cache.get(sunucuid).channels.cache.find(x => x.name == 'tag-log'); //tagrol-log yerine kendi log kanalınızın ismini yazabilirsiniz
  if (!tag) return;
  if (!rol) return;
  if (!channel) return;
  let member = client.guilds.cache.get(sunucuid).members.cache.get(user.id);
  if (!member) return;
  if (!member.roles.cache.has(rol)) {
    if (member.user.username.includes(tag)) {
      member.roles.add(rol)
      const tagalma = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setDescription(`<@${user.id}> adlı kişi, ${tag} tagını aldığından dolayı <@&${rol}> rolünü kazandı.`)
      .setTimestamp()
      channel.send(tagalma)
    }
  }else{
    if (!member.user.username.includes(tag)) {
      member.roles.remove("785808183892639755")
      member.roles.remove("785629452515803157")
      member.roles.remove("785629452486836253")
      member.roles.remove("785629452486836251")
      member.roles.remove("785629452486836250")
      member.roles.add("785629452486836249")
      const tagsilme = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setDescription(`<@${user.id}> adlı kişi, ${tag} tagını sildiğinden dolayı <@&${rol}> rolünü kaybetti.`)
      .setTimestamp()
      channel.send(tagsilme)
    }
  }
});

client.on("ready", () => {
  client.channels.cache.get("786989699650027560").join();
   //main dosyaya atılacak
})

////


