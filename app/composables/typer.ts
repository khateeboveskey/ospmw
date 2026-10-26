import gsap from 'gsap'

// Types a command like a terminal. The previous command is erased first, so text never swaps in one frame.
export function useTyper() {
  const typed = ref('')
  let tl: gsap.core.Timeline | null = null
  function type(text: string, delay = 0, fresh = false) {
    tl?.kill()
    if (fresh) typed.value = '' // entering a slide: it is still hidden
    const old = typed.value
    const o = { n: old.length }
    tl = gsap.timeline({ delay })
      .to(o, { n: 0, duration: Math.min(0.3, old.length * 0.012), ease: 'none', onUpdate: () => { typed.value = old.slice(0, Math.round(o.n)) } })
      .to(o, { n: text.length, duration: Math.min(1.2, text.length * 0.035), ease: 'none', onUpdate: () => { typed.value = text.slice(0, Math.round(o.n)) } })
  }
  onBeforeUnmount(() => tl?.kill())
  return { typed, type }
}
