export function getStrongestInfluences(lr) {
  const influences = []

  for (const [dxId, value] of Object.entries(lr)) {
    if (value >= 3.0) {
      influences.push({ dxId, arrows: '\u2191\u2191\u2191', direction: 'up', strength: 3 })
    } else if (value >= 2.0) {
      influences.push({ dxId, arrows: '\u2191\u2191', direction: 'up', strength: 2 })
    } else if (value > 1.3) {
      influences.push({ dxId, arrows: '\u2191', direction: 'up', strength: 1 })
    } else if (value <= 0.15) {
      influences.push({ dxId, arrows: '\u2193\u2193\u2193', direction: 'down', strength: 3 })
    } else if (value <= 0.3) {
      influences.push({ dxId, arrows: '\u2193\u2193', direction: 'down', strength: 2 })
    } else if (value < 0.8) {
      influences.push({ dxId, arrows: '\u2193', direction: 'down', strength: 1 })
    }
  }

  influences.sort((a, b) => {
    if (a.direction !== b.direction) return a.direction === 'up' ? -1 : 1
    return b.strength - a.strength
  })

  return influences
}

export function getInfluenceColor(inf) {
  if (inf.direction === 'up') {
    if (inf.strength >= 3) return 'text-green-300 font-semibold'
    if (inf.strength >= 2) return 'text-green-400'
    return 'text-green-500'
  }
  if (inf.strength >= 3) return 'text-red-300 font-semibold'
  if (inf.strength >= 2) return 'text-red-400'
  return 'text-red-500'
}

export function getSingleInfluence(lrValue) {
  if (lrValue >= 3.0) {
    return { arrows: '\u2191\u2191\u2191', direction: 'up', strength: 3 }
  } else if (lrValue >= 2.0) {
    return { arrows: '\u2191\u2191', direction: 'up', strength: 2 }
  } else if (lrValue > 1.3) {
    return { arrows: '\u2191', direction: 'up', strength: 1 }
  } else if (lrValue <= 0.15) {
    return { arrows: '\u2193\u2193\u2193', direction: 'down', strength: 3 }
  } else if (lrValue <= 0.3) {
    return { arrows: '\u2193\u2193', direction: 'down', strength: 2 }
  } else if (lrValue < 0.8) {
    return { arrows: '\u2193', direction: 'down', strength: 1 }
  } else {
    return { arrows: '\u2014', direction: 'neutral', strength: 0 }
  }
}

export function getSingleInfluenceColor(inf) {
  if (inf.direction === 'neutral') return 'text-gray-500'
  return getInfluenceColor(inf)
}
