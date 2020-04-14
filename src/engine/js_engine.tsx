import { Slug, ViewState, NavEntry, ViewData, PuzzleEngine } from './interface';

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
       image: "/round1.man.png",
     },
     round2: {
       image: "/round2.plan.gif",
     },
     round3: {
       image: "/round3.canal.jpg",
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
  if (!slug.startsWith("round"))
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
    if (slug === "nav") return true;
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
    return result
  }
  async get_data(slug: Slug) {
    if (slug === 'nav') {
      // abuse the puzzle data mechanism to get the hack nav data
      const nav_data = await this.get_nav()
      return {
        label: "N/A",
        state: new ViewState(false),
        nav_entries: nav_data,
      }
    }
    if (slug.startsWith("puzz")) {
      const s = this.hunt_state.get_vstate(slug)
      return {
        label: hunt[slug].label,
        state: s,
      };
    }
    return resolve_round_data(slug, this.hunt_state);
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
