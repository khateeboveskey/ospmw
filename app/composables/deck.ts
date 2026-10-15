// Shared deck state sync between the audience view, mirrors and presenter view.
export type DeckMsg =
  | { t: 'state'; i: number; s: number }
  | { t: 'cmd'; a: 'next' | 'prev' }
  | { t: 'go'; i: number; s: number }
  | { t: 'hello' }

export function useDeckChannel(onMsg: (m: DeckMsg) => void) {
  const ch = new BroadcastChannel('ospmw-deck')
  ch.onmessage = (e) => onMsg(e.data as DeckMsg)
  onBeforeUnmount(() => ch.close())
  return (m: DeckMsg) => ch.postMessage(m)
}
