import sqlite3 from 'sqlite3';
sqlite3.verbose();

const weight = {
  handtrap: 1,
  tech: 1,
  engine: 2,
  deck: 3,
  subdeck: 0,
}

const db = new sqlite3.Database("./omega.db", (err) => {
  if (err) {
    reject('Erro ao conectar ao banco de dados: ' + err.message);
  }
});

export const sets = [
  { code: 0x1, set: "Ally of Justice" },
  { code: 0x2, set: "Genex" },
  // { code: 0x1002, set: "R-Genex" },
  // { code: 0x2002, set: "Genex Ally" },
  { code: 0x3, set: "Allure Queen" },
  { code: 0x4, set: "Amazoness" },
  { code: 0x5, set: "Arcana Force" },
  { code: 0x6, set: "Dark World" },
  { code: 0x7, set: "Ancient Gear" },
  { code: 0x8, set: "HERO" },
  // { code: 0x3008, set: "Elemental HERO" },
  // { code: 0x6008, set: "Evil HERO" },
  // { code: 0xc008, set: "Destiny HERO" },
  // { code: 0x5008, set: "Vision HERO" },
  // { code: 0xa008, set: "Masked HERO" },
  { code: 0x9, set: "Neos" },
  { code: 0xa, set: "Lswarm" },
  // { code: 0x100a, set: "Steelswarm" },
  { code: 0xb, set: "Infernity" },
  { code: 0xc, set: "Alien" },
  // { code: 0xd, set: "Saber" },
  { code: 0x100d, set: "X-Saber" },
  // { code: 0x300d, set: "XX-Saber" },
  { code: 0x400d, set: "Elementsaber" },
  { code: 0xe, set: "Watt" },
  { code: 0xf, set: "Ojama" },
  { code: 0x10, set: "Gusto" },
  { code: 0x11, set: "Karakuri" },
  { code: 0x12, set: "Frog" },
  { code: 0x13, set: "Meklord" },
  // { code: 0x3013, set: "Meklord Emperor" },
  // { code: 0x5013, set: "Meklord Astro" },
  // { code: 0x6013, set: "Meklord Army" },
  { code: 0x15, set: "B.E.S." },
  // { code: 0x16, set: "Roid" },
  { code: 0x1016, set: "Vehicroid" },
  { code: 0x2016, set: "Speedroid" },
  // { code: 0x17, set: "Synchro" },
  { code: 0x1017, set: "Synchron" },
  // { code: 0x2017, set: "Synchro Dragon" },
  { code: 0x18, set: "Cloudian" },
  // { code: 0x19, set: "Gladiator" },
  { code: 0x1019, set: "Gladiator Beast" },
  { code: 0x1a, set: "Dark Scorpion" },
  // { code: 0x1b, set: "Phantom Beast" },
  { code: 0x101b, set: "Mecha Phantom Beast" },
  { code: 0x1c, set: "Spirit Message" },
  { code: 0x1d, set: "Koa'ki Meiru" },
  { code: 0x1e, set: "Chrysalis" },
  { code: 0x1f, set: "Neo-Spacian" },
  // { code: 0x20, set: "Shien" },
  // { code: 0x21, set: "Earthbound" },
  { code: 0x1021, set: "Earthbound Immortal" },
  { code: 0x22, set: "Jurrac" },
  { code: 0x23, set: "Malefic" },
  { code: 0x24, set: "Scrap" },
  { code: 0x25, set: "Iron Chain" },
  { code: 0x26, set: "Morphtronic" },
  { code: 0x27, set: "T.G." },
  { code: 0x28, set: "Batteryman" },
  { code: 0x29, set: "Dragunity" },
  { code: 0x2a, set: "Naturia" },
  { code: 0x2b, set: "Ninja" },
  // { code: 0x102b, set: "Armor Ninja" },
  { code: 0x2c, set: "Flamvell" },
  { code: 0x2e, set: "Gravekeeper's" },
  { code: 0x2f, set: "Ice Barrier" },
  { code: 0x30, set: "Vylon" },
  { code: 0x31, set: "Fortune Lady" },
  { code: 0x32, set: "Volcanic" },
  { code: 0x33, set: "Blackwing" },
  // { code: 0x1033, set: "Assault Blackwing" },
  // { code: 0x34, set: "Crystal" },
  { code: 0x1034, set: "Crystal Beast" },
  // { code: 0x2034, set: "Ultimate Crystal" },
  // { code: 0x5034, set: "Advanced Crystal Beast" },
  { code: 0x35, set: "Fabled" },
  // { code: 0x1035, set: "The Fabled" },
  { code: 0x36, set: "Machina" },
  { code: 0x37, set: "Mist Valley" },
  { code: 0x38, set: "Lightsworn" },
  { code: 0x39, set: "Laval" },
  { code: 0x3a, set: "Gishki" },
  { code: 0x3b, set: "Red-Eyes" },
  { code: 0x3c, set: "Reptilianne" },
  { code: 0x103d, set: "Six Samurai" },
  // { code: 0x203d, set: "Six Strike" },
  // { code: 0x903d, set: "Secret Six Samurai" },
  { code: 0x3e, set: "Worm" },
  { code: 0x3f, set: "Majestic" },
  { code: 0x40, set: "Forbidden One" },
  { code: 0x41, set: "LV" },
  { code: 0x42, set: "Nordic" },
  // { code: 0x3042, set: "Nordic Ascendant" },
  // { code: 0x6042, set: "Nordic Beast" },
  // { code: 0xa042, set: "Nordic Alfar" },
  // { code: 0x5042, set: "Nordic Relic" },
  { code: 0x43, set: "Junk" },
  { code: 0x44, set: "The Agent" },
  { code: 0x45, set: "Archfiend" },
  { code: 0x1045, set: "Red Dragon Archfiend" },
  // { code: 0x46, set: "Polymerization" },
  // { code: 0x46, set: "Fusion" },
  // { code: 0x1046, set: "Fusion Dragon" },
  // { code: 0x47, set: "Gem-" },
  { code: 0x1047, set: "Gem-Knight" },
  // { code: 0x48, set: "Number" },
  // { code: 0x1048, set: "Number C" },
  // { code: 0x5048, set: "Number C39" },
  { code: 0x49, set: "Skyblaster" },
  { code: 0x4a, set: "Timelord" },
  // { code: 0x4b, set: "Aesir" },
  // { code: 0x4c, set: "Trap Hole" },
  { code: 0x4e, set: "Evol" },
  // { code: 0x304e, set: "Evoltile" },
  // { code: 0x504e, set: "Evolzar" },
  // { code: 0x604e, set: "Evolsaur" },
  { code: 0x4f, set: "Buster" },
  { code: 0x104f, set: "/Assault Mode" },
  // { code: 0x50, set: "Venom" },
  // { code: 0x1050, set: "Starving Venom" },
  { code: 0x51, set: "Gadget" },
  // { code: 0x52, set: "Guardian" },
  { code: 0x1052, set: "Gate Guardian" },
  { code: 0x2052, set: "Skull Guardian" },
  { code: 0x53, set: "Constellar" },
  { code: 0x54, set: "Gagaga" },
  { code: 0x55, set: "Photon" },
  { code: 0x56, set: "Inzektor" },
  { code: 0x57, set: "Resonator" },
  { code: 0x58, set: "Wind-Up" },
  { code: 0x59, set: "Gogogo" },
  { code: 0x5a, set: "Penguin" },
  { code: 0x5b, set: "Inmato" },
  { code: 0x5c, set: "Sphinx" },
  // { code: 0x60, set: "Bamboo Sword" },
  // { code: 0x61, set: "Ninjitsu Art" },
  { code: 0x62, set: "Toon" },
  { code: 0x63, set: "Reactor" },
  { code: 0x64, set: "Harpie" },
  // { code: 0x65, set: "Infestation" },
  // { code: 0x66, set: "Warrior" },
  { code: 0x1066, set: "Symphonic Warrior" },
  { code: 0x2066, set: "Magnet Warrior" },
  { code: 0x67, set: "Iron" },
  { code: 0x68, set: "Tin" },
  { code: 0x69, set: "Hieratic" },
  { code: 0x6a, set: "Butterspy" },
  { code: 0x6b, set: "Bounzer" },
  { code: 0x6c, set: "Lightray" },
  { code: 0x6d, set: "Djinn" },
  { code: 0x306d, set: "Divine Dragon" },
  { code: 0x606d, set: "Djinn of Rituals" },
  { code: 0x6e, set: "Prophecy" },
  { code: 0x106e, set: "Spellbook" },
  { code: 0x6f, set: "Heroic" },
  // { code: 0x106f, set: "Heroic Challenger" },
  { code: 0x70, set: "Chronomaly" },
  { code: 0x71, set: "Madolche" },
  { code: 0x72, set: "Geargia" },
  // { code: 0x1072, set: "Geargiano" },
  // { code: 0x73, set: "Xyz" },
  // { code: 0x1073, set: "CXyz" },
  // { code: 0x2073, set: "Xyz Dragon" },
  // { code: 0x4073, set: "Armored Xyz" },
  { code: 0x74, set: "Mermail" },
  // { code: 0x75, set: "Abyss-" },
  { code: 0x76, set: "Heraldic Beast" },
  { code: 0x77, set: "Atlantean" },
  // { code: 0x78, set: "Nimble" },
  { code: 0x79, set: "Fire Fist" },
  // { code: 0x7a, set: "Noble" },
  { code: 0x107a, set: "Noble Knight" },
  // { code: 0x207a, set: "Noble Arms" },
  { code: 0x507a, set: "Infernoble Knight" },
  // { code: 0x607a, set: "Infernoble Arms" },
  { code: 0x7b, set: "Galaxy" },
  // { code: 0x107b, set: "Galaxy-Eyes" },
  // { code: 0x307b, set: "Galaxy-Eyes Tachyon Dragon" },
  { code: 0x7c, set: "Fire Formation" },
  // { code: 0x7d, set: "Hazy" },
  { code: 0x107d, set: "Hazy Flame" },
  // { code: 0x7e, set: "ZEXAL" },
  // { code: 0x207e, set: "ZS -" },
  // { code: 0x107e, set: "ZW -" },
  // { code: 0x7f, set: "Utopi" },
  { code: 0x107f, set: "Utopia" },
  // { code: 0x207f, set: "Utopic Future" },
  { code: 0x80, set: "Duston" },
  { code: 0x81, set: "Fire King" },
  // { code: 0x1081, set: "Fire King Avatar" },
  { code: 0x82, set: "Dododo" },
  // { code: 0x83, set: "Puppet" },
  { code: 0x1083, set: "Gimmick Puppet" },
  { code: 0x84, set: "Battlin' Box" },
  // { code: 0x1084, set: "Battlin' Boxer" },
  // { code: 0x2084, set: "Battlin' Boxing" },
  // { code: 0x85, set: "Super Defense Robot" },
  { code: 0x86, set: "Star Seraph" },
  { code: 0x87, set: "Umbral Horror" },
  { code: 0x88, set: "Bujin" },
  // { code: 0x89, set: "Hole" },
  // { code: 0x8a, set: "Fascinating" },
  { code: 0x108a, set: "Traptrix" },
  // { code: 0x8b, set: "Malicevorous" },
  { code: 0x8d, set: "Ghostrick" },
  { code: 0x8e, set: "Vampire" },
  { code: 0x8f, set: "Zubaba" },
  { code: 0x90, set: "Sylvan" },
  { code: 0x91, set: "Necrovalley" },
  { code: 0x92, set: "Heraldry" },
  // { code: 0x93, set: "Cyber" },
  { code: 0x1093, set: "Cyber Dragon" },
  { code: 0x2093, set: "Cyber Angel" },
  { code: 0x4093, set: "Cyberdark" },
  // { code: 0x94, set: "Cybernetic" },
  // { code: 0x95, set: "Rank-Up-Magic" },
  // { code: 0x96, set: "Fishborg" },
  { code: 0x97, set: "Artifact" },
  { code: 0x98, set: "Magician" },
  { code: 0x99, set: "Odd-Eyes" },
  { code: 0x9a, set: "Superheavy Samurai" },
  // { code: 0x109a, set: "Superheavy Samurai Soul" },
  { code: 0x9b, set: "Melodious" },
  // { code: 0x109b, set: "Melodious Maestra" },
  { code: 0x9c, set: "tellarknight" },
  // { code: 0x109c, set: "Stellarknight" },
  { code: 0x9d, set: "Shaddoll" },
  { code: 0x9e, set: "Yang Zing" },
  { code: 0x9f, set: "Performapal" },
  { code: 0xa0, set: "Legendary Knight" },
  { code: 0xa1, set: "Legendary Dragon" },
  { code: 0x10a2, set: "Dark Magician" },
  { code: 0x20a2, set: "Magician Girl" },
  // { code: 0x30a2, set: "Dark Magician Girl" },
  { code: 0xa3, set: "Stardust" },
  { code: 0xa4, set: "Kuriboh" },
  // { code: 0x10a4, set: "Winged Kuriboh" },
  // { code: 0xa5, set: "Change" },
  // { code: 0xa6, set: "Sprout" },
  // { code: 0xa7, set: "Artorigus" },
  // { code: 0xa8, set: "Laundsallyn" },
  { code: 0xa9, set: "Fluffal" },
  { code: 0xaa, set: "Qli" },
  // { code: 0x10aa, set: "Apoqliphort" },
  { code: 0xab, set: "Deskbot" },
  // { code: 0xac, set: "Goblin" },
  { code: 0x10ac, set: "Goblin Biker" },
  { code: 0xad, set: "Frightfur" },
  { code: 0xae, set: "Dark Contract" },
  { code: 0xaf, set: "D/D" },
  { code: 0x10af, set: "D/D/D" },
  { code: 0xb0, set: "Gottoms" },
  { code: 0xb1, set: "Burning Abyss" },
  { code: 0xb2, set: "U.A." },
  { code: 0xb3, set: "Yosenju" },
  { code: 0xb4, set: "Nekroz" },
  { code: 0xb5, set: "Ritual Beast" },
  { code: 0x10b5, set: "Ritual Beast Tamer" },
  { code: 0x20b5, set: "Spiritual Beast" },
  { code: 0x40b5, set: "Ritual Beast Ulti" },
  { code: 0xb6, set: "Outer Entity" },
  { code: 0xb7, set: "Elder Entity" },
  { code: 0xb8, set: "Old Entity" },
  { code: 0xb9, set: "Blaze Accelerator" },
  { code: 0xba, set: "Raidraptor" },
  { code: 0xbb, set: "Infernoid" },
  { code: 0xbc, set: "Jinzo" },
  { code: 0xbd, set: "Gaia The Fierce Knight" },
  { code: 0xbe, set: "Monarch" },
  { code: 0xbf, set: "Charmer" },
  { code: 0xc0, set: "Possessed" },
  { code: 0x10c0, set: "Familiar-Possessed" },
  { code: 0xc1, set: "PSY-Frame" },
  { code: 0x10c1, set: "PSY-Framegear" },
  { code: 0xc2, set: "Power Tool" },
  { code: 0xc3, set: "Edge Imp" },
  { code: 0xc4, set: "Zefra" },
  { code: 0xc5, set: "Void" },
  { code: 0xc6, set: "Performage" },
  { code: 0xc7, set: "Dracoslayer" },
  { code: 0xc8, set: "Igknight" },
  { code: 0xc9, set: "Aroma" },
  { code: 0xca, set: "Empowered Warrior" },
  { code: 0xcb, set: "Aether" },
  { code: 0xcc, set: "Prediction Princess" },
  { code: 0xcd, set: "Aquaactress" },
  { code: 0xce, set: "Aquarium" },
  { code: 0xcf, set: "Chaos" },
  { code: 0x10cf, set: "Black Luster Soldier" },
  { code: 0xd0, set: "Majespecter" },
  { code: 0xd1, set: "Graydle" },
  { code: 0xd2, set: "Kozmo" },
  { code: 0xd3, set: "Kaiju" },
  { code: 0xd4, set: "Paleozoic" },
  { code: 0xd5, set: "Dante" },
  { code: 0xd6, set: "Destruction Sword" },
  { code: 0xd7, set: "Buster Blader" },
  { code: 0xd8, set: "Dinomist" },
  { code: 0xd9, set: "Shiranui" },
  { code: 0x10d9, set: "Shiranui Spectralsword" },
  { code: 0xda, set: "Dracoverlord" },
  { code: 0xdb, set: "Phantom Knights" },
  { code: 0x10db, set: "The Phantom Knights" },
  { code: 0xdc, set: "Super Quant" },
  { code: 0x10dc, set: "Super Quantum" },
  { code: 0x20dc, set: "Super Quantal Mech Beast" },
  { code: 0xdd, set: "Blue-Eyes" },
  { code: 0xde, set: "Exodia" },
  { code: 0xdf, set: "Lunalight" },
  { code: 0xe0, set: "Amorphage" },
  { code: 0xe1, set: "Metalfoes" },
  { code: 0xe2, set: "Triamid" },
  { code: 0xe3, set: "Cubic" },
  { code: 0xe4, set: "Celtic Guard" },
  { code: 0xe5, set: "Cipher" },
  { code: 0x10e5, set: "Cipher Dragon" },
  { code: 0xe6, set: "Flower Cardian" },
  { code: 0xe7, set: "Silent Swordsman" },
  { code: 0xe8, set: "Silent Magician" },
  { code: 0xe9, set: "Magna Warrior" },
  { code: 0xea, set: "Crystron" },
  { code: 0xeb, set: "Chemicritter" },
  // { code: 0xec, set: "Abyss" },
  { code: 0x10ec, set: "Abyss Actor" },
  // { code: 0x20ec, set: "Abyss Script" },
  { code: 0xed, set: "Subterror" },
  // { code: 0x10ed, set: "Subterror Behemoth" },
  { code: 0xee, set: "SPYRAL" },
  // { code: 0x10ee, set: "SPYRAL GEAR" },
  // { code: 0x20ee, set: "SPYRAL MISSION" },
  { code: 0xef, set: "Darklord" },
  { code: 0xf0, set: "Windwitch" },
  { code: 0xf1, set: "Zoodiac" },
  // { code: 0xf2, set: "Pendulum" },
  // { code: 0x10f2, set: "Pendulum Dragon" },
  // { code: 0x20f2, set: "Pendulumgraph" },
  { code: 0xf3, set: "Predap" },
  { code: 0x10f3, set: "Predaplant" },
  { code: 0xf4, set: "Invoked" },
  { code: 0xf5, set: "Gandora" },
  { code: 0xf6, set: "Skyscraper" },
  { code: 0xf7, set: "Lyrilusc" },
  { code: 0xf8, set: "Supreme King" },
  { code: 0x10f8, set: "Supreme King Gate" },
  { code: 0x20f8, set: "Supreme King Dragon" },
  { code: 0xf9, set: "True King" },
  { code: 0xf9, set: "True Draco" },
  { code: 0xfa, set: "Phantasm Spiral" },
  { code: 0xfb, set: "Trickstar" },
  { code: 0xfc, set: "Gouki" },
  { code: 0xfd, set: "World Chalice" },
  { code: 0xfe, set: "World Legacy" },
  { code: 0xff, set: "Clear Wing" },
  { code: 0x100, set: "Bonding" },
  // { code: 0x101, set: "code Talker" },
  { code: 0x102, set: "rokket" },
  { code: 0x103, set: "Altergeist" },
  { code: 0x104, set: "Krawler" },
  { code: 0x105, set: "Metaphys" },
  { code: 0x106, set: "Vendread" },
  { code: 0x107, set: "F.A." },
  { code: 0x108, set: "Magical Musket" },
  { code: 0x109, set: "The Weather" },
  { code: 0x10a, set: "Parshath" },
  { code: 0x10b, set: "Tindangle" },
  { code: 0x10c, set: "Mekk-Knight" },
  { code: 0x10d, set: "Mythical Beast" },
  { code: 0x10e, set: "Evolution Pill" },
  { code: 0x10f, set: "Borrel" },
  { code: 0x110, set: "Relinquished" },
  { code: 0x1110, set: "Eyes Restrict" },
  { code: 0x111, set: "Armed Dragon" },
  { code: 0x112, set: "Knightmare" },
  { code: 0x113, set: "Elemental Lord" },
  { code: 0x114, set: "Fur Hire" },
  { code: 0x115, set: "Sky Striker" },
  // { code: 0x1115, set: "Sky Striker Ace" },
  { code: 0x116, set: "Crusadia" },
  { code: 0x117, set: "Impcantation" },
  { code: 0x118, set: "Cynet" },
  { code: 0x119, set: "Salamangreat" },
  { code: 0x11a, set: "Dinowrestler" },
  { code: 0x11b, set: "Orcust" },
  { code: 0x11c, set: "Thunder Dragon" },
  // { code: 0x11d, set: "Forbidden" },
  { code: 0x11e, set: "Danger!" },
  { code: 0x11f, set: "Nephthys" },
  { code: 0x120, set: "Prank-Kids" },
  { code: 0x121, set: "Mayakashi" },
  { code: 0x122, set: "Valkyrie" },
  { code: 0x123, set: "Rose" },
  { code: 0x1123, set: "Rose Dragon" },
  { code: 0x124, set: "Machine Angel" },
  { code: 0x125, set: "Smile" },
  { code: 0x126, set: "Time Thief" },
  { code: 0x127, set: "Infinitrack" },
  { code: 0x128, set: "Witchcrafter" },
  { code: 0x129, set: "Evil Eye" },
  { code: 0x12a, set: "Endymion" },
  { code: 0x12b, set: "Marincess" },
  { code: 0x12c, set: "Tenyi" },
  { code: 0x12d, set: "Simorgh" },
  { code: 0x12e, set: "Fortune Fairy" },
  { code: 0x12f, set: "Battlewasp" },
  { code: 0x130, set: "Unchained" },
  { code: 0x1130, set: "Unchained Soul" },
  { code: 0x131, set: "Dream Mirror" },
  { code: 0x132, set: "Mathmech" },
  { code: 0x133, set: "Dragonmaid" },
  { code: 0x134, set: "Generaider" },
  { code: 0x135, set: "@Ignister" },
  { code: 0x136, set: "A.I." },
  { code: 0x137, set: "Ancient Warriors" },
  { code: 0x138, set: "Megalith" },
  { code: 0x139, set: "Palladium" },
  { code: 0x13a, set: "Onomat" },
  { code: 0x13b, set: "Rebellion" },
  { code: 0x13c, set: "Codebreaker" },
  { code: 0x13d, set: "Nemeses" },
  { code: 0x13e, set: "Barbaros" },
  { code: 0x13f, set: "Plunder Patroll" },
  { code: 0x140, set: "Adamancipator" },
  { code: 0x141, set: "Rikka" },
  { code: 0x142, set: "Eld" },
  { code: 0x1142, set: "Eldlich" },
  { code: 0x2142, set: "Eldlixir" },
  { code: 0x143, set: "Golden Land" },
  { code: 0x144, set: "Phantasm" },
  { code: 0x145, set: "Dogmatika" },
  { code: 0x146, set: "Melffy" },
  { code: 0x147, set: "Potan" },
  { code: 0x148, set: "Roland" },
  { code: 0x149, set: "Fossil" },
  { code: 0x14a, set: "Numeron" },
  { code: 0x114a, set: "Numeron Gate" },
  { code: 0x14b, set: "Appliancer" },
  { code: 0x14c, set: "Spiritual Art" },
  { code: 0x314c, set: "Spiritual Earth Art" },
  { code: 0x514c, set: "Spiritual Water Art" },
  { code: 0x614c, set: "Spiritual Fire Art" },
  { code: 0x914c, set: "Spiritual Wind Art" },
  { code: 0xa14c, set: "Spiritual Light Art" },
  { code: 0xc14c, set: "Dark Spirit Art" },
  { code: 0x14d, set: "Tri-Brigade" },
  { code: 0x14e, set: "Virtual World" },
  { code: 0x114e, set: "Virtual World Gate" },
  { code: 0x14f, set: "Dual Avatar" },
  { code: 0x150, set: "Magistus" },
  { code: 0x151, set: "Twin" },
  { code: 0x1151, set: "Live☆Twin" },
  { code: 0x2151, set: "Evil★Twin" },
  { code: 0x152, set: "Ki-sikil" },
  { code: 0x153, set: "Lil-la" },
  { code: 0x154, set: "Drytron" },
  { code: 0x155, set: "Springans" },
  { code: 0x156, set: "S-Force" },
  { code: 0x157, set: "Myutant" },
  { code: 0x158, set: "サン" },
  { code: 0x1158, set: "Sunvine" },
  { code: 0x2158, set: "Sunavalon" },
  { code: 0x4158, set: "Sunseed" },
  { code: 0x159, set: "Starry Knight" },
  { code: 0x15a, set: "Doll Monster" },
  { code: 0x15b, set: "Amazement" },
  { code: 0x15c, set: "Attraction" },
  { code: 0x15d, set: "Branded" },
  { code: 0x15e, set: "Rank-Down-Magic" },
  { code: 0x15f, set: "War Rock" },
  { code: 0x160, set: "Materiactor" },
  { code: 0x161, set: "Ogdoadic" },
  { code: 0x162, set: "Solfachord" },
  { code: 0x1162, set: "GranSolfachord" },
  { code: 0x163, set: "Ursarctic" },
  { code: 0x164, set: "Despia" },
  { code: 0x165, set: "Magikey" },
  { code: 0x166, set: "Gunkan" },
  { code: 0x1167, set: "Mystical Beast of the Forest" },
  { code: 0x2167, set: "Mystical Spirit of the Forest" },
  { code: 0x168, set: "Stealth Kragen" },
  { code: 0x169, set: "Numerounius" },
  { code: 0x16a, set: "Number" },
  { code: 0x16b, set: "Swordsoul" },
  { code: 0x16c, set: "Icejade" },
  { code: 0x16d, set: "Floowandereeze" },
  { code: 0x16e, set: "Topologic" },
  { code: 0x16f, set: "Hyperion" },
  { code: 0x170, set: "Beetrooper" },
  { code: 0x171, set: "P.U.N.K." },
  { code: 0x172, set: "Exosister" },
  { code: 0x173, set: "Dinomorphia" },
  { code: 0x174, set: "Lady of Lament" },
  { code: 0x175, set: "Seventh" },
  { code: 0x176, set: "Barian's" },
  { code: 0x177, set: "Kairyu-Shin" },
  { code: 0x178, set: "Sea Stealth" },
  { code: 0x179, set: "Therion" },
  { code: 0x17a, set: "Scareclaw" },
  { code: 0x17b, set: "Battleguard" },
  { code: 0x17c, set: "Libromancer" },
  { code: 0x17d, set: "Vaylantz" },
  { code: 0x17e, set: "Labrynth" },
  { code: 0x117e, set: "Welcome Labrynth" },
  { code: 0x17f, set: "Runick" },
  { code: 0x180, set: "Spright" },
  { code: 0x181, set: "Tearlaments" },
  { code: 0x182, set: "Vernusylph" },
  { code: 0x183, set: "Mokey Mokey" },
  { code: 0x184, set: "Wingman" },
  { code: 0x185, set: "Doodle" },
  { code: 0x1185, set: "Doodle Beast" },
  { code: 0x2185, set: "Doodlebook" },
  { code: 0x186, set: "G Golem" },
  { code: 0x187, set: "Rainbow Bridge" },
  { code: 0x188, set: "Bystial" },
  { code: 0x189, set: "Kashtira" },
  { code: 0x18a, set: "Ghoti" },
  { code: 0x18b, set: "Rescue-ACE" },
  { code: 0x18c, set: "Purrely" },
  { code: 0x18d, set: "Mikanko" },
  { code: 0x18e, set: "Aquamirror" },
  { code: 0x18f, set: "Firewall" },
  { code: 0x190, set: "Mannadium" },
  { code: 0x191, set: "Nemleria" },
  { code: 0x192, set: "Gold Pride" },
  { code: 0x193, set: "Labyrinth Wall" },
  { code: 0x194, set: "Favorite" },
  { code: 0x195, set: "Vanquish Soul" },
  { code: 0x196, set: "Nouvelles" },
  { code: 0x197, set: "Recipe" },
  { code: 0x198, set: "Visas" },
  { code: 0x199, set: "Counter" },
  { code: 0x19a, set: "Veda" },
  { code: 0x19b, set: "Diabell" },
  { code: 0x119b, set: "Diabellstar" },
  { code: 0x19c, set: "Snake-Eye" },
  { code: 0x19d, set: "Horus" },
  { code: 0x119d, set: "Horus the Black Flame Dragon" },
  { code: 0x19e, set: "Sinful Spoils" },
  { code: 0x19f, set: "Patissciel" },
  { code: 0x1a0, set: "Heart" },
  { code: 0x1a1, set: "Memento" },
  { code: 0x1a2, set: "Centur-Ion" },
  { code: 0x1a3, set: "Vaalmonica" },
  { code: 0x1a4, set: "Tistina" },
  { code: 0x1a5, set: "Yubel" },
  { code: 0x1a6, set: "Voiceless Voice" },
  { code: 0x1a7, set: "White Aura" },
  { code: 0x1a8, set: "Toy" },
  { code: 0x1a9, set: "Sangen" },
  { code: 0x1aa, set: "Tenpai Dragon" },
  { code: 0x1ab, set: "Ragnaraika" },
  { code: 0x1ac, set: "Salamandra" },
  { code: 0x1ad, set: "Ashened" },
  { code: 0x1ae, set: "Millennium" },
  { code: 0x1af, set: "Exodd" },
  { code: 0x1b0, set: "Fiendsmith" },
  { code: 0x1b1, set: "White Forest" },
  { code: 0x1b2, set: "Mulcharmy" },
  { code: 0x1b3, set: "Emblema" },
  { code: 0x1b4, set: "Tachyon" },
  { code: 0x1b5, set: "Blue Tears" },
  { code: 0x1b6, set: "Wedju" },
  { code: 0x1b7, set: "Mimighoul" },
  { code: 0x1b8, set: "Shark" },
  { code: 0x11b8, set: "Shark Drake" },
  { code: 0x1b9, set: "Primite" },
  { code: 0x1ba, set: "Metalmorph" },
  { code: 0x1bb, set: "Morganite" },
  { code: 0x1bc, set: "Azamina" },
  { code: 0x1bd, set: "Schoolwork" },
  { code: 0x1be, set: "Ryzeal" },
  { code: 0x1bf, set: "Maliss" },
  { code: 0x1c0, set: "Ryu-Ge" },
  { code: 0x1c1, set: "Argostars" },
  { code: 0x1c2, set: "Aqua Jet" },
  { code: 0x2c3, set: "Dragon Ruler" },
  { code: 0x2c4, set: "Mitsurugi" },
  { code: 0x2c5, set: "Regenesis" },
  { code: 0x2c6, set: "Dominus" },
]

const countOccurrences = (array) => {
  const countMap = array.reduce((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(countMap).map(([id, qtd]) => ({ id: parseInt(id), qtd }));
};


export const getDataOmega = async (passwords) => {
  const sql = `SELECT x.id, x.alias, t.name, x.setcode FROM datas x JOIN texts t ON (t.id = x.id OR t.id = x.alias) WHERE x.id IN (${passwords.join(',')})`;

  const data = await (new Promise((resolve, reject) => {
    db.all(sql, [], (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  }));
  
  const sanitizedPasswords = passwords.map(id => data.find(c => c.id ===id)?.alias || id)
  return {
    passwords: sanitizedPasswords,
    deck: countOccurrences(sanitizedPasswords),
    data
  }
}

export const decodeDeck = async (passwords) => {
  const { data } = await getDataOmega(passwords)
  const blobMap = passwords.map(c => data.find(({ id }) => id === c) ? data.find(({ id }) => id === c).setcode : 0)
  const setMap = blobMap.map(blob => {
    if (!blob) return 0;
    const reversedBlob = [...blob].reverse();
    const numbers = [];
    for (let i = 0; i < reversedBlob.length; i += 2) {
      const c = (reversedBlob[i] << 8) | (reversedBlob[i + 1] || 0)
      const set = sets.find(s => s.code === c)
      numbers.push(set);
    }

    return numbers
  })
  return setMap.flat().filter(Boolean)
};

export const archetypeLib = [
  {
    "archetype": "Ally of Justice",
    "ids": [
      26593852,
      8233522,
      9888196
    ]
  },
  {
    "archetype": "Genex",
    "ids": [
      64034255,
      4904812,
      68505803
    ]
  },
  {
    "archetype": "Allure Queen",
    "ids": [
      87257460,
      50140163,
      23756165
    ]
  },
  {
    "archetype": "Amazoness",
    "ids": [
      91869203,
      94004268,
      47480070
    ]
  },
  {
    "archetype": "Arcana Force",
    "ids": [
      62892347,
      23846921,
      69831560
    ]
  },
  {
    "archetype": "Dark World",
    "ids": [
      74117290,
      34230233,
      79126789
    ]
  },
  {
    "archetype": "Ancient Gear",
    "ids": [
      83104731,
      17663375,
      60953949
    ]
  },
  {
    "archetype": "HERO",
    "ids": [
      50720316,
      86165817,
      9411399,
    ]
  },
  {
    "archetype": "Elemental HERO",
    "ids": [
      50720316,
      40044918,
      213326
    ]
  },
  {
    "archetype": "Evil HERO",
    "ids": [
      86165817,
      13650422,
      50304345
    ]
  },
  {
    "archetype": "Destiny HERO",
    "ids": [
      9411399,
      52947044,
      60461804
    ]
  },
  {
    "archetype": "Vision HERO",
    "ids": [
      27780618,
      18094166,
      22865492
    ]
  },
  {
    "archetype": "Masked HERO",
    "ids": [
      58481572,
      21143940,
      29095552
    ]
  },
  {
    "archetype": "Neos",
    "ids": [
      31817415
    ]
  },
  {
    "archetype": "Lswarm",
    "ids": [
      46772449,
      359563,
      38273745
    ]
  },
  {
    "archetype": "Steelswarm",
    "ids": [
      37926346,
      79785958,
      61888819
    ]
  },
  {
    "archetype": "Infernity",
    "ids": [
      56209279,
      9059700,
      86197239
    ]
  },
  {
    "archetype": "Alien",
    "ids": [
      34541863,
      91231901,
      64163367
    ]
  },
  {
    "archetype": "Saber",
    "ids": [
      32164201,
      3743515
    ]
  },
  {
    "archetype": "X-Saber",
    "ids": [
      80108118,
      90508760,
      52352005
    ]
  },
  {
    "archetype": "Elementsaber",
    "ids": [
      71797713,
      61557074,
      45702014
    ]
  },
  {
    "archetype": "Watt",
    "ids": [
      402568,
      88205593,
      87151205
    ]
  },
  {
    "archetype": "Ojama",
    "ids": [
      29843091,
      90140980,
      24643836
    ]
  },
  {
    "archetype": "Gusto",
    "ids": [
      581014,
      2766877,
      71175527
    ]
  },
  {
    "archetype": "Karakuri",
    "ids": [
      66976526,
      30230789,
      25904894
    ]
  },
  {
    "archetype": "Frog",
    "ids": [
      90809975,
      9126351,
      1357146
    ]
  },
  {
    "archetype": "Meklord",
    "ids": [
      68140974,
      63468625,
      4837861
    ]
  },
  {
    "archetype": "B.E.S.",
    "ids": [
      66947414,
      84257883,
      22790789
    ]
  },
  {
    "archetype": "Roid",
    "ids": [
      81275020,
      53932291,
      43385557
    ]
  },
  {
    "archetype": "Speedroid",
    "ids": [
      96708940,
      96945958,
      86154370
    ]
  },
  {
    "archetype": "Synchro",
    "ids": [
      99243014,
      97682931,
      88901994
    ]
  },
  {
    "archetype": "Synchron",
    "ids": [
      50091196,
      20932152,
      37675907
    ]
  },
  {
    "archetype": "Cloudian",
    "ids": [
      16197610,
      80825553,
      13474291
    ]
  },
  {
    "archetype": "Gladiator",
    "ids": [
      26582143,
      48958757,
      72246674
    ]
  },
  {
    "archetype": "Gladiator Beast",
    "ids": [
      41470137,
      35224440,
      92373006
    ]
  },
  {
    "archetype": "Dark Scorpion",
    "ids": [
      76922029,
      6967870,
      40933924
    ]
  },
  {
    "archetype": "Phantom Beast",
    "ids": [
      904186
    ]
  },
  {
    "archetype": "Mecha Phantom Beast",
    "ids": [
      22110647,
      72291078,
      44097050
    ]
  },
  {
    "archetype": "Spirit Message",
    "ids": [
      16625614,
      94212438,
      14386013
    ]
  },
  {
    "archetype": "Koa'ki Meiru",
    "ids": [
      45041488,
      12435193,
      80839052
    ]
  },
  {
    "archetype": "Chrysalis",
    "ids": [
      42682609,
      16616620,
      43751755
    ]
  },
  {
    "archetype": "Neo-Spacian",
    "ids": [
      17955766,
      80344569,
      43237273
    ]
  },
  {
    "archetype": "Earthbound",
    "ids": [
      72323266,
      67105242,
      10875327
    ]
  },
  {
    "archetype": "Jurrac",
    "ids": [
      80727721,
      17948378,
      17548456
    ]
  },
  {
    "archetype": "Malefic",
    "ids": [
      1710476,
      36521459,
      598988
    ]
  },
  {
    "archetype": "Scrap",
    "ids": [
      4334811,
      80529459,
      82012319
    ]
  },
  {
    "archetype": "Iron Chain",
    "ids": [
      19974580,
      80769747,
      53152590
    ]
  },
  {
    "archetype": "Morphtronic",
    "ids": [
      93542102,
      10591919,
      57108202
    ]
  },
  {
    "archetype": "T.G.",
    "ids": [
      90953320,
      98558751,
      293542
    ]
  },
  {
    "archetype": "Batteryman",
    "ids": [
      44586426,
      60549248,
      61181383
    ]
  },
  {
    "archetype": "Dragunity",
    "ids": [
      62265044,
      11969228,
      59755122
    ]
  },
  {
    "archetype": "Naturia",
    "ids": [
      33198837,
      2956282,
      99916754
    ]
  },
  {
    "archetype": "Ninja",
    "ids": [
      9076207,
      4041838,
      95027497
    ]
  },
  {
    "archetype": "Flamvell",
    "ids": [
      21615956,
      23297235,
      53714009
    ]
  },
  {
    "archetype": "Gravekeeper's",
    "ids": [
      47355498,
      24317029,
      16762927
    ]
  },
  {
    "archetype": "Ice Barrier",
    "ids": [
      52687916,
      50321796,
      70980824
    ]
  },
  {
    "archetype": "Vylon",
    "ids": [
      41431329,
      74064212,
      75886890
    ]
  },
  {
    "archetype": "Fortune Lady",
    "ids": [
      34471458,
      70252926,
      57869175
    ]
  },
  {
    "archetype": "Volcanic",
    "ids": [
      69750546,
      33365932,
      76459806
    ]
  },
  {
    "archetype": "Blackwing",
    "ids": [
      14785765,
      2009101,
      49003716
    ]
  },
  {
    "archetype": "Crystal",
    "ids": [
      12877076,
      84544192,
      11155484
    ]
  },
  {
    "archetype": "Crystal Beast",
    "ids": [
      79856792,
      36795102,
      7093411
    ]
  },
  {
    "archetype": "Advanced Crystal Beast",
    "ids": [
      71620241,
      83575471,
      45236142
    ]
  },
  {
    "archetype": "Fabled",
    "ids": [
      97651498,
      82888408,
      47217354
    ]
  },
  {
    "archetype": "Machina",
    "ids": [
      5556499,
      87074380,
      42940404
    ]
  },
  {
    "archetype": "Mist Valley",
    "ids": [
      29587993,
      69448290,
      15854426
    ]
  },
  {
    "archetype": "Lightsworn",
    "ids": [
      77558536,
      94886282,
      58996430
    ]
  },
  {
    "archetype": "Laval",
    "ids": [
      34086406,
      3989465,
      31632536
    ]
  },
  {
    "archetype": "Gishki",
    "ids": [
      29888389,
      47106439,
      46159582
    ]
  },
  {
    "archetype": "Red-Eyes",
    "ids": [
      37818794,
      88264978,
      6172122
    ]
  },
  {
    "archetype": "Reptilianne",
    "ids": [
      8602351,
      57647597,
      89594399
    ]
  },
  {
    "archetype": "Six Samurai",
    "ids": [
      49721904,
      2511717,
      83039729
    ]
  },
  {
    "archetype": "Six Strike",
    "ids": [
      28273805,
      90939874
    ]
  },
  {
    "archetype": "Secret Six Samurai",
    "ids": [
      6579928,
      71207871,
      44686185
    ]
  },
  {
    "archetype": "Worm",
    "ids": [
      81843628,
      2694423,
      73216412
    ]
  },
  {
    "archetype": "Majestic",
    "ids": [
      40939228,
      7841112,
      291414
    ]
  },
  {
    "archetype": "Nordic",
    "ids": [
      27024795,
      15394083,
      90207654
    ]
  },
  {
    "archetype": "Junk",
    "ids": [
      9742784,
      63977008,
      56410040
    ]
  },
  {
    "archetype": "The Agent",
    "ids": [
      64734921,
      56433456,
      91188343
    ]
  },
  {
    "archetype": "Archfiend",
    "ids": [
      9753964,
      80666118,
      62242678
    ]
  },
  {
    "archetype": "Polymerization",
    "ids": [
      61070601,
      29062925,
      33099732
    ]
  },
  {
    "archetype": "Fusion",
    "ids": [
      43331750,
      66518509,
      7473735
    ]
  },
  {
    "archetype": "Gem-",
    "ids": [
      7394770,
      3113836,
      91731841
    ]
  },
  {
    "archetype": "Number",
    "ids": [
      95134948,
      68679595,
      75402014
    ]
  },
  {
    "archetype": "Skyblaster",
    "ids": [
      12958920
    ]
  },
  {
    "archetype": "Timelord",
    "ids": [
      7733560,
      27107590,
      33015627
    ]
  },
  {
    "archetype": "Aesir",
    "ids": [
      93483212,
      30604579,
      67098114
    ]
  },
  {
    "archetype": "Trap Hole",
    "ids": [
      75294187,
      89569453
    ]
  },
  {
    "archetype": "Evol",
    "ids": [
      35103106,
      15171722,
      89776023
    ]
  },
  {
    "archetype": "Evoltile",
    "ids": [
      13046291,
      34026662,
      8632967
    ]
  },
  {
    "archetype": "Evolzar",
    "ids": [
      42752141,
      74294676,
      18511599
    ]
  },
  {
    "archetype": "Evolsaur",
    "ids": [
      74100225,
      54266211,
      17045014
    ]
  },
  {
    "archetype": "Venom",
    "ids": [
      41209827,
      8062132,
      72677437
    ]
  },
  {
    "archetype": "Gadget",
    "ids": [
      645087,
      55010259,
      40216089
    ]
  },
  {
    "archetype": "Guardian",
    "ids": [
      11321089,
      1118137,
      7391448
    ]
  },
  {
    "archetype": "Gate Guardian",
    "ids": [
      25833572,
      8505920,
      61398234
    ]
  },
  {
    "archetype": "Constellar",
    "ids": [
      73964868,
      38495396,
      26329679
    ]
  },
  {
    "archetype": "Gagaga",
    "ids": [
      12014404,
      23720856,
      86331741
    ]
  },
  {
    "archetype": "Photon",
    "ids": [
      65367484,
      17418744,
      89132148
    ]
  },
  {
    "archetype": "Inzektor",
    "ids": [
      97273514,
      68184115,
      21790410
    ]
  },
  {
    "archetype": "Resonator",
    "ids": [
      40975574,
      23008320,
      66141736
    ]
  },
  {
    "archetype": "Wind-Up",
    "ids": [
      78156759,
      77334267,
      68597372
    ]
  },
  {
    "archetype": "Gogogo",
    "ids": [
      39695323,
      19667590,
      62476815
    ]
  },
  {
    "archetype": "Penguin",
    "ids": [
      93920745,
      36039163,
      81306586
    ]
  },
  {
    "archetype": "Sphinx",
    "ids": [
      40659562,
      18654201,
      82260502
    ]
  },
  {
    "archetype": "Bamboo Sword",
    "ids": [
      74029853,
      42199039,
      41587307
    ]
  },
  {
    "archetype": "Ninjitsu Art",
    "ids": [
      16272453,
      95545183,
      68038375
    ]
  },
  {
    "archetype": "Toon",
    "ids": [
      89997728,
      83629030,
      43175858
    ]
  },
  {
    "archetype": "Harpie",
    "ids": [
      18144506,
      87639778,
      90219263
    ]
  },
  {
    "archetype": "Infestation",
    "ids": [
      27541267,
      35419032,
      90934570
    ]
  },
  {
    "archetype": "Symphonic Warrior",
    "ids": [
      12525049,
      5399521,
      24070330
    ]
  },
  {
    "archetype": "Magnet Warrior",
    "ids": [
      75347539,
      99785935,
      39256679
    ]
  },
  {
    "archetype": "Hieratic",
    "ids": [
      24361622,
      64332231,
      27337596
    ]
  },
  {
    "archetype": "Butterspy",
    "ids": [
      54582424,
      79972330,
      75797046
    ]
  },
  {
    "archetype": "Bounzer",
    "ids": [
      92661479,
      70194827,
      44790889
    ]
  },
  {
    "archetype": "Djinn",
    "ids": [
      3790062,
      90726340,
      25341652
    ]
  },
  {
    "archetype": "Divine Dragon",
    "ids": [
      32975247
    ]
  },
  {
    "archetype": "Prophecy",
    "ids": [
      39767432,
      36821538
    ]
  },
  {
    "archetype": "Spellbook",
    "ids": [
      23314220,
      14824019,
      89739383
    ]
  },
  {
    "archetype": "Heroic",
    "ids": [
      63504681,
      60645181,
      1833916
    ]
  },
  {
    "archetype": "Chronomaly",
    "ids": [
      39139935,
      9161357,
      93730230
    ]
  },
  {
    "archetype": "Madolche",
    "ids": [
      77848740,
      34680482,
      37164373
    ]
  },
  {
    "archetype": "Geargia",
    "ids": [
      28912357,
      47030842,
      71786742
    ]
  },
  {
    "archetype": "Xyz",
    "ids": [
      20145685,
      39733924,
      94151981
    ]
  },
  {
    "archetype": "CXyz",
    "ids": [
      47660516,
      3685372,
      67926903
    ]
  },
  {
    "archetype": "Mermail",
    "ids": [
      22446869,
      21954587,
      58471134
    ]
  },
  {
    "archetype": "Abyss-",
    "ids": [
      61496006,
      17080584,
      60517697
    ]
  },
  {
    "archetype": "Atlantean",
    "ids": [
      21565445,
      74311226,
      56649609
    ]
  },
  {
    "archetype": "Nimble",
    "ids": [
      68353324,
      22567609,
      88686573
    ]
  },
  {
    "archetype": "Fire Fist",
    "ids": [
      96381979,
      74168099,
      6353603
    ]
  },
  {
    "archetype": "Noble Knight",
    "ids": [
      59934749,
      37478723,
      56824871
    ]
  },
  {
    "archetype": "Noble Arms",
    "ids": [
      25807544,
      36320744,
      15635751
    ]
  },
  {
    "archetype": "Infernoble Knight",
    "ids": [
      53404966,
      89809665,
      91479482
    ]
  },
  {
    "archetype": "Infernoble Arms",
    "ids": [
      98319530
    ]
  },
  {
    "archetype": "Galaxy",
    "ids": [
      897409,
      85747929,
      863795
    ]
  },
  {
    "archetype": "Galaxy-Eyes",
    "ids": [
      39030163,
      8165596,
      88177324
    ]
  },
  {
    "archetype": "Fire Formation",
    "ids": [
      57103969,
      10719350,
      93754402
    ]
  },
  {
    "archetype": "Hazy",
    "ids": [
      74010769,
      23776077,
      38525760
    ]
  },
  {
    "archetype": "Zexal",
    "ids": [
      4647954,
      68258355,
      62623659
    ]
  },
  {
    "archetype": "Utopia",
    "ids": [
      84013238,
      56832966,
      26973555
    ]
  },
  {
    "archetype": "Duston",
    "ids": [
      95403418,
      40343749,
      24845628
    ]
  },
  {
    "archetype": "Fire King",
    "ids": [
      2526224,
      18621798,
      66431519
    ]
  },
  {
    "archetype": "Dododo",
    "ids": [
      6595475,
      59724555,
      26493435
    ]
  },
  {
    "archetype": "Puppet",
    "ids": [
      36400569,
      15001619,
      89839552
    ]
  },
  {
    "archetype": "Gimmick Puppet",
    "ids": [
      55204071,
      88120966,
      75433814
    ]
  },
  {
    "archetype": "Battlin' Boxer",
    "ids": [
      59627393,
      46804536,
      23232295
    ]
  },
  {
    "archetype": "Battlin' Boxing",
    "ids": [
      19688343,
      19544412
    ]
  },
  {
    "archetype": "Super Defense Robot",
    "ids": [
      77799846,
      45496268,
      8091563
    ]
  },
  {
    "archetype": "Star Seraph",
    "ids": [
      49678559,
      38331564,
      91110378
    ]
  },
  {
    "archetype": "Umbral Horror",
    "ids": [
      49456901,
      59708927,
      7152333
    ]
  },
  {
    "archetype": "Bujin",
    "ids": [
      71095768,
      73289035,
      68618157
    ]
  },
  {
    "archetype": "Hole",
    "ids": [
      29401950,
      53129443,
      31548215
    ]
  },
  {
    "archetype": "Traptrix",
    "ids": [
      91812341,
      6511113,
      45803070
    ]
  },
  {
    "archetype": "Malicevorous",
    "ids": [
      61791132,
      98780137,
      35307484
    ]
  },
  {
    "archetype": "Ghostrick",
    "ids": [
      53334641,
      75367227,
      46895036
    ]
  },
  {
    "archetype": "Vampire",
    "ids": [
      37129797,
      6039967,
      73082255
    ]
  },
  {
    "archetype": "Sylvan",
    "ids": [
      33909817,
      10406322,
      21903613
    ]
  },
  {
    "archetype": "Heraldry",
    "ids": [
      2407234,
      11522979,
      37241623
    ]
  },
  {
    "archetype": "Cyber",
    "ids": [
      92422871,
      32768230,
      79875526
    ]
  },
  {
    "archetype": "Cyber Dragon",
    "ids": [
      10443957,
      60600126,
      58069384
    ]
  },
  {
    "archetype": "Cyber Angel",
    "ids": [
      77235086,
      99427357,
      3629090
    ]
  },
  {
    "archetype": "Cyberdark",
    "ids": [
      82562802,
      5370235,
      64753988
    ]
  },
  {
    "archetype": "Rank-Up-Magic",
    "ids": [
      67517351,
      36224040,
      32044231
    ]
  },
  {
    "archetype": "Fishborg",
    "ids": [
      66853752,
      93369354,
      57420265
    ]
  },
  {
    "archetype": "Artifact",
    "ids": [
      34267821,
      20292186,
      12444060
    ]
  },
  {
    "archetype": "Magician",
    "ids": [
      12289247,
      73941492,
      37469904
    ]
  },
  {
    "archetype": "Odd-Eyes",
    "ids": [
      53262004,
      16691074,
      80696379
    ]
  },
  {
    "archetype": "Superheavy Samurai",
    "ids": [
      82112494,
      83334932,
      19510093
    ]
  },
  {
    "archetype": "Melodious",
    "ids": [
      44256816,
      9113513,
      64881644
    ]
  },
  {
    "archetype": "Tellarknight",
    "ids": [
      1050186,
      2273734,
      75878039
    ]
  },
  {
    "archetype": "Stellarknight",
    "ids": [
      9272381,
      56638325,
      18326736
    ]
  },
  {
    "archetype": "Shaddoll",
    "ids": [
      94977269,
      3717252,
      44394295
    ]
  },
  {
    "archetype": "Yang Zing",
    "ids": [
      83755611,
      43202238,
      19048328
    ]
  },
  {
    "archetype": "Performapal",
    "ids": [
      11481610,
      58092907,
      47075569
    ]
  },
  {
    "archetype": "Legendary Knight",
    "ids": [
      3078380,
      11082056,
      46232525
    ]
  },
  {
    "archetype": "Dark Magician",
    "ids": [
      46986421,
      97631303,
      30603688
    ]
  },
  {
    "archetype": "Magician Girl",
    "ids": [
      7198399,
      20747792,
      34318086
    ]
  },
  {
    "archetype": "Stardust",
    "ids": [
      44508094,
      64880894,
      30983281
    ]
  },
  {
    "archetype": "Kuriboh",
    "ids": [
      41999284,
      40640057,
      24842059
    ]
  },
  {
    "archetype": "Fluffal",
    "ids": [
      39246582,
      3841833,
      13241004
    ]
  },
  {
    "archetype": "Qli",
    "ids": [
      22423493,
      65518099,
      51194046
    ]
  },
  {
    "archetype": "Apoqliphort",
    "ids": [
      27279764,
      40061558,
      20447641
    ]
  },
  {
    "archetype": "Deskbot",
    "ids": [
      94693857,
      75944053,
      59368956
    ]
  },
  {
    "archetype": "Goblin",
    "ids": [
      24079759,
      34001672,
      17943271
    ]
  },
  {
    "archetype": "Frightfur",
    "ids": [
      6077601,
      78778375,
      58468105
    ]
  },
  {
    "archetype": "Dark Contract",
    "ids": [
      33814281,
      46259438
    ]
  },
  {
    "archetype": "D/D",
    "ids": [
      79559912,
      46372010,
      74069667
    ]
  },
  {
    "archetype": "Burning Abyss",
    "ids": [
      27552504,
      58699500,
      83531441
    ]
  },
  {
    "archetype": "U.A.",
    "ids": [
      43658697,
      12931061,
      71279983
    ]
  },
  {
    "archetype": "Yosenju",
    "ids": [
      65247798,
      92246806,
      28630501
    ]
  },
  {
    "archetype": "Nekroz",
    "ids": [
      26674724,
      89463537,
      52068432
    ]
  },
  {
    "archetype": "Ritual Beast",
    "ids": [
      14513016,
      49885567,
      88123329
    ]
  },
  {
    "archetype": "Blaze Accelerator",
    "ids": [
      4059313,
      52198054,
      69537999
    ]
  },
  {
    "archetype": "Raidraptor",
    "ids": [
      86221741,
      73347079,
      36429703
    ]
  },
  {
    "archetype": "Infernoid",
    "ids": [
      58446973,
      14799437,
      23440231
    ]
  },
  {
    "archetype": "Jinzo",
    "ids": [
      77585513,
      32809211,
      51916032
    ]
  },
  {
    "archetype": "Gaia The Fierce Knight",
    "ids": [
      66889139,
      91949988,
      97204936
    ]
  },
  {
    "archetype": "Monarch",
    "ids": [
      79844764,
      59463312,
      95457011
    ]
  },
  {
    "archetype": "Charmer",
    "ids": [
      8264361,
      48815792,
      9839945
    ]
  },
  {
    "archetype": "Possessed",
    "ids": [
      65268179,
      65046521,
      92652813
    ]
  },
  {
    "archetype": "PSY-Frame",
    "ids": [
      38814750,
      74586817,
      49036338
    ]
  },
  {
    "archetype": "Power Tool",
    "ids": [
      1686814,
      2403771,
      25165047
    ]
  },
  {
    "archetype": "Edge Imp",
    "ids": [
      34773082,
      61173621,
      30068120
    ]
  },
  {
    "archetype": "Zefra",
    "ids": [
      85216896,
      29432356,
      32354768
    ]
  },
  {
    "archetype": "Void",
    "ids": [
      7337976,
      60830240,
      19828680
    ]
  },
  {
    "archetype": "Performage",
    "ids": [
      67696066,
      31292357,
      68819554
    ]
  },
  {
    "archetype": "Dracoslayer",
    "ids": [
      18239909,
      92746535,
      75195825
    ]
  },
  {
    "archetype": "Igknight",
    "ids": [
      76751255,
      96802306,
      97024987
    ]
  },
  {
    "archetype": "Aroma",
    "ids": [
      21200905,
      21452275,
      96789758
    ]
  },
  {
    "archetype": "Empowered Warrior",
    "ids": [
      65472618,
      92870717,
      56681873
    ]
  },
  {
    "archetype": "Aether",
    "ids": [
      54250060,
      56804361
    ]
  },
  {
    "archetype": "Prediction Princess",
    "ids": [
      94997874,
      32231618,
      30392583
    ]
  },
  {
    "archetype": "Aquaactress",
    "ids": [
      29047353,
      65446452,
      39260991
    ]
  },
  {
    "archetype": "Chaos",
    "ids": [
      22850702,
      99266988,
      3040496
    ]
  },
  {
    "archetype": "Black Luster Soldier",
    "ids": [
      49202162,
      72989439,
      54484652
    ]
  },
  {
    "archetype": "Majespecter",
    "ids": [
      31991800,
      68395509,
      94784213
    ]
  },
  {
    "archetype": "Graydle",
    "ids": [
      29834183,
      66451379,
      52145422
    ]
  },
  {
    "archetype": "Kozmo",
    "ids": [
      55885348,
      64280356,
      67237709
    ]
  },
  {
    "archetype": "Kaiju",
    "ids": [
      55063751,
      63941210,
      28674152
    ]
  },
  {
    "archetype": "Paleozoic",
    "ids": [
      38761908,
      98414735,
      35035481
    ]
  },
  {
    "archetype": "Destruction Sword",
    "ids": [
      76218313,
      49823708,
      33280639
    ]
  },
  {
    "archetype": "Dinomist",
    "ids": [
      77116346,
      5067884,
      368382
    ]
  },
  {
    "archetype": "Shiranui",
    "ids": [
      94801854,
      4333086,
      83283063
    ]
  },
  {
    "archetype": "Dracoverlord",
    "ids": [
      98287529,
      7127502
    ]
  },
  {
    "archetype": "Phantom Knights",
    "ids": [
      98827725,
      62709239,
      36426778
    ]
  },
  {
    "archetype": "Super Quant",
    "ids": [
      59975920,
      84025439,
      85252081
    ]
  },
  {
    "archetype": "Blue-Eyes",
    "ids": [
      89631146,
      38517737,
      8240199
    ]
  },
  {
    "archetype": "Exodia",
    "ids": [
      33396948,
      7902349,
      8124921
    ]
  },
  {
    "archetype": "Lunalight",
    "ids": [
      35618217,
      83190280,
      48444114
    ]
  },
  {
    "archetype": "Amorphage",
    "ids": [
      69072185,
      32687071,
      70917315
    ]
  },
  {
    "archetype": "Metalfoes",
    "ids": [
      24094258,
      73594093,
      69351984
    ]
  },
  {
    "archetype": "Triamid",
    "ids": [
      68406755,
      95923441,
      32912040
    ]
  },
  {
    "archetype": "Cubic",
    "ids": [
      15610297,
      30270176,
      20137754
    ]
  },
  {
    "archetype": "Celtic Guard",
    "ids": [
      91152256,
      52077741,
      45531624
    ]
  },
  {
    "archetype": "Cipher",
    "ids": [
      18963306,
      2530830,
      12632096
    ]
  },
  {
    "archetype": "Flower Cardian",
    "ids": [
      87460579,
      5489987,
      42291297
    ]
  },
  {
    "archetype": "Silent Swordsman",
    "ids": [
      15180041,
      74388798,
      37267041
    ]
  },
  {
    "archetype": "Silent Magician",
    "ids": [
      41175645,
      72443568,
      73665146
    ]
  },
  {
    "archetype": "Crystron",
    "ids": [
      50588353,
      39964797,
      13455674
    ]
  },
  {
    "archetype": "Chemicritter",
    "ids": [
      80476891,
      44088292,
      38026562
    ]
  },
  {
    "archetype": "Abyss Actor",
    "ids": [
      44179224,
      78310590,
      25629622
    ]
  },
  {
    "archetype": "Abyss Script",
    "ids": [
      33503878
    ]
  },
  {
    "archetype": "Subterror",
    "ids": [
      16428514,
      74762582,
      5697558
    ]
  },
  {
    "archetype": "SPYRAL",
    "ids": [
      41091257,
      1322368,
      91258852
    ]
  },
  {
    "archetype": "Darklord",
    "ids": [
      52840267,
      87112784,
      4167084
    ]
  },
  {
    "archetype": "Windwitch",
    "ids": [
      43722862,
      71007216,
      70117860
    ]
  },
  {
    "archetype": "Zoodiac",
    "ids": [
      41375811,
      77150143,
      74393852
    ]
  },
  {
    "archetype": "Pendulum",
    "ids": [
      22125101,
      92812851,
      69512157
    ]
  },
  {
    "archetype": "Pendulum Dragon",
    "ids": [
      88305705,
      72378329
    ]
  },
  {
    "archetype": "Predap",
    "ids": [
      70427670,
      30537973,
      17825378
    ]
  },
  {
    "archetype": "Predaplant",
    "ids": [
      70369116,
      69946549,
      35272499
    ]
  },
  {
    "archetype": "Invoked",
    "ids": [
      86120751,
      75286621,
      47679935
    ]
  },
  {
    "archetype": "Gandora",
    "ids": [
      58330108,
      64681432,
      2333466
    ]
  },
  {
    "archetype": "Lyrilusc",
    "ids": [
      48608796,
      8491961,
      97949165
    ]
  },
  {
    "archetype": "Supreme King",
    "ids": [
      69610326,
      96227613,
      13331639
    ]
  },
  {
    "archetype": "True Draco",
    "ids": [
      88581108,
      13035077,
      22499034
    ]
  },
  {
    "archetype": "Phantasm Spiral",
    "ids": [
      2819435,
      34302287,
      61397885
    ]
  },
  {
    "archetype": "Trickstar",
    "ids": [
      21076084,
      61283655,
      35371948
    ]
  },
  {
    "archetype": "Gouki",
    "ids": [
      24073068,
      62376646,
      97688360
    ]
  },
  {
    "archetype": "World Chalice",
    "ids": [
      30194529,
      31226177,
      94677445
    ]
  },
  {
    "archetype": "World Legacy",
    "ids": [
      99674361,
      93920420,
      39752820
    ]
  },
  {
    "archetype": "Clear Wing",
    "ids": [
      82044280,
      70771599,
      90036274
    ]
  },
  {
    "archetype": "Bonding",
    "ids": [
      15981690,
      22587018,
      58071123
    ]
  },
  {
    "archetype": "Code Talker",
    "ids": [
      86066372,
      1861629,
      46947713
    ]
  },
  {
    "archetype": "Rokket",
    "ids": [
      31443476,
      68464358,
      67748760
    ]
  },
  {
    "archetype": "Altergeist",
    "ids": [
      25533642,
      42790071,
      53143898
    ]
  },
  {
    "archetype": "Krawler",
    "ids": [
      31706048,
      62587693,
      55838342
    ]
  },
  {
    "archetype": "Metaphys",
    "ids": [
      36898537,
      72355272,
      19476824
    ]
  },
  {
    "archetype": "Vendread",
    "ids": [
      91420202,
      4388680,
      3909436
    ]
  },
  {
    "archetype": "F.A.",
    "ids": [
      33158448,
      93449450,
      39271553
    ]
  },
  {
    "archetype": "Magical Musket",
    "ids": [
      31629407,
      32841045,
      93356623
    ]
  },
  {
    "archetype": "The Weather",
    "ids": [
      65017789,
      54178659,
      91299846
    ]
  },
  {
    "archetype": "Parshath",
    "ids": [
      69514125,
      18036057,
      15449853
    ]
  },
  {
    "archetype": "Tindangle",
    "ids": [
      68860936,
      11375683,
      94142993
    ]
  },
  {
    "archetype": "Mekk-Knight",
    "ids": [
      21887175,
      69811710,
      28692962
    ]
  },
  {
    "archetype": "Mythical Beast",
    "ids": [
      27354732,
      53842431,
      91182675
    ]
  },
  {
    "archetype": "Borrel",
    "ids": [
      85289965,
      31833038,
      27548199
    ]
  },
  {
    "archetype": "Relinquished",
    "ids": [
      62318994,
      94185340
    ]
  },
  {
    "archetype": "Eyes Restrict",
    "ids": [
      94259633,
      63519819,
      41578483
    ]
  },
  {
    "archetype": "Armed Dragon",
    "ids": [
      65192027,
      46384672,
      980973
    ]
  },
  {
    "archetype": "Knightmare",
    "ids": [
      2857636,
      38342335,
      75452921
    ]
  },
  {
    "archetype": "Elemental Lord",
    "ids": [
      13959634,
      8192327,
      53027855
    ]
  },
  {
    "archetype": "Fur Hire",
    "ids": [
      8728498,
      93850652,
      38916526
    ]
  },
  {
    "archetype": "Sky Striker",
    "ids": [
      63166095,
      63288574,
      98338152
    ]
  },
  {
    "archetype": "Crusadia",
    "ids": [
      91646304,
      54525057,
      81524756
    ]
  },
  {
    "archetype": "Impcantation",
    "ids": [
      80701178,
      53303460,
      65877963
    ]
  },
  {
    "archetype": "Cynet",
    "ids": [
      57900671,
      82886276
    ]
  },
  {
    "archetype": "Salamangreat",
    "ids": [
      60303245,
      87871125,
      57134592
    ]
  },
  {
    "archetype": "Dinowrestler",
    "ids": [
      82385847,
      75366958,
      56980148
    ]
  },
  {
    "archetype": "Orcust",
    "ids": [
      93854893,
      4055337,
      30741503
    ]
  },
  {
    "archetype": "Thunder Dragon",
    "ids": [
      31786629,
      15291624,
      56713174
    ]
  },
  {
    "archetype": "Forbidden",
    "ids": [
      24299458,
      25789292,
      27243130
    ]
  },
  {
    "archetype": "Danger!",
    "ids": [
      70711847,
      43694650,
      52350806
    ]
  },
  {
    "archetype": "Nephthys",
    "ids": [
      61441708,
      98446407,
      87054946
    ]
  },
  {
    "archetype": "Prank-Kids",
    "ids": [
      31440046,
      55725117,
      81997228
    ]
  },
  {
    "archetype": "Mayakashi",
    "ids": [
      2645637,
      42542842,
      41729254
    ]
  },
  {
    "archetype": "Valkyrie",
    "ids": [
      38576155,
      44163252,
      97854941
    ]
  },
  {
    "archetype": "Rose",
    "ids": [
      40139997,
      29177818,
      93708824
    ]
  },
  {
    "archetype": "Rose Dragon",
    "ids": [
      73580472,
      33698022,
      26118970
    ]
  },
  {
    "archetype": "Machine Angel",
    "ids": [
      300302035
    ]
  },
  {
    "archetype": "Time Thief",
    "ids": [
      55285840,
      56308388,
      19891131
    ]
  },
  {
    "archetype": "Infinitrack",
    "ids": [
      69073023,
      62034800,
      97584719
    ]
  },
  {
    "archetype": "Witchcrafter",
    "ids": [
      71074418,
      21744288,
      21522601
    ]
  },
  {
    "archetype": "Evil Eye",
    "ids": [
      82466274,
      70122149,
      44133040
    ]
  },
  {
    "archetype": "Endymion",
    "ids": [
      45819647,
      3611830,
      38943357
    ]
  },
  {
    "archetype": "Marincess",
    "ids": [
      79130389,
      91953000,
      36492575
    ]
  },
  {
    "archetype": "Tenyi",
    "ids": [
      5041348,
      98159737,
      23431858
    ]
  },
  {
    "archetype": "Simorgh",
    "ids": [
      72330894,
      52843699,
      11366199
    ]
  },
  {
    "archetype": "Fortune Fairy",
    "ids": [
      5298175,
      68078978,
      31683874
    ]
  },
  {
    "archetype": "Battlewasp",
    "ids": [
      28388927,
      65899613,
      54772065
    ]
  },
  {
    "archetype": "Unchained",
    "ids": [
      29479265,
      26236560,
      67680512
    ]
  },
  {
    "archetype": "Dream Mirror",
    "ids": [
      75888208,
      49389190,
      38267552
    ]
  },
  {
    "archetype": "Mathmech",
    "ids": [
      42632209,
      85692042,
      27182739
    ]
  },
  {
    "archetype": "Dragonmaid",
    "ids": [
      32600024,
      88453933,
      78231355
    ]
  },
  {
    "archetype": "Generaider",
    "ids": [
      13903402,
      38053381,
      68199168
    ]
  },
  {
    "archetype": "@Ignister",
    "ids": [
      98506199,
      62111090,
      61399402
    ]
  },
  {
    "archetype": "A.I.",
    "ids": [
      6552971,
      28270534,
      32056070
    ]
  },
  {
    "archetype": "Ancient Warriors",
    "ids": [
      65711558,
      76416959,
      40140448
    ]
  },
  {
    "archetype": "Megalith",
    "ids": [
      78990927,
      99628747,
      63056220
    ]
  },
  {
    "archetype": "Onomat",
    "ids": [
      85119159
    ]
  },
  {
    "archetype": "Codebreaker",
    "ids": [
      48736598
    ]
  },
  {
    "archetype": "Nemeses",
    "ids": [
      6728559,
      19211362,
      72090076
    ]
  },
  {
    "archetype": "Barbaros",
    "ids": [
      78651105,
      19028307,
      63972571
    ]
  },
  {
    "archetype": "Plunder Patroll",
    "ids": [
      31374201,
      68769900,
      81344070
    ]
  },
  {
    "archetype": "Adamancipator",
    "ids": [
      9464441,
      85914562,
      11302671
    ]
  },
  {
    "archetype": "Rikka",
    "ids": [
      69164989,
      33491462,
      3828844
    ]
  },
  {
    "archetype": "Eldlich",
    "ids": [
      95440946,
      20612097,
      31434645
    ]
  },
  {
    "archetype": "Eldlixir",
    "ids": [
      22669793
    ]
  },
  {
    "archetype": "Golden Land",
    "ids": [
      20590515,
      93191801,
      56984514
    ]
  },
  {
    "archetype": "Phantasm",
    "ids": [
      53134520,
      69890968,
      93224849
    ]
  },
  {
    "archetype": "Dogmatika",
    "ids": [
      68468459,
      60303688,
      82956214
    ]
  },
  {
    "archetype": "Melffy",
    "ids": [
      93018428,
      30439101,
      20003027
    ]
  },
  {
    "archetype": "Potan",
    "ids": [
      16001119
    ]
  },
  {
    "archetype": "Roland",
    "ids": [
      55749927
    ]
  },
  {
    "archetype": "Fossil",
    "ids": [
      59531356,
      44297127,
      23147658
    ]
  },
  {
    "archetype": "Numeron",
    "ids": [
      41418852,
      42352091,
      77402960
    ]
  },
  {
    "archetype": "Appliancer",
    "ids": [
      41830887,
      78447174,
      3875465
    ]
  },
  {
    "archetype": "Spiritual Art",
    "ids": [
      91530236,
      38057522
    ]
  },
  {
    "archetype": "Tri-Brigade",
    "ids": [
      99726621,
      87209160,
      26847978
    ]
  },
  {
    "archetype": "Virtual World",
    "ids": [
      92519087,
      49088914,
      49966326
    ]
  },
  {
    "archetype": "Dual Avatar",
    "ids": [
      85360035,
      87669904,
      13764602
    ]
  },
  {
    "archetype": "Magistus",
    "ids": [
      34755994,
      72498838,
      36099130
    ]
  },
  {
    "archetype": "Live☆Twin",
    "ids": [
      36326160,
      73810864,
      37582948
    ]
  },
  {
    "archetype": "Evil★Twin",
    "ids": [
      93672138,
      9205573,
      36609518
    ]
  },
  {
    "archetype": "Ki-sikil",
    "ids": [
      54257392
    ]
  },
  {
    "archetype": "Lil-la",
    "ids": [
      81078880,
      72233469,
      82699999
    ]
  },
  {
    "archetype": "Drytron",
    "ids": [
      97148796,
      96026108,
      94187078
    ]
  },
  {
    "archetype": "Springans",
    "ids": [
      45484331,
      48285768,
      20424878
    ]
  },
  {
    "archetype": "S-Force",
    "ids": [
      22180094,
      21368442,
      58363151
    ]
  },
  {
    "archetype": "Myutant",
    "ids": [
      62201847,
      8200556,
      34695290
    ]
  },
  {
    "archetype": "Sunvine",
    "ids": [
      53286626,
      65563871,
      91557476
    ]
  },
  {
    "archetype": "Sunavalon",
    "ids": [
      93896655,
      44478599,
      92770064
    ]
  },
  {
    "archetype": "Sunseed",
    "ids": [
      27520594,
      66407907,
      30013902
    ]
  },
  {
    "archetype": "Starry Knight",
    "ids": [
      23220533,
      59228631,
      85590798
    ]
  },
  {
    "archetype": "Doll Monster",
    "ids": [
      18106132,
      72717433
    ]
  },
  {
    "archetype": "Amazement",
    "ids": [
      94821366,
      67314110,
      70389815
    ]
  },
  {
    "archetype": "Attraction",
    "ids": [
      92650018,
      66984907,
      97182396
    ]
  },
  {
    "archetype": "Branded",
    "ids": [
      44362883,
      87746184,
      36637374
    ]
  },
  {
    "archetype": "War Rock",
    "ids": [
      19771459,
      45943516,
      18558867
    ]
  },
  {
    "archetype": "Materiactor",
    "ids": [
      33008376,
      70597485,
      72409226
    ]
  },
  {
    "archetype": "Ogdoadic",
    "ids": [
      36010310,
      62405028,
      24050692
    ]
  },
  {
    "archetype": "Solfachord",
    "ids": [
      80776622,
      55226153,
      92610868
    ]
  },
  {
    "archetype": "GranSolfachord",
    "ids": [
      84521924
    ]
  },
  {
    "archetype": "Ursarctic",
    "ids": [
      53087962,
      81108658,
      29537493
    ]
  },
  {
    "archetype": "Despia",
    "ids": [
      62962630,
      36577931,
      72272462
    ]
  },
  {
    "archetype": "Magikey",
    "ids": [
      45655875,
      19489718,
      98234196
    ]
  },
  {
    "archetype": "Gunkan",
    "ids": [
      24639891,
      75215744,
      61027400
    ]
  },
  {
    "archetype": "Mystical Beast of the Forest",
    "ids": [
      97317530,
      24096499,
      36318200
    ]
  },
  {
    "archetype": "Stealth Kragen",
    "ids": [
      94942656
    ]
  },
  {
    "archetype": "Number",
    "ids": [
      95134948,
      68679595,
      75402014
    ]
  },
  {
    "archetype": "Swordsoul",
    "ids": [
      96633955,
      20001443,
      93490856
    ]
  },
  {
    "archetype": "Icejade",
    "ids": [
      86682165,
      18494511,
      55151012
    ]
  },
  {
    "archetype": "Floowandereeze",
    "ids": [
      54334420,
      18940725,
      28126717
    ]
  },
  {
    "archetype": "Hyperion",
    "ids": [
      91434602,
      63101468
    ]
  },
  {
    "archetype": "Beetrooper",
    "ids": [
      39041550,
      65430555,
      2834264
    ]
  },
  {
    "archetype": "P.U.N.K.",
    "ids": [
      55920742,
      19535693,
      6609736
    ]
  },
  {
    "archetype": "Exosister",
    "ids": [
      16474916,
      42741437,
      37343995
    ]
  },
  {
    "archetype": "Dinomorphia",
    "ids": [
      92133240,
      48832775,
      92798873
    ]
  },
  {
    "archetype": "Lady of Lament",
    "ids": [
      23898021,
      25643346,
      14504454
    ]
  },
  {
    "archetype": "Seventh",
    "ids": [
      7477101,
      23153227,
      60158866
    ]
  },
  {
    "archetype": "Barian's",
    "ids": [
      97769122,
      30761649
    ]
  },
  {
    "archetype": "Kairyu-Shin",
    "ids": [
      23931679,
      95602345
    ]
  },
  {
    "archetype": "Sea Stealth",
    "ids": [
      58203736
    ]
  },
  {
    "archetype": "Therion",
    "ids": [
      10604644,
      83610035,
      84792926
    ]
  },
  {
    "archetype": "Scareclaw",
    "ids": [
      82361809,
      56063182,
      53776969
    ]
  },
  {
    "archetype": "Battleguard",
    "ids": [
      40453765,
      20394040,
      78621186
    ]
  },
  {
    "archetype": "Libromancer",
    "ids": [
      46123974,
      16312943,
      71406430
    ]
  },
  {
    "archetype": "Vaylantz",
    "ids": [
      49131917,
      75952542,
      49568943
    ]
  },
  {
    "archetype": "Labrynth",
    "ids": [
      81497285,
      1225009,
      92714517
    ]
  },
  {
    "archetype": "Runick",
    "ids": [
      68957034,
      31562086,
      94445733
    ]
  },
  {
    "archetype": "Spright",
    "ids": [
      76145933,
      13533678,
      54498517
    ]
  },
  {
    "archetype": "Tearlaments",
    "ids": [
      572850,
      73956664,
      37961969
    ]
  },
  {
    "archetype": "Vernusylph",
    "ids": [
      9350312,
      81519836,
      36745317
    ]
  },
  {
    "archetype": "Mokey Mokey",
    "ids": [
      99910751
    ]
  },
  {
    "archetype": "Doodle Beast",
    "ids": [
      67725394,
      31230289
    ]
  },
  {
    "archetype": "Doodlebook",
    "ids": [
      94113093
    ]
  },
  {
    "archetype": "G Golem",
    "ids": [
      61668670,
      97053215,
      98875863
    ]
  },
  {
    "archetype": "Rainbow Bridge",
    "ids": [
      10938846
    ]
  },
  {
    "archetype": "Bystial",
    "ids": [
      33854624,
      6637331,
      32731036
    ]
  },
  {
    "archetype": "Kashtira",
    "ids": [
      32909498,
      68304193,
      69540484
    ]
  },
  {
    "archetype": "Ghoti",
    "ids": [
      73421698,
      46037983,
      72309040
    ]
  },
  {
    "archetype": "Rescue-ACE",
    "ids": [
      38339996,
      37617348,
      41443249
    ]
  },
  {
    "archetype": "Purrely",
    "ids": [
      25550531,
      79933029,
      56700100
    ]
  },
  {
    "archetype": "Mikanko",
    "ids": [
      81260679,
      43527730,
      18377261
    ]
  },
  {
    "archetype": "Aquamirror",
    "ids": [
      72386290
    ]
  },
  {
    "archetype": "Firewall",
    "ids": [
      64211118,
      21637210,
      20455229
    ]
  },
  {
    "archetype": "Mannadium",
    "ids": [
      71277255,
      44760562,
      45065541
    ]
  },
  {
    "archetype": "Nemleria",
    "ids": [
      70155677,
      52382379,
      16893370
    ]
  },
  {
    "archetype": "Gold Pride",
    "ids": [
      23512906,
      96305350,
      54670997
    ]
  },
  {
    "archetype": "Labyrinth Wall",
    "ids": [
      34771947
    ]
  },
  {
    "archetype": "Favorite",
    "ids": [
      87532344
    ]
  },
  {
    "archetype": "Vanquish Soul",
    "ids": [
      29302858,
      92895501,
      29280200
    ]
  },
  {
    "archetype": "Nouvelles",
    "ids": [
      88890658,
      52495649,
      15388353
    ]
  },
  {
    "archetype": "Recipe",
    "ids": [
      87778106,
      14166715,
      87955518
    ]
  },
  {
    "archetype": "Visas",
    "ids": [
      821049,
      14391625
    ]
  },
  {
    "archetype": "Veda",
    "ids": [
      40785230
    ]
  },
  {
    "archetype": "Diabell",
    "ids": [
      39881252,
      65289956,
      23151193
    ]
  },
  {
    "archetype": "Diabellstar",
    "ids": [
      72270339
    ]
  },
  {
    "archetype": "Snake-Eye",
    "ids": [
      9674034,
      89023486,
      90241276
    ]
  },
  {
    "archetype": "Horus",
    "ids": [
      84941194,
      47330808,
      11335209
    ]
  },
  {
    "archetype": "Horus the Black Flame Dragon",
    "ids": [
      11224103,
      48229808,
      75830094
    ]
  },
  {
    "archetype": "Sinful Spoils",
    "ids": [
      80845034,
      66328392,
      38511382
    ]
  },
  {
    "archetype": "Patissciel",
    "ids": [
      26435595
    ]
  },
  {
    "archetype": "Heart",
    "ids": [
      28226490,
      48626373,
      60362066
    ]
  },
  {
    "archetype": "Memento",
    "ids": [
      54550967,
      18165869,
      81677154
    ]
  },
  {
    "archetype": "Centur-Ion",
    "ids": [
      15005145,
      42493140,
      15982593
    ]
  },
  {
    "archetype": "Vaalmonica",
    "ids": [
      3048768,
      30432463,
      5605529
    ]
  },
  {
    "archetype": "Tistina",
    "ids": [
      59504256,
      86999951,
      86111442
    ]
  },
  {
    "archetype": "Yubel",
    "ids": [
      78371393,
      90829280,
      4779091
    ]
  },
  {
    "archetype": "Voiceless Voice",
    "ids": [
      25801745,
      51296484,
      98477480
    ]
  },
  {
    "archetype": "Toy",
    "ids": [
      49299410,
      65504487,
      24878656
    ]
  },
  {
    "archetype": "Sangen",
    "ids": [
      82570174,
      66730191,
      30336082
    ]
  },
  {
    "archetype": "Tenpai Dragon",
    "ids": [
      91810826,
      39931513,
      65326118
    ]
  },
  {
    "archetype": "Ragnaraika",
    "ids": [
      99153051,
      26548709,
      43129357
    ]
  },
  {
    "archetype": "Salamandra",
    "ids": [
      62091148
    ]
  },
  {
    "archetype": "Ashened",
    "ids": [
      67660909,
      4271596,
      3055018
    ]
  },
  {
    "archetype": "Millennium",
    "ids": [
      38775407,
      37613663,
      1164211
    ]
  },
  {
    "archetype": "Exodd",
    "ids": [
      23617756,
      402416
    ]
  },
  {
    "archetype": "Fiendsmith",
    "ids": [
      60764609,
      98567237,
      2463794
    ]
  },
  {
    "archetype": "White Forest",
    "ids": [
      61980241,
      98385955,
      25592142
    ]
  },
  {
    "archetype": "Mulcharmy",
    "ids": [
      42141493,
      84192580,
      87126721
    ]
  },
  {
    "archetype": "Emblema",
    "ids": [
      61950680
    ]
  },
  {
    "archetype": "Tachyon",
    "ids": [
      72705654
    ]
  },
  {
    "archetype": "Blue Tears",
    "ids": [
      99176254
    ]
  },
  {
    "archetype": "Wedju",
    "ids": [
      63017368,
      18046862
    ]
  },
  {
    "archetype": "Mimighoul",
    "ids": [
      81522098,
      86809440,
      55537983
    ]
  },
  {
    "archetype": "Shark",
    "ids": [
      50449881,
      65676461,
      98881700
    ]
  },
  {
    "archetype": "Primite",
    "ids": [
      56506740,
      63198739,
      92501449
    ]
  },
  {
    "archetype": "Metalmorph",
    "ids": [
      89812483,
      15216188,
      91152455
    ]
  },
  {
    "archetype": "Morganite",
    "ids": [
      81756619
    ]
  },
  {
    "archetype": "Azamina",
    "ids": [
      73391962,
      46396218,
      94845588
    ]
  },
  {
    "archetype": "Schoolwork",
    "ids": [
      77751766
    ]
  },
  {
    "archetype": "Ryzeal",
    "ids": [
      8633261,
      35844557,
      34022970
    ]
  },
  {
    "archetype": "Maliss",
    "ids": [
      69272449,
      32061192,
      68337209
    ]
  },
  {
    "archetype": "Ryu-Ge",
    "ids": [
      92487128,
      56499179,
      20904475
    ]
  },
  {
    "archetype": "Argostars",
    "ids": [
      91438674,
      91284003,
      65889305
    ]
  },
  {
    "archetype": "Aqua Jet",
    "ids": [
      32278723
    ]
  },
  {
    "archetype": "Dragon Ruler",
    "ids": [
      58201062,
      4965193,
      67359907
    ]
  },
  {
    "archetype": "Mitsurugi",
    "ids": [
      19899073,
      18176525,
      81560239
    ]
  },
  {
    "archetype": "Regenesis",
    "ids": [
      67171933,
      27781371,
      22938501
    ]
  }
]
