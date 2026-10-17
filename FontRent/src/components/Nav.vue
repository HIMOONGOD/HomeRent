<script setup>
import { computed, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useLanguage } from '../composables/useLanguage'

const route = useRoute()
const { language, t, toggleLanguage } = useLanguage()
const currentPage = computed(() => route.name)
const bookings = ref([])
const pendingBookingsCount = ref(0)
const favoriteIds = ref([])
const isMobileMenuOpen = ref(false)
const currentUser = {
    initials: 'G',
    name: 'Guest',
    role: 'guest',
}
const showAuthModal = ref(false)

function closeMobileMenu() {
    isMobileMenuOpen.value = false
}

</script>

<template>
    <div>
        <!-- MAIN APPLICATION NAVBAR -->
        <header
            class="bg-white/95 backdrop-blur border-b border-slate-200 sticky top-0 z-40"
            :class="{ 'myanmar-nav': language === 'my' }">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="h-16 flex items-center justify-between gap-3">
                <!-- Brand Logo -->
                <RouterLink to="/" @click="closeMobileMenu" class="flex items-center gap-2.5 text-left group shrink-0">
                    <div
                        class="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm group-hover:bg-emerald-700 transition">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                    </div>
                    <div>
                        <span class="font-display font-bold text-xl tracking-tight text-slate-900">Nest<span
                                class="text-emerald-600">Flow</span></span>
                        <span class="block text-[10px] font-medium uppercase tracking-widest text-slate-400 -mt-1">{{ t('brandTagline') }}</span>
                    </div>
                </RouterLink>

                <!-- Desktop Navigation Links -->
                <nav class="hidden  lg:flex items-center gap-1">
                    <RouterLink to="/" :aria-current="currentPage === 'home' ? 'page' : undefined"
                        :class="currentPage === 'home' ? 'text-emerald-600 bg-emerald-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'"
                        class="px-3.5 py-2 rounded-lg text-sm transition">{{ t('home') }}</RouterLink>
                    <RouterLink to="/explore" :aria-current="currentPage === 'explore' ? 'page' : undefined"
                        :class="currentPage === 'explore' ? 'text-emerald-600 bg-emerald-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'"
                        class="px-3.5 py-2 rounded-lg text-sm transition">{{ t('explore') }}</RouterLink>
                    <RouterLink to="/tenant" :aria-current="currentPage === 'tenant' ? 'page' : undefined"
                        :class="currentPage === 'tenant' ? 'text-emerald-600 bg-emerald-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'"
                        class="px-3.5 py-2 rounded-lg text-sm transition flex items-center gap-1.5">
                        {{ t('tenantHub') }}
                        <span v-if="bookings.length"
                            class="px-1.5 py-0.2 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">{{
                            bookings.length }}</span>
                    </RouterLink>
                    <RouterLink to="/landlord" :aria-current="currentPage === 'landlord' ? 'page' : undefined"
                        :class="currentPage === 'landlord' ? 'text-emerald-600 bg-emerald-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'"
                        class="px-3.5 py-2 rounded-lg text-sm transition flex items-center gap-1.5">
                        {{ t('landlordPortal') }}
                        <span v-if="pendingBookingsCount > 0"
                            class="px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold">{{
                            pendingBookingsCount }}</span>
                    </RouterLink>
                </nav>

                <!-- Right Actions: Saved, List Property CTA, Auth/Role -->
                <div class="hidden lg:flex items-center gap-2.5">
                    <button type="button" @click="toggleLanguage"
                        class="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50"
                        :aria-label="`${t('languageLabel')}: ${t('switchLanguage')}`">
                        {{ t('switchLanguage') }}
                    </button>
                    <RouterLink to="/saved" :aria-label="t('savedHomes')"
                        class="relative p-2 text-slate-600 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition"
                        :title="t('savedHomes')">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span v-if="favoriteIds.length"
                            class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">{{
                            favoriteIds.length }}</span>
                    </RouterLink>

                    <RouterLink to="/create"
                        class="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-sm transition">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                        {{ t('listYourHouse') }}
                    </RouterLink>

                    <button type="button" @click="showAuthModal = true"
                        class="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-slate-200 hover:border-slate-300 bg-slate-50 text-sm font-medium text-slate-700 transition">
                        <span
                            class="w-7 h-7 rounded-full bg-emerald-700 text-white text-xs font-bold flex items-center justify-center">{{
                            currentUser.initials }}</span>
                        <span class="hidden lg:inline">{{ t('guest') }}</span>
                        <span
                            class="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold uppercase">{{
                            t('guestRole') }}</span>
                    </button>
                </div>

                <div class="flex lg:hidden items-center gap-1">
                    <RouterLink to="/saved"
                        class="relative p-2 text-slate-600 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition"
                        :title="t('savedHomes')" :aria-label="t('savedHomes')">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span v-if="favoriteIds.length"
                            class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">{{
                            favoriteIds.length }}</span>
                    </RouterLink>
                    <button type="button" @click="toggleLanguage"
                        class="rounded-lg border border-slate-200 px-2.5 py-2 text-xs font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50"
                        :aria-label="`${t('languageLabel')}: ${t('switchLanguage')}`">
                        {{ t('switchLanguage') }}
                    </button>
                    <button type="button" @click="isMobileMenuOpen = !isMobileMenuOpen"
                        class="p-2 text-slate-600 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition"
                        :aria-expanded="isMobileMenuOpen" aria-controls="mobile-navigation"
                        :aria-label="isMobileMenuOpen ? t('closeMenu') : t('openMenu')">
                        <svg v-if="!isMobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        <svg v-else class="w-6 h-6" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                </div>

                <Transition name="mobile-menu" :duration="250">
                    <div v-if="isMobileMenuOpen" id="mobile-navigation" class="lg:hidden border-t border-slate-100 py-3">
                        <nav class="flex flex-col gap-1">
                            <RouterLink to="/" @click="closeMobileMenu"
                                :class="currentPage === 'home' ? 'text-emerald-700 bg-emerald-50 font-semibold' : 'text-slate-700 hover:bg-slate-50'"
                                class="w-full text-left px-3 py-2.5 rounded-lg text-sm transition">{{ t('home') }}</RouterLink>
                            <RouterLink to="/explore" @click="closeMobileMenu"
                                :class="currentPage === 'explore' ? 'text-emerald-700 bg-emerald-50 font-semibold' : 'text-slate-700 hover:bg-slate-50'"
                                class="w-full text-left px-3 py-2.5 rounded-lg text-sm transition">{{ t('explore') }}</RouterLink>
                            <RouterLink to="/tenant" @click="closeMobileMenu"
                                :class="currentPage === 'tenant' ? 'text-emerald-700 bg-emerald-50 font-semibold' : 'text-slate-700 hover:bg-slate-50'"
                                class="w-full flex items-center justify-between text-left px-3 py-2.5 rounded-lg text-sm transition">
                                {{ t('tenantHub') }}
                                <span v-if="bookings.length"
                                    class="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">{{ bookings.length }}</span>
                            </RouterLink>
                            <RouterLink to="/landlord" @click="closeMobileMenu"
                                :class="currentPage === 'landlord' ? 'text-emerald-700 bg-emerald-50 font-semibold' : 'text-slate-700 hover:bg-slate-50'"
                                class="w-full flex items-center justify-between text-left px-3 py-2.5 rounded-lg text-sm transition">
                                {{ t('landlordPortal') }}
                                <span v-if="pendingBookingsCount > 0"
                                    class="px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold">{{ pendingBookingsCount }}</span>
                            </RouterLink>
                        </nav>
                        <div class="mt-3 border-t border-slate-100 pt-3 flex flex-col gap-2">
                            <RouterLink to="/create" @click="closeMobileMenu"
                                class="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-sm transition">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                                </svg>
                                {{ t('listYourHouse') }}
                            </RouterLink>
                            <button type="button" @click="showAuthModal = true; isMobileMenuOpen = false"
                                class="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm font-medium text-slate-700 transition">
                                <span class="w-7 h-7 rounded-full bg-emerald-700 text-white text-xs font-bold flex items-center justify-center">
                                    {{ currentUser.initials }}
                                </span>
                                <span>{{ t('guest') }}</span>
                                <span class="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold uppercase">
                                    {{ t('guestRole') }}
                                </span>
                            </button>
                        </div>
                    </div>
                </Transition>
            </div>
        </header>
    </div>
</template>


<style scoped>
.myanmar-nav nav a,
.myanmar-nav > div > div > div > button,
.myanmar-nav #mobile-navigation a,
.myanmar-nav #mobile-navigation button {
    font-size: 0.75rem;
    line-height: 1.5;
}

.mobile-menu-enter-active,
.mobile-menu-leave-active {
    overflow: hidden;
}

.mobile-menu-enter-active {
    animation: mobile-menu-open 250ms ease both;
}

.mobile-menu-leave-active {
    animation: mobile-menu-close 250ms ease both;
}

@keyframes mobile-menu-open {
    from {
        max-height: 0;
        opacity: 0;
        transform: translateY(-0.5rem);
    }

    to {
        max-height: 24rem;
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes mobile-menu-close {
    from {
        max-height: 24rem;
        opacity: 1;
        transform: translateY(0);
    }

    to {
        max-height: 0;
        opacity: 0;
        transform: translateY(-0.5rem);
    }
}

@media (prefers-reduced-motion: reduce) {
    .mobile-menu-enter-active,
    .mobile-menu-leave-active {
        animation-duration: 1ms;
    }
}
</style>