import { ref } from 'vue'

const storageKey = 'fontrent-demo-points'
const pointsBalance = ref(10)
let hasLoaded = false

function loadBalance() {
  if (hasLoaded || typeof window === 'undefined') return
  hasLoaded = true
  const savedValue = window.localStorage.getItem(storageKey)
  if (savedValue === null) return
  const savedBalance = Number(savedValue)
  if (Number.isFinite(savedBalance) && savedBalance >= 0) pointsBalance.value = savedBalance
}

export function usePointsBalance() {
  loadBalance()

  function spendPoints(amount: number) {
    if (amount < 0 || pointsBalance.value < amount) return false
    pointsBalance.value -= amount
    if (typeof window !== 'undefined') window.localStorage.setItem(storageKey, String(pointsBalance.value))
    return true
  }

  return { pointsBalance, spendPoints }
}
