export type GNode = { id: string; x: number; l: number; p?: string[]; t?: string; c?: string }
export type GStep = {
  add?: string[]; hide?: string[]; dim?: string[]; undim?: string[]
  pos?: Record<string, [number, number]>
  refs?: Record<string, string | null>
  head?: string
  cmd?: string; say?: string
}
export type GraphDef = { title?: string; lanes: { name: string; color: string }[]; nodes: GNode[]; steps: GStep[]; dx?: number; dy?: number }
