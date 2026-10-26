export type GNode = { id: string; x: number; l: number; p?: string[]; t?: string; c?: string }
export type GStep = {
  add?: string[]; hide?: string[]; dim?: string[]; undim?: string[]
  pos?: Record<string, [number, number]>
  refs?: Record<string, string | null>
  head?: string
  cmd?: string; say?: string
}
// span: minimum [columns, lanes] to lay out, so graphs shown side by side share one scale
export type GraphDef = { title?: string; lanes: { name: string; color: string }[]; nodes: GNode[]; steps: GStep[]; dx?: number; dy?: number; span?: [number, number] }
