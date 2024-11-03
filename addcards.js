/**
 * @param {string} name
 * @param {string} group
 * @param {string} era
 * @param {int} number
 * @param {string} code
 * @param {int} rarity
 * @param {int} traderate
 * @param {boolean} [event=false]
 * @returns {Object}
*/

function newInvCard(name, group, era, number, code, rarity, traderate, event=false) {
  const fileName = code.split('.')[0];
  
  let tradeText;
  switch(traderate) {
    case 0:
      tradeText = "{C:red}NFT";
      break;
    case 1:
      tradeText = "{C:orange}Good Offers Only";
      break;
    case 2:
      tradeText = "{C:green}UFS & UFT";
      break;
    case 3:
      tradeText = "{C:green}At Marketplace";
      break;
    default:
      tradeText = "";
  }

  const eraOrEvent = event
    ? `{C:pink}Event: {}${era}` : `{C:purple}Era: {}${era}`;

  return {
    name: name,
    era: era,
    number: number,
    code: code,
    event: event,
    text: [
      `{C:orange}Group: {}${group}`,
      eraOrEvent,
      "",
      tradeText
    ],
    image_url: `img/${fileName}.gif`,
    rarity: rarity
  };
}

let inventory = [
//newInvCard("NAME", "GROUP", "ERA(EVENT)", "NUMBER", "CODE", "RARITY", TRADERATE, [EVENT]),
  newInvCard("woongmin", "AB6IX", "Ships", 6, "AWMS.17b7", 2, 3, true),
  newInvCard("cocona", "XG", "NEW DNA", 50, "XNCN3.b9cd", 3, 0),
  newInvCard("irene", "Irene & Seulgi", "Monster", 56, "ISI3.0a0a", 3, 1),
  newInvCard("takeru", "INI", "THE VIEW", 90, "ITWK2.2d66", 2, 3),
  newInvCard("Seongjong", "INFINITE", "13egin", 102, "IEJ1.4288", 1, 3),
  newInvCard("ruka", "BABYMONSTER", "DRIP", 108, "BDRU1.0369", 1, 2),
  newInvCard("Taemin", "SHINEE", "Coquette", 172, "STCT.5615", 2, 2, true),
  newInvCard("Juria", "XG", "SOMETHING AIN'T RIGHT", 180, "XSU2.2da0", 2, 0),
  newInvCard("Hinata", "XG", "SOMETHING AIN'T RIGHT", 210, "XSI2.b236", 2, 0),
  newInvCard("The8", "SEVENTEEN", "Coquette", 274, "SECT.ef52", 2, 1, true),
  newInvCard("Hinata", "XG", "WINTER WITHOUT YOU", 327, "XWHI2.0655", 2, 0),
  newInvCard("Hinata", "XG", "NEW DNA", 329, "XNHI2.fa67", 2, 0),
];

// Deprecated
let photocards = []
let consumables = []
let card_modifications = []
let decks = []
let stickers = []
let blinds = []

let cols = {
  MULT: "#FE5F55",
  CHIPS: "#009dff",
  MONEY: "#f3b958",
  XMULT: "#FE5F55",
  FILTER: "#ff9a00",
  ATTENTION: "#ff9a00",
  BLUE: "#009dff",
  RED: "#FE5F55",
  GREEN: "#4BC292",
  PALE_GREEN: "#56a887",
  ORANGE: "#fda200",
  IMPORTANT: "#ff9a00",
  PINK: "#FF8DA1",
  GOLD: "#eac058",
  YELLOW: "#ffff00",
  CLEAR: "#00000000", 
  WHITE: "#ffffff",
  PURPLE: "#8867a5",
  BLACK: "#374244",
  L_BLACK: "#4f6367",
  GREY: "#5f7377",
  CHANCE: "#4BC292",
  photocard_GREY: "#bfc7d5",
  VOUCHER: "#cb724c",
  BOOSTER: "#646eb7",
  EDITION: "#ffffff",
  DARK_EDITION: "#5d5dff",
  ETERNAL: "#c75985",
  INACTIVE: "#ffffff99",
  HEARTS: "#f03464",
  DIAMONDS: "#f06b3f",
  SPADES: "#403995",
  CLUBS: "#235955",
  ENHANCED: "#8389DD",
  photocard: "#708b91",
  TAROT: "#a782d1",
  PLANET: "#13afce",
  SPECTRAL: "#4584fa",
  VOUCHER: "#fd682b",
  EDITION: "#4ca893",
}

let rarities = {
  1: "#66c4ff", 
  2: "#4BC292",
  3: "#fe5f55",
  "Legendary": "#b26cbb",
  "photocard": "#708b91",
  "Tarot": "#a782d1",
  "Planet": "#13afce",
  "Spectral": "#4584fa",
  "Voucher": "#fd682b",
  "Pack": "#9bb6bd",
  "Enhancement": "#8389DD",
  "Edition": "#4ca893",
  "Seal": "#4584fa",
  "Deck": "#9bb6bd",
  "Sticker": "#5d5dff",
  "Boss Blind": "#5d5dff",
  "Showdown": "#4584fa",
}

regex = /{([^}]+)}/g;

let add_cards_to_div = (photocards, photocards_div) => {
  for (let photocard of photocards) {
    console.log("adding photocard", photocard.name);
  
    photocard.text = photocard.text.map((line) => { return line + "{}"});
  
    photocard.text = photocard.text.join("<br/>");
    photocard.text = photocard.text.replaceAll("{}", "</span>");
    photocard.text = photocard.text.replace(regex, function replacer(match, p1, offset, string, groups) {
      let classes = p1.split(",");
  
      let css_styling = "";
  
      for (let i = 0; i < classes.length; i++) {
        let parts = classes[i].split(":");
        if (parts[0] === "C") {
          css_styling += `color: ${cols[parts[1].toUpperCase()]};`;
        } else if (parts[0] === "X") {
          css_styling += `background-color: ${cols[parts[1].toUpperCase()]}; border-radius: 5px; padding: 0 5px;`;
        }
      }
  
      return `</span><span style='${css_styling}'>`;
    });
  
    let photocard_div = document.createElement("div");
    photocard_div.classList.add("photocard");
    if (photocard.rarity === "Sticker" || photocard.rarity == "Seal") {
      photocard_div.innerHTML = `
        <h3>${photocard.name.toUpperCase()}</h3>
        <h5>#${photocard.number} | ${photocard.code}</h5>
        <img src="${photocard.image_url}" alt="${photocard.name}" class="hasback" />
        <h4 class="rarity" style="background-color: ${rarities[photocard.rarity]}">${photocard.rarity}</h4>
        <div class="text">${photocard.text}</div>
      `;
    } else if (photocard.soul) {
      photocard_div.innerHTML = `
        <h3>${photocard.name.toUpperCase()}</h3>
        <h5>#${photocard.number} | ${photocard.code}</h5>
        <span class="soulholder">
          <img src="${photocard.image_url}" alt="${photocard.name}" class="soul-bg" />
          <img src="${photocard.image_url}" alt="${photocard.name}" class="soul-top" />
        </span>
        <h4 class="rarity" style="background-color: ${rarities[photocard.rarity]}">${photocard.rarity}</h4>
        <div class="text">${photocard.text}</div>
      `;
    } else if (photocard.event) {
      photocard_div.innerHTML = `
        <h3>${photocard.name.toUpperCase()}</h3>
        <h5>#${photocard.number} | ${photocard.code}</h5>
        <img src="${photocard.image_url}" alt="${photocard.name}" />
        <h4 class="rarity" style="background-color: ${rarities[photocard.rarity]}">${photocard.rarity} [${photocard.era}]</h4>
        <div class="text">${photocard.text}</div>
      `;
    } else {
      photocard_div.innerHTML = `
        <h3>${photocard.name.toUpperCase()}</h3>
        <h5>#${photocard.number} | ${photocard.code}</h5>
        <img src="${photocard.image_url}" alt="${photocard.name}" />
        <h4 class="rarity" style="background-color: ${rarities[photocard.rarity]}">${photocard.rarity}D</h4>
        <div class="text">${photocard.text}</div>
      `;
    }
  
    photocards_div.appendChild(photocard_div);
  }
}

if (photocards.length === 0) {
  document.querySelector(".photocardsfull").style.display = "none"
} else {
  let photocards_div = document.querySelector(".photocards");
  add_cards_to_div(photocards, photocards_div);
}

if (consumables.length === 0) {
  document.querySelector(".consumablesfull").style.display = "none"
} else {
  let consumables_div = document.querySelector(".consumables");
  add_cards_to_div(consumables, consumables_div);
}

if (card_modifications.length === 0) {
  document.querySelector(".cardmodsfull").style.display = "none"
} else {
  let cardmods_div = document.querySelector(".cardmods");
  add_cards_to_div(card_modifications, cardmods_div);
}

if (decks.length === 0) {
  document.querySelector(".decksfull").style.display = "none"
} else {
  let decks_div = document.querySelector(".decks");
  add_cards_to_div(decks, decks_div);
}

if (stickers.length === 0) {
  document.querySelector(".stickersfull").style.display = "none"
} else {
  let stickers_div = document.querySelector(".stickers");
  add_cards_to_div(stickers, stickers_div);
}

if (blinds.length === 0) {
  document.querySelector(".blindsfull").style.display = "none"
} else {
  let blinds_div = document.querySelector(".blinds");
  add_cards_to_div(blinds, blinds_div);
}

if (inventory.length === 0) {
  document.querySelector(".inventoryfull").style.display = "none"
} else {
  let inventory_div = document.querySelector(".inventory");
  add_cards_to_div(inventory, inventory_div);
}