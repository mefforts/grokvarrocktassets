// public/js/local-questions.js

// Fallback questions data in case the database is not available
window.localQuestionData = {
    'Beginner': [
      {
        _id: 'local1',
        text: "What Attack level is required to wear Adamant Weaponry?",
        answers: ["30", "25", "40", "35"],
        difficulty: "Beginner",
        category: "Items",
        area: "Combat",
        imageUrl: "/images/items/adamant_scimitar.png",
        explanation: "Adamant weaponry requires 30 Attack to wield."
      },
      {
        _id: 'local2',
        text: "What Thieving level is required to pickpocket Master Farmers?",
        answers: ["38", "40", "35", "45"],
        difficulty: "Beginner",
        category: "Skills",
        area: "Thieving",
        imageUrl: "/images/npcs/master_farmer.png",
        explanation: "You need level 38 Thieving to pickpocket Master Farmers."
      },
      {
        _id: 'local3',
        text: "Which skill allows you to craft runes?",
        answers: ["Runecraft", "Magic", "Crafting", "Mining"],
        difficulty: "Beginner",
        category: "Skills",
        area: "Runecraft",
        imageUrl: "/images/skills/runecraft.png",
        explanation: "Runecraft is the skill used to create runes for spellcasting."
      },
      {
        _id: 'local4',
        text: "What is the strongest metal dragon?",
        answers: ["Rune dragon", "Steel dragon", "Iron dragon", "Mithril dragon"],
        difficulty: "Beginner",
        category: "NPCs",
        area: "Combat",
        imageUrl: "/images/npcs/rune_dragon.png",
        explanation: "Rune dragons are the strongest metal dragons, requiring 95 Slayer to kill."
      },
      {
        _id: 'local5',
        text: "Which city is closest to Lumbridge?",
        answers: ["Al Kharid", "Varrock", "Draynor Village", "Falador"],
        difficulty: "Beginner",
        category: "Locations",
        area: "Misthalin",
        imageUrl: "/images/locations/al_kharid.png",
        explanation: "Al Kharid is just east of Lumbridge, across the toll gate."
      }
    ],
    'Easy': [
      {
        _id: 'local6',
        text: "What is the name of the quest that awards the Ghostspeak Amulet?",
        answers: ["The Restless Ghost", "Ghosts Ahoy", "Creature of Fenkenstrain", "Spirit of the Elid"],
        difficulty: "Easy",
        category: "Quests",
        area: "Lumbridge",
        imageUrl: "/images/items/ghostspeak_amulet.png",
        explanation: "The Restless Ghost is a novice quest that awards the Ghostspeak Amulet, allowing players to talk to ghosts."
      },
      {
        _id: 'local7',
        text: "What is the name of the quest that unlocks the Herblore Skill?",
        answers: ["Druidic Ritual", "Jungle Potion", "Eadgar's Ruse", "The Dig Site"],
        difficulty: "Easy",
        category: "Quests",
        area: "Taverley",
        imageUrl: "/images/skills/herblore.png",
        explanation: "Druidic Ritual is required to start training the Herblore skill."
      }
    ],
    'Medium': [
      {
        _id: 'local8',
        text: "What is the name of the Magic and Academia zone of Zeah?",
        answers: ["Arceuus", "Lovakengj", "Hosidius", "Piscarilius"],
        difficulty: "Medium",
        category: "Locations",
        area: "Great Kourend",
        imageUrl: "/images/locations/arceuus.png",
        explanation: "Arceuus is the house in Great Kourend that specializes in magic and academia."
      },
      {
        _id: 'local9',
        text: "What is the name of the Fairy Slayer Master?",
        answers: ["Chaeldar", "Nieve", "Duradel", "Konar"],
        difficulty: "Medium",
        category: "NPCs",
        area: "Zanaris",
        imageUrl: "/images/npcs/chaeldar.png",
        explanation: "Chaeldar is the fairy Slayer Master located in Zanaris who requires 70 Combat to use."
      }
    ],
    'Hard': [
      {
        _id: 'local10',
        text: "What weapon is needed to kill Vampyres?",
        answers: ["Blisterwood weapons", "Silver weapons", "Wolfbane dagger", "Ivandis flail"],
        difficulty: "Hard",
        category: "Items",
        area: "Combat",
        imageUrl: "/images/items/blisterwood_flail.png",
        explanation: "Blisterwood weapons are the most effective against higher level Vampyres."
      }
    ],
    'Elite': [
      {
        _id: 'local11',
        text: "What is the only item in the game to offer a negative Prayer Bonus?",
        answers: ["Ancient Staff", "Dragonbone Necklace", "Spined Helm", "Black Demon Mask"],
        difficulty: "Elite",
        category: "Items",
        area: "Magic",
        imageUrl: "/images/items/ancient_staff.png",
        explanation: "The Ancient Staff is the only item in OSRS that gives a negative Prayer bonus (-1)."
      }
    ],
    'Master': [
      {
        _id: 'local12',
        text: "Which Gnomish Delicacy became a high-end currency during RuneScape's infamous trade restrictions?",
        answers: ["Mint Cake", "Toad Crunchies", "Worm Crunchies", "Blurberry Special"],
        difficulty: "Master",
        category: "Items",
        area: "History",
        imageUrl: "/images/items/mint_cake.png",
        explanation: "The Gnome Mint Cake was used as a high-value currency during the trade restrictions era because of its high value and stackability."
      }
    ]
  };