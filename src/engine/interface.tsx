export type Slug = string

export class ViewState {
  can_submit: boolean
  answers: string[]
  constructor(can_submit: boolean) {
    this.can_submit = can_submit
    this.answers = []
  }
  has_answers() {
    return this.answers.length > 0
  }
  answer_str() {
    return this.answers.join(", ").toUpperCase()
  }
}

export interface NavEntry {
  label: string
  slug: Slug
  state: ViewState
  children: NavEntry[]
}

export interface ViewData extends Record<string, any> {
  label: string,
  state: ViewState,
}

// Weird things happen when you use useState with actual react components, so
// it's easier to return a module with .default and just use that.
export type ViewModule = {default:React.ComponentType<ViewProps>}

// To make the actual hunt we'd implement this interface as a wrapper around a
// server; to make the hunt playable after the fact, we'd reimplement the hunt
// in pure typescript.
export interface PuzzleEngine {
  submit(slug: Slug, answer: string): Promise<boolean>
  unlocked(slug: Slug): Promise<boolean>
  get_data<T>(slug: Slug): Promise<ViewData>
  get_nav(): Promise<NavEntry[]>
  get_component(slug: Slug): Promise<ViewModule>
  version(): number
}


export interface ViewProps {
  engine: PuzzleEngine,
  data: ViewData,
}
