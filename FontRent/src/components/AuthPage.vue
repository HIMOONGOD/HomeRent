<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useLanguage } from '../composables/useLanguage'

const props = defineProps<{ mode: 'login' | 'register' }>()
const { t } = useLanguage()
const isRegister = computed(() => props.mode === 'register')
const email = ref('')
const password = ref('')
const fullName = ref('')
const showPassword = ref(false)
const acceptedTerms = ref(false)
const notice = ref('')

function submitForm() {
  notice.value = isRegister.value
    ? `Thanks${fullName.value ? `, ${fullName.value.split(' ')[0]}` : ''}! Account creation is ready to connect to an authentication service.`
    : 'Your sign-in form is ready to connect to an authentication service.'
}
</script>

<template>
  <main class="auth-page min-h-[calc(100vh-4rem)] bg-[#f7f8f5] px-4 py-8 sm:px-6 lg:px-8">
    <div class="mx-auto grid min-h-[min(760px,calc(100vh-8rem))] max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_90px_-35px_rgba(15,40,31,.22)] lg:grid-cols-[1.02fr_.98fr]">
      <section class="auth-visual relative hidden min-h-[680px] overflow-hidden bg-[#17271f] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
        <img class="absolute inset-0 h-full w-full object-cover opacity-65" src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85" alt="Sunlit, thoughtfully designed home interior" />
        <div class="absolute inset-0 bg-gradient-to-b from-[#14261f]/55 via-[#14261f]/10 to-[#14261f]/90"></div>
        <RouterLink to="/" class="relative z-10 flex w-fit items-center gap-2.5 text-left">
          <span class="grid h-10 w-10 place-items-center rounded-xl bg-emerald-600 text-white shadow-sm">
            <svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0 7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6m-6 0v-4a1 1 0 011-1h2a1 1 0 011 1v4" /></svg>
          </span>
          <span><span class="font-display text-xl font-bold tracking-tight">Nest<span class="text-emerald-600">Flow</span></span><span class="-mt-1 block text-[10px] font-medium uppercase tracking-widest text-white/70">{{ t('brandTagline') }}</span></span>
        </RouterLink>
        <div class="relative z-10 max-w-lg pb-4">
          <div class="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-medium backdrop-blur-sm"><span class="h-1.5 w-1.5 rounded-full bg-[#c7ee85]"></span> A better way to find your place</div>
          <h2 class="font-display text-4xl font-semibold leading-[1.12] tracking-tight xl:text-5xl">Come home to<br />something <span class="text-[#c7ee85]">wonderful.</span></h2>
          <p class="mt-5 max-w-md text-sm leading-6 text-white/75">Thoughtful spaces, trusted hosts, and a fresh start that feels like you.</p>
          <div class="mt-9 flex items-center gap-3">
            <div class="flex -space-x-2"><img v-for="(avatar, i) in ['photo-1534528741775-53994a69daeb','photo-1500648767791-00dcc994a43e','photo-1531123897727-8f129e1688ce']" :key="avatar" :src="`https://images.unsplash.com/${avatar}?auto=format&fit=crop&w=80&h=80&q=80`" :alt="`NestFlow member ${i+1}`" class="h-9 w-9 rounded-full border-2 border-[#36453d] object-cover" /></div>
            <div><div class="flex gap-0.5 text-[#d8f3a5]" aria-label="Rated 5 out of 5">★★★★★</div><p class="text-xs text-white/75">Loved by renters finding their next chapter</p></div>
          </div>
        </div>
        <div class="relative z-10 flex items-center justify-between text-xs text-white/65"><span>Good places. Good beginnings.</span><span>NestFlow</span></div>
      </section>

      <section class="flex items-center justify-center px-2 py-7 sm:px-8 sm:py-10 lg:px-12 xl:px-16">
        <div class="w-full max-w-[410px]">
          <div class="mb-9 flex items-center justify-between lg:hidden">
            <RouterLink to="/" class="flex items-center gap-2.5 text-left"><span class="grid h-10 w-10 place-items-center rounded-xl bg-emerald-600 text-white shadow-sm"><svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0 7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1-1h-3m-6 0h6m-6 0v-4a1 1 0 011-1h2a1 1 0 011 1v4" /></svg></span><span><span class="font-display text-xl font-bold tracking-tight text-slate-900">Nest<span class="text-emerald-600">Flow</span></span><span class="-mt-1 block text-[10px] font-medium uppercase tracking-widest text-slate-400">{{ t('brandTagline') }}</span></span></RouterLink>
            <span class="rounded-full bg-[#f0f5e9] px-3 py-1 text-[11px] font-semibold text-[#49633b]">FIND YOUR PLACE</span>
          </div>
          <div class="mb-8">
            <p class="mb-3 text-xs font-bold uppercase tracking-[.17em] text-[#628150]">{{ isRegister ? 'A fresh start' : 'Welcome back' }}</p>
            <h1 class="font-display text-3xl font-semibold tracking-tight text-[#1e2b23] sm:text-[2.1rem]">{{ isRegister ? 'Find your place.' : 'Good to see you.' }}</h1>
            <p class="mt-2 text-sm leading-6 text-slate-500">{{ isRegister ? 'Create an account and make yourself at home.' : 'Sign in to pick up where you left off.' }}</p>
          </div>

          <form class="space-y-4" @submit.prevent="submitForm">
            <label v-if="isRegister" class="block"><span class="mb-1.5 block text-xs font-semibold text-slate-700">Full name</span><span class="relative block"><svg class="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="8" r="4"/><path stroke-linecap="round" d="M4 21a8 8 0 0 1 16 0"/></svg><input v-model="fullName" autocomplete="name" required type="text" placeholder="Your name" class="auth-input" /></span></label>
            <label class="block"><span class="mb-1.5 block text-xs font-semibold text-slate-700">Email address</span><span class="relative block"><svg class="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="5" width="18" height="14" rx="2"/><path stroke-linecap="round" stroke-linejoin="round" d="m4 7 8 6 8-6"/></svg><input v-model="email" autocomplete="email" required type="email" placeholder="you@example.com" class="auth-input" /></span></label>
            <label class="block"><span class="mb-1.5 block text-xs font-semibold text-slate-700">Password</span><span class="relative block"><svg class="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="4" y="10" width="16" height="11" rx="2"/><path stroke-linecap="round" d="M8 10V7a4 4 0 1 1 8 0v3"/></svg><input v-model="password" autocomplete="current-password" required :minlength="isRegister ? 8 : 1" :type="showPassword ? 'text' : 'password'" :placeholder="isRegister ? 'At least 8 characters' : 'Enter your password'" class="auth-input pr-14" /><button type="button" class="absolute inset-y-0 right-3 flex items-center px-1 text-xs font-semibold text-slate-500 hover:text-[#315d3e]" :aria-label="showPassword ? 'Hide password' : 'Show password'" @click="showPassword = !showPassword">{{ showPassword ? 'Hide' : 'Show' }}</button></span></label>
            <div v-if="!isRegister" class="flex items-center justify-between pt-0.5"><label class="flex cursor-pointer items-center gap-2 text-xs text-slate-600"><input type="checkbox" class="h-3.5 w-3.5 rounded border-slate-300 accent-[#315d3e]" /> Remember me</label><button type="button" class="text-xs font-semibold text-[#315d3e] hover:underline" @click="notice = 'Please contact support to reset your password.'">Forgot password?</button></div>
            <label v-else class="flex cursor-pointer items-start gap-2.5 pt-1 text-xs leading-5 text-slate-500"><input v-model="acceptedTerms" required type="checkbox" class="mt-1 h-3.5 w-3.5 shrink-0 rounded border-slate-300 accent-[#315d3e]" /><span>I agree to the <a href="#terms" class="font-semibold text-[#315d3e] underline underline-offset-2">Terms of Service</a> and <a href="#privacy" class="font-semibold text-[#315d3e] underline underline-offset-2">Privacy Policy</a>.</span></label>
            <button type="submit" class="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#234c36] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_8px_18px_-9px_rgba(35,76,54,.7)] transition hover:-translate-y-0.5 hover:bg-[#193b2a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#234c36]">{{ isRegister ? 'Create my account' : 'Sign in' }}<svg class="h-4 w-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-6-6 6 6-6 6"/></svg></button>
            <p v-if="notice" role="status" class="rounded-xl border border-[#dbe9d1] bg-[#f3f8ef] px-3.5 py-3 text-xs leading-5 text-[#3d6139]">{{ notice }}</p>
          </form>

          <p class="mt-7 text-center text-sm text-slate-500">{{ isRegister ? 'Already have an account?' : 'New to NestFlow?' }} <RouterLink :to="isRegister ? '/login' : '/register'" class="font-semibold text-[#315d3e] hover:underline">{{ isRegister ? 'Sign in' : 'Create an account' }}</RouterLink></p>
          <RouterLink to="/" class="mx-auto mt-7 flex w-fit items-center gap-1.5 text-xs font-medium text-slate-400 transition hover:text-slate-700"><svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="m15 18-6-6 6-6M9 12h12"/></svg>Back to exploring homes</RouterLink>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.auth-input { width: 100%; border: 1px solid #e2e8e5; border-radius: .75rem; background: #fff; padding: .78rem .85rem .78rem 2.75rem; color: #1e2b23; font-size: .875rem; outline: none; transition: border-color .18s, box-shadow .18s; }
.auth-input::placeholder { color: #a0aaa4; }
.auth-input:focus { border-color: #61836b; box-shadow: 0 0 0 3px rgb(97 131 107 / 13%); }
.auth-visual img { animation: settle 1s ease-out both; }
@keyframes settle { from { transform: scale(1.035); opacity: .45; } to { transform: scale(1); opacity: .65; } }
@media (prefers-reduced-motion: reduce) { .auth-visual img { animation: none; } }
</style>
