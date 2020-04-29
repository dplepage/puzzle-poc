import React from 'react';
import { Slug, ViewState, ViewProps, NavEntry, ViewData, PuzzleEngine } from './interface';
import { Battle, Stage, stages } from './pokemon'

interface PuzzleState {
  unlocked: boolean
  solved: boolean
  answers: string[]
}

// Quick hack of a stupidly simple puzzle structure

type LoadPuzzleData = Record<Slug, any>
type VParams = {
  label: string,
  unlocks?: string[],
  answer?: string,
  load_puzzles?: LoadPuzzleData,
}
class ViewStructure {
  label: string
  unlocks: Slug[]
  answer?: string
  load_puzzles: LoadPuzzleData
  constructor({ label, unlocks = [], answer, load_puzzles }:VParams){
    this.label = label
    this.unlocks = unlocks
    this.answer = answer
    this.load_puzzles = load_puzzles || {};
  }
}

const hunt: Record<Slug, ViewStructure> = {
  start: new ViewStructure({
   label: "The Start",
   load_puzzles: {
     round1: {
       image: "./views/round1.man.png",
       img_alt: "A Man",
     },
     round2: {
       image: "./views/round2.plan.gif",
       img_alt: "A Plan",
     },
     round3: {
       image: "./views/round3.canal.jpg",
       img_alt: "A Canal",
     }
   },
  }),
  round1: new ViewStructure({
   label: "The First Round",
   load_puzzles: {
     puzz1_1: {},
     puzz1_2: {}
   },
  }),
  puzz1_1: new ViewStructure({
   label: "Puzzle One",
   unlocks: ["puzz1_2"],
  }),
  puzz1_2: new ViewStructure({
   label: "An Image Puzzle",
   unlocks: ["puzz2_1", "round2"],
   answer: "VERMILLION",
  }),
  round2: new ViewStructure({
   label: "The Second Round",
   load_puzzles: {
     puzz2_1: {},
     puzz2_2: {}
   },
  }),
  puzz2_1: new ViewStructure({
   label: "A Tic-Tac-Toe 'Puzzle'",
   unlocks: ["puzz2_2"],
   answer: "TICTACS",
  }),
  puzz2_2: new ViewStructure({
   label: "Another Puzzle Two",
   unlocks: ["puzz3_1", "round3"],
  }),
  round3: new ViewStructure({
   label: "The Final Round",
   load_puzzles: {
     puzz3_1: {},
     puzz3_2: {}
   },
  }),
  puzz3_1: new ViewStructure({
   label: "The Final Puzzle One",
   unlocks: ["puzz3_2"],
  }),
  puzz3_2: new ViewStructure({
   label: "The Final Puzzle Two",
  }),
  pokemon: new ViewStructure({
    label: "Pokémon Island",
  }),
  'pokemon-advertiser-trainer': new ViewStructure({
    label: 'Advertiser Trainer',
    unlocks: ['pokemon-scouts-trainer'],
  }),
  'pokemon-scouts-trainer': new ViewStructure({
    label: 'Scouts Trainer',
    unlocks: ['pokemon-taxonomist-trainer'],
  }),
  'pokemon-taxonomist-trainer': new ViewStructure({
    label: 'Taxonomist Trainer',
    unlocks: ['pokemon-rattata'],
  }),
  'pokemon-rattata': new ViewStructure({
    label: 'Rattata',
    unlocks: ['pokemon-raticate'],
  }),
  'pokemon-raticate': new ViewStructure({
    label: 'Raticate',
    unlocks: ['pokemon-cranidos'],
  }),
  'pokemon-cranidos': new ViewStructure({
    label: 'Cranidos',
    unlocks: ['pokemon-rampardos'],
  }),
  'pokemon-rampardos': new ViewStructure({
    label: 'Rampardos',
    unlocks: ['pokemon-charmander'],
  }),
  'pokemon-charmander': new ViewStructure({
    label: 'Charmander',
    unlocks: ['pokemon-charmeleon'],
  }),
  'pokemon-charmeleon': new ViewStructure({
    label: 'Charmeleon',
    unlocks: ['pokemon-yamask'],
  }),
  'pokemon-yamask': new ViewStructure({
    label: 'Yamask',
    unlocks: ['pokemon-cofagrigus'],
  }),
  'pokemon-cofagrigus': new ViewStructure({
    label: 'Cofagrigus',
    unlocks: ['pokemon-dratini'],
  }),
  'pokemon-dratini': new ViewStructure({
    label: 'Dratini',
    unlocks: ['pokemon-dragonair'],
  }),
  'pokemon-dragonair': new ViewStructure({
    label: 'Dragonair',
    unlocks: ['pokemon-squirtle'],
  }),
  'pokemon-squirtle': new ViewStructure({
    label: 'Squirtle',
    unlocks: ['pokemon-wartortle'],
  }),
  'pokemon-wartortle': new ViewStructure({
    label: 'Wartortle',
    unlocks: ['pokemon-meowth'],
  }),
  'pokemon-meowth': new ViewStructure({
    label: 'Meowth',
    unlocks: ['pokemon-persian'],
  }),
  'pokemon-persian': new ViewStructure({
    label: 'Persian',
    unlocks: ['pokemon-rockruff'],
  }),
  'pokemon-rockruff': new ViewStructure({
    label: 'Rockruff',
    unlocks: ['pokemon-lycanroc'],
  }),
  'pokemon-lycanroc': new ViewStructure({
    label: 'Lycanroc',
    unlocks: ['pokemon-ponyta'],
  }),
  'pokemon-ponyta': new ViewStructure({
    label: 'Ponyta',
    unlocks: ['pokemon-rapidash'],
  }),
  'pokemon-rapidash': new ViewStructure({
    label: 'Rapidash',
    unlocks: ['pokemon-duskull'],
  }),
  'pokemon-duskull': new ViewStructure({
    label: 'Duskull',
    unlocks: ['pokemon-dusclops'],
  }),
  'pokemon-dusclops': new ViewStructure({
    label: 'Dusclops',
    unlocks: ['pokemon-bagon'],
  }),
  'pokemon-bagon': new ViewStructure({
    label: 'Bagon',
    unlocks: ['pokemon-shelgon'],
  }),
  'pokemon-shelgon': new ViewStructure({
    label: 'Shelgon',
    unlocks: ['pokemon-krabby'],
  }),
  'pokemon-krabby': new ViewStructure({
    label: 'Krabby',
    unlocks: ['pokemon-kingler'],
  }),
  'pokemon-kingler': new ViewStructure({
    label: 'Kingler',
    unlocks: ['pokemon-rival'],
  }),
  'pokemon-rival': new ViewStructure({
    label: 'Rival',
  }),
}

function is_answer(slug:Slug, answer:string) {
  const ans = hunt[slug].answer
  return (ans === undefined || ans.toUpperCase() === answer.toUpperCase())
}

class HuntState {
  // Whole state of the hunt
  private state: Record<Slug, PuzzleState>
  constructor() {
    this.state = {};
  }
  get_state(slug: string):PuzzleState {
    if (!this.state.hasOwnProperty(slug)) {
      this.state[slug] = {
        unlocked: false,
        solved: false,
        answers: []
      }
    }
    return this.state[slug];
  }
  get_vstate(slug: string): ViewState {
    const hstate = this.get_state(slug)
    const vstate = new ViewState(!hstate.solved)
    if (hstate.solved)
      vstate.answers.push(...hstate.answers)
    return vstate
  }
}

function resolve_round_data(slug: Slug, hunt_state: HuntState): ViewData {
  // Compute visible data for a given round
  const children: any[] = []
  Object.entries(hunt[slug].load_puzzles).forEach(([slug, value]) => {
    const hstate = hunt_state.get_state(slug)
    if (hstate.unlocked) {
      children.push({
        label: hunt[slug].label,
        slug: slug,
        state: hunt_state.get_vstate(slug),
        ...value,
      })
    }
  });
  const vstate = hunt_state.get_vstate(slug)
  // /start doesn't get an answer
  if (slug==="start")
    vstate.can_submit = false
  return {
    label: hunt[slug].label,
    state: vstate,
    children: children
  }
}


export class JsPuzzleEngine implements PuzzleEngine {
  hunt_state: HuntState
  _version: number
  callback: (n: number) => void
  constructor(callback: (n: number) => void) {
    this.callback = callback
    this.hunt_state = new HuntState();
    this._version = 0
    this.unlock_restart(true)
  }
  version() {
    return this._version
  }
  async unlocked(slug: Slug) {
    return this.hunt_state.get_state(slug).unlocked;
  }
  private async unlock(slug: Slug) {
    this.hunt_state.get_state(slug).unlocked = true;
  }
  async get_nav() {
    const result: NavEntry[] = []
    for (const i of [1, 2, 3]) {
      const rslug = `round${i}`
      if (!await this.unlocked(rslug)) continue;
      const puzzles = []
      for (const j of [1, 2]) {
        const slug = `puzz${i}_${j}`
        if (!await this.unlocked(slug)) continue;
        puzzles.push({
          label: hunt[slug].label,
          slug: slug,
          state: this.hunt_state.get_vstate(slug),
          children: []
        })
      }
      const r = {
        label: hunt[rslug].label,
        slug: rslug,
        state: this.hunt_state.get_vstate(rslug),
        children: puzzles
      }
      result.push(r)
    }
    const pokepuzz = []
    for (const slug of Object.keys(hunt)) {
      if (!slug.startsWith("pokemon-"))
        continue
      if (!await this.unlocked(slug)) continue;
      pokepuzz.push({
        label: hunt[slug].label,
        slug: slug,
        state: this.hunt_state.get_vstate(slug),
        children: []
      })
    }
    result.push({
      label: hunt['pokemon'].label,
      slug: 'pokemon',
      state: this.hunt_state.get_vstate('pokemon'),
      children: pokepuzz
    })
    return result
  }
  async get_data(slug: Slug) {
    if (slug==="pokemon") {
      const s = this.hunt_state.get_vstate(slug)
      const visible_stages: Stage[] = [];
      for (const stage of stages) {
        let battles: Battle[] = [];
        for (const battle of stage.battles) {
          if (await this.unlocked(battle.slug)) {
            const s = this.hunt_state.get_vstate(battle.slug)
            console.log("ANSWER:", s.answer_str())
            battles.push({
              ...battle,
              answer: s.answer_str(),
            })
            console.log("SO:", battles[battles.length-1].answer)
          }
        }
        if (battles.length > 0) {
          visible_stages.push({
            bg: stage.bg,
            battles: battles
          })
        }
      }
      return {
        label: hunt["pokemon"].label,
        state: s,
        stages: visible_stages,
      }
    }
    if (slug.startsWith("puzz") || slug.startsWith("pokemon-")) {
      const s = this.hunt_state.get_vstate(slug)
      return {
        label: hunt[slug].label,
        state: s,
      };
    }
    return resolve_round_data(slug, this.hunt_state);
  }
  async get_component(slug:Slug) {
    if (slug.startsWith("pokemon-")) {
      return {
        default: () => <div>The pokemon puzzles are hard-coded to this single div.</div>
      }
    }
    const mod = await import(/* webpackChunkName: "[request]" */ `../views/${slug}`)
    return mod
  }
  async submit(slug: Slug, value: string) {
    if (!is_answer(slug, value))
      return false
    const state = this.hunt_state.get_state(slug)
    state.solved = true;
    state.answers = [value];
    hunt[slug].unlocks.forEach(new_slug => this.unlock(new_slug))
    this.callback(++this._version)
    return true
  }
  unlock_all() {
    for (const slug of Object.keys(hunt)) {
      this.unlock(slug)
    }
    this.callback(++this._version)
  }
  unlock_restart(nocallback?:boolean) {
    for (const slug of Object.keys(hunt))
      this.hunt_state.get_state(slug).unlocked = false
    this.unlock("start")
    this.unlock("round1")
    this.unlock("puzz1_1")
    this.unlock("pokemon")
    this.unlock("pokemon-advertiser-trainer")
    for (const slug of Object.keys(hunt)) {
      if (this.hunt_state.get_state(slug).answers.length){
        this.unlock(slug)
        hunt[slug].unlocks.forEach(new_slug => this.unlock(new_slug))
      }
    }
    this._version = 0
    if (!nocallback)
      this.callback(this._version)
  }
}
