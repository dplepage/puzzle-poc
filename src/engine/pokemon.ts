export interface Battle {
  slug: string
  left: number
  top: number
  img: string
  answer: string
}

export interface Stage {
  bg: string
  battles: Battle[]
}

export const stages:Stage[] = [
  {
    "bg": "top.png",
    "battles": [
      {
        "slug": "pokemon-advertiser-trainer",
        "left": 80,
        "top": 470,
        "img": "advertiser-trainer.png",
        "answer": "",
      },
      {
        "slug": "pokemon-scouts-trainer",
        "left": 780,
        "top": 640,
        "img": "scouts-trainer.png",
        "answer": "",
      },
      {
        "slug": "pokemon-taxonomist-trainer",
        "left": 400,
        "top": 830,
        "img": "taxonomist-trainer.png",
        "answer": "",
      }
    ]
  },
  {
    "bg": "1.png",
    "battles": [
      {
        "slug": "pokemon-rattata",
        "left": -10,
        "top": 100,
        "img": "rattata.png",
        "answer": "",
      },
      {
        "slug": "pokemon-raticate",
        "left": 660,
        "top": -40,
        "img": "raticate.png",
        "answer": "",
      }
    ]
  },
  {
    "bg": "2.png",
    "battles": [
      {
        "slug": "pokemon-cranidos",
        "left": 460,
        "top": 220,
        "img": "cranidos.png",
        "answer": "",
      },
      {
        "slug": "pokemon-rampardos",
        "left": 10,
        "top": -10,
        "img": "rampardos.png",
        "answer": "",
      }
    ]
  },
  {
    "bg": "3.png",
    "battles": [
      {
        "slug": "pokemon-charmander",
        "left": 80,
        "top": 100,
        "img": "charmander.png",
        "answer": "",
      },
      {
        "slug": "pokemon-charmeleon",
        "left": 770,
        "top": 160,
        "img": "charmeleon.png",
        "answer": "",
      }
    ]
  },
  {
    "bg": "4.png",
    "battles": [
      {
        "slug": "pokemon-yamask",
        "left": 640,
        "top": 180,
        "img": "yamask.png",
        "answer": "",
      },
      {
        "slug": "pokemon-cofagrigus",
        "left": -10,
        "top": 90,
        "img": "cofagrigus.png",
        "answer": "",
      }
    ]
  },
  {
    "bg": "5.png",
    "battles": [
      {
        "slug": "pokemon-dratini",
        "left": 90,
        "top": 80,
        "img": "dratini.png",
        "answer": "",
      },
      {
        "slug": "pokemon-dragonair",
        "left": 690,
        "top": 100,
        "img": "dragonair.png",
        "answer": "",
      }
    ]
  },
  {
    "bg": "6.png",
    "battles": [
      {
        "slug": "pokemon-squirtle",
        "left": 500,
        "top": 60,
        "img": "squirtle.png",
        "answer": "",
      },
      {
        "slug": "pokemon-wartortle",
        "left": 250,
        "top": 250,
        "img": "wartortle.png",
        "answer": "",
      }
    ]
  },
  {
    "bg": "7.png",
    "battles": [
      {
        "slug": "pokemon-meowth",
        "left": 200,
        "top": 100,
        "img": "meowth.png",
        "answer": "",
      },
      {
        "slug": "pokemon-persian",
        "left": 600,
        "top": 100,
        "img": "persian.png",
        "answer": "",
      }
    ]
  },
  {
    "bg": "8.png",
    "battles": [
      {
        "slug": "pokemon-rockruff",
        "left": 760,
        "top": 150,
        "img": "rockruff.png",
        "answer": "",
      },
      {
        "slug": "pokemon-lycanroc",
        "left": -50,
        "top": 160,
        "img": "lycanroc.png",
        "answer": "",
      }
    ]
  },
  {
    "bg": "9.png",
    "battles": [
      {
        "slug": "pokemon-ponyta",
        "left": 220,
        "top": 190,
        "img": "ponyta.png",
        "answer": "",
      },
      {
        "slug": "pokemon-rapidash",
        "left": 520,
        "top": -20,
        "img": "rapidash.png",
        "answer": "",
      }
    ]
  },
  {
    "bg": "10.png",
    "battles": [
      {
        "slug": "pokemon-duskull",
        "left": 730,
        "top": 80,
        "img": "duskull.png",
        "answer": "",
      },
      {
        "slug": "pokemon-dusclops",
        "left": -30,
        "top": 150,
        "img": "dusclops.png",
        "answer": "",
      }
    ]
  },
  {
    "bg": "11.png",
    "battles": [
      {
        "slug": "pokemon-bagon",
        "left": 10,
        "top": 210,
        "img": "bagon.png",
        "answer": "",
      },
      {
        "slug": "pokemon-shelgon",
        "left": 620,
        "top": 130,
        "img": "shelgon.png",
        "answer": "",
      }
    ]
  },
  {
    "bg": "12.png",
    "battles": [
      {
        "slug": "pokemon-krabby",
        "left": 700,
        "top": 190,
        "img": "krabby.png",
        "answer": "",
      },
      {
        "slug": "pokemon-kingler",
        "left": -60,
        "top": 150,
        "img": "kingler.png",
        "answer": "",
      }
    ]
  },
  {
    "bg": "bottom.png",
    "battles": [
      {
        "slug": "pokemon-rival",
        "left": 320,
        "top": 30,
        "img": "rival.png",
        "answer": "",
      }
    ]
  }
]
