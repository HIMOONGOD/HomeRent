
<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'
import { useLanguage } from '../composables/useLanguage'
import { usePointsBalance } from '../composables/usePointsBalance'
import { publishProperty } from '../data/properties'

const { t } = useLanguage()
const { pointsBalance, spendPoints } = usePointsBalance()
const duration = ref(1)
const photos = ref([])
const photoInput = ref(null)
const showSuccess = ref(false)
const errorMessage = ref('')

const form = ref({
    title: '',
    type: 'Apartment',
    purpose: 'For Rent',
    price: '',
    location: '',
    city: '',
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
    bedrooms: 1,
    bathrooms: 1,
    area: '',
    description: '',
})

const requiredPoints = computed(() => duration.value)
const remainingPoints = computed(
    () => pointsBalance.value - requiredPoints.value
)

const photoPreviews = computed(() =>
    photos.value.map((photo) => ({
        ...photo,
        url: photo.preview,
    }))
)

function openPhotoPicker() {
    photoInput.value?.click()
}

function handlePhotos(event) {
    const selectedFiles = Array.from(event.target.files || [])
    errorMessage.value = ''

    const availableSlots = 5 - photos.value.length

    for (const file of selectedFiles.slice(0, availableSlots)) {
        if (!file.type.startsWith('image/')) {
            errorMessage.value = t('addPropertyErrorImagesOnly')
            continue
        }

        if (file.size > 5 * 1024 * 1024) {
            errorMessage.value = t('addPropertyErrorImageSize')
            continue
        }

        photos.value.push({
            id: crypto.randomUUID(),
            file,
            preview: URL.createObjectURL(file),
        })
    }

    if (selectedFiles.length > availableSlots) {
        errorMessage.value = t('addPropertyErrorMaxPhotos')
    }

    // Allow the same file to be selected again after removing it.
    event.target.value = ''
}

function removePhoto(id) {
    const photo = photos.value.find((item) => item.id === id)

    if (photo) {
        URL.revokeObjectURL(photo.preview)
    }

    photos.value = photos.value.filter((item) => item.id !== id)
}

async function readPhoto(file) {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, 1400 / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Could not process the selected image.')
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    bitmap.close()
    return canvas.toDataURL('image/jpeg', 0.78)
}

async function submitProperty() {
    errorMessage.value = ''
    showSuccess.value = false

    if (
        !form.value.title.trim() ||
        !form.value.location.trim() ||
        !form.value.city.trim() ||
        !form.value.ownerName.trim() ||
        !form.value.ownerEmail.trim() ||
        !form.value.price ||
        !form.value.description.trim()
    ) {
        errorMessage.value = t('addPropertyErrorRequired')
        return
    }

    if (Number(form.value.price) <= 0) {
        errorMessage.value = t('addPropertyErrorPrice')
        return
    }

    if (photos.value.length < 1 || photos.value.length > 5) {
        errorMessage.value = t('addPropertyErrorPhotoCount')
        return
    }

    if (remainingPoints.value < 0) {
        errorMessage.value = t('addPropertyErrorPoints')
        return
    }

    let photoUrls
    try {
        photoUrls = await Promise.all(photos.value.map((photo) => readPhoto(photo.file)))
    } catch {
        errorMessage.value = 'Could not process these photos. Please choose different image files.'
        return
    }
    const now = new Date()
    now.setMonth(now.getMonth() + duration.value)
    const property = {
        id: Date.now(),
        title: form.value.title.trim(),
        category: form.value.type,
        city: form.value.city.trim(),
        neighborhood: form.value.location.trim(),
        description: form.value.description.trim(),
        descriptionMy: form.value.description.trim(),
        amenities: [],
        amenitiesMy: [],
        bedrooms: Number(form.value.bedrooms),
        bathrooms: Number(form.value.bathrooms),
        sqft: Number(form.value.area) || 0,
        monthlyPrice: Number(form.value.price),
        nightlyPrice: 0,
        rating: 0,
        reviewsCount: 0,
        leaseType: 'monthly',
        furnished: false,
        image: String(photoUrls[0]),
        photos: photoUrls.map(String),
        ownerName: form.value.ownerName.trim(),
        ownerEmail: form.value.ownerEmail.trim(),
        ownerPhone: form.value.ownerPhone.trim(),
        listingExpiresAt: now.toISOString(),
        isOwnerListing: true,
        purpose: 'For Rent',
        currency: 'MMK',
    }

    try {
        publishProperty(property)
    } catch {
        errorMessage.value = 'Could not save this listing in browser storage. Try fewer or smaller photos.'
        return
    }
    spendPoints(requiredPoints.value)
    showSuccess.value = true

    // Reset the form after the mock submission.
    form.value = {
        title: '',
        type: 'Apartment',
        purpose: 'For Rent',
        price: '',
        location: '',
        city: '',
        ownerName: '',
        ownerEmail: '',
        ownerPhone: '',
        bedrooms: 1,
        bathrooms: 1,
        area: '',
        description: '',
    }

    photos.value.forEach((photo) => URL.revokeObjectURL(photo.preview))
    photos.value = []
    duration.value = 1
}

onBeforeUnmount(() => {
    photos.value.forEach((photo) => URL.revokeObjectURL(photo.preview))
})
</script>

<template>
    <div class="min-h-screen bg-slate-50 py-8 sm:py-12">
        <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

            <!-- Header -->
            <div class="mb-8">
                <div class="mb-3 flex items-center gap-2 text-sm font-medium text-emerald-600">
                    <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
                    {{ t('addPropertySection') }}
                </div>

                <h1 class="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                    {{ t('addPropertyTitle') }}
                </h1>

                <p class="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                    {{ t('addPropertyDescription') }}
                </p>
            </div>

            <!-- Points summary -->
            <div class="mb-8 grid gap-4 sm:grid-cols-3">
                <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div class="flex items-center justify-between">
                        <p class="text-sm font-medium text-slate-500">{{ t('addPropertyAvailablePoints') }}</p>
                        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                                    d="M12 8c-1.7 0-3 .9-3 2s1.3 2 3 2 3 1 3 2-1.3 2-3 2m0-8V6m0 12v-2m9-4a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </div>
                    </div>
                    <p class="mt-3 text-3xl font-bold text-slate-900">
                        {{ pointsBalance }}
                        <span class="text-sm font-medium text-slate-400">{{ t('addPropertyPoints') }}</span>
                    </p>
                    <p class="mt-1 text-xs text-slate-500">{{ t('addPropertyDemoBalance') }}</p>
                </div>

                <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p class="text-sm font-medium text-slate-500">{{ t('addPropertyListingDuration') }}</p>
                    <p class="mt-3 text-3xl font-bold text-slate-900">
                        {{ duration }}
                        <span class="text-sm font-medium text-slate-400">
                            {{ duration === 1 ? t('addPropertyMonth') : t('addPropertyMonths') }}
                        </span>
                    </p>
                    <p class="mt-1 text-xs text-slate-500">{{ t('addPropertyPointsPerMonth') }}</p>
                </div>

                <div class="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
                    <p class="text-sm font-medium text-emerald-700">{{ t('addPropertyTotalCost') }}</p>
                    <p class="mt-3 text-3xl font-bold text-emerald-700">
                        {{ requiredPoints }}
                        <span class="text-sm font-medium text-emerald-600">{{ t('addPropertyPoints') }}</span>
                    </p>
                    <p class="mt-1 text-xs text-emerald-700">
                        {{ remainingPoints }} {{ t('addPropertyPoints') }} {{ t('addPropertyPointsRemaining') }}
                    </p>
                </div>
            </div>

            <!-- Success message -->
            <div
                v-if="showSuccess"
                class="mb-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800"
                role="status"
            >
                <svg class="mt-0.5 h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="m5 12 4 4L19 6" />
                </svg>
                <div>
                    <p class="font-semibold">{{ t('addPropertyPreviewCreated') }}</p>
                    <p class="mt-1 text-sm">
                        {{ t('addPropertyPreviewDemoNotice') }}
                    </p>
                </div>
                <button
                    type="button"
                    class="ml-auto text-emerald-700 hover:text-emerald-900"
                    :aria-label="t('addPropertyDismissSuccess')"
                    @click="showSuccess = false"
                >
                    ✕
                </button>
            </div>

            <!-- Form -->
            <form
                class="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px]"
                @submit.prevent="submitProperty"
            >
                <div class="space-y-8">

                    <!-- Basic information -->
                    <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
                        <div class="mb-6">
                            <h2 class="text-lg font-bold text-slate-900">{{ t('addPropertyBasicInformation') }}</h2>
                            <p class="mt-1 text-sm text-slate-500">
                                {{ t('addPropertyEssentialDetails') }}
                            </p>
                        </div>

                        <div class="space-y-5">
                            <div>
                                <label for="title" class="mb-2 block text-sm font-semibold text-slate-700">
                                    {{ t('addPropertyTitleLabel') }} <span class="text-rose-500">*</span>
                                </label>
                                <input
                                    id="title"
                                    v-model="form.title"
                                    type="text"
                                    maxlength="100"
                                    required
                                    :placeholder="t('addPropertyTitlePlaceholder')"
                                    class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                                />
                            </div>

                            <div class="grid gap-5 sm:grid-cols-2">
                                <div>
                                    <label for="purpose" class="mb-2 block text-sm font-semibold text-slate-700">
                                        {{ t('addPropertyPurpose') }}
                                    </label>
                                    <select
                                        id="purpose"
                                        v-model="form.purpose"
                                        class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                                    >
                                        <option value="For Rent">{{ t('addPropertyForRent') }}</option>
                                    </select>
                                </div>

                                <div>
                                    <label for="type" class="mb-2 block text-sm font-semibold text-slate-700">
                                        {{ t('addPropertyType') }}
                                    </label>
                                    <select
                                        id="type"
                                        v-model="form.type"
                                        class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                                    >
                                        <option value="Detached house">{{ t('detachedHouse') }}</option>
                                        <option value="Dormitory">{{ t('dormitory') }}</option>
                                        <option value="Apartment">{{ t('apartment') }}</option>
                                        <option value="Shop unit">{{ t('shopUnit') }}</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label for="price" class="mb-2 block text-sm font-semibold text-slate-700">
                                    {{ t('addPropertyPrice') }} <span class="text-rose-500">*</span>
                                </label>
                                <div class="flex overflow-hidden rounded-xl border border-slate-200 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10">
                                    <span class="flex items-center border-r border-slate-200 bg-slate-50 px-4 text-sm text-slate-500">
                                        MMK
                                    </span>
                                    <input
                                        id="price"
                                        v-model="form.price"
                                        type="number"
                                        min="1"
                                        required
                                        :placeholder="t('addPropertyEnterPrice')"
                                        class="min-w-0 flex-1 px-4 py-3 text-sm outline-none"
                                    />
                                </div>
                                <p class="mt-2 text-xs text-slate-400">
                                    {{ t('addPropertyPriceInKyat') }}
                                </p>
                            </div>
                        </div>
                    </section>

                    <!-- Location -->
                    <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
                        <div class="mb-6">
                            <h2 class="text-lg font-bold text-slate-900">{{ t('addPropertyLocationHeading') }}</h2>
                            <p class="mt-1 text-sm text-slate-500">
                                {{ t('addPropertyLocationHelp') }}
                            </p>
                        </div>

                        <label for="location" class="mb-2 block text-sm font-semibold text-slate-700">
                            {{ t('addPropertyFullAddress') }} <span class="text-rose-500">*</span>
                        </label>
                        <div class="flex items-center gap-3 rounded-xl border border-slate-200 px-4 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10">
                            <svg class="h-5 w-5 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                                    d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
                                <circle cx="12" cy="10" r="2.5" stroke-width="1.8" />
                            </svg>
                            <input
                                id="location"
                                v-model="form.location"
                                type="text"
                                required
                                :placeholder="t('addPropertyLocationPlaceholder')"
                                class="w-full py-3 text-sm outline-none placeholder:text-slate-400"
                            />
                        </div>
                        <label for="city" class="mb-2 mt-5 block text-sm font-semibold text-slate-700">City or town <span class="text-rose-500">*</span></label>
                        <input id="city" v-model="form.city" type="text" required placeholder="Enter any city or town" class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10" />
                    </section>

                    <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
                        <div class="mb-5"><h2 class="text-lg font-bold text-slate-900">Direct landlord contact</h2><p class="mt-1 text-sm text-slate-500">Renters contact you directly. No agent or commission.</p></div>
                        <div class="grid gap-5 sm:grid-cols-3">
                            <label class="block"><span class="mb-2 block text-sm font-semibold text-slate-700">Your name <span class="text-rose-500">*</span></span><input v-model="form.ownerName" type="text" autocomplete="name" required class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500" /></label>
                            <label class="block"><span class="mb-2 block text-sm font-semibold text-slate-700">Email <span class="text-rose-500">*</span></span><input v-model="form.ownerEmail" type="email" autocomplete="email" required class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500" /></label>
                            <label class="block"><span class="mb-2 block text-sm font-semibold text-slate-700">Phone</span><input v-model="form.ownerPhone" type="tel" autocomplete="tel" class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500" /></label>
                        </div>
                    </section>

                    <!-- Property features -->
                    <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
                        <div class="mb-6">
                            <h2 class="text-lg font-bold text-slate-900">{{ t('addPropertyFeatures') }}</h2>
                            <p class="mt-1 text-sm text-slate-500">
                                {{ t('addPropertyFeaturesHelp') }}
                            </p>
                        </div>

                        <div class="grid gap-5 sm:grid-cols-3">
                            <div>
                                <label for="bedrooms" class="mb-2 block text-sm font-semibold text-slate-700">
                                    {{ t('addPropertyBedrooms') }}
                                </label>
                                <select
                                    id="bedrooms"
                                    v-model.number="form.bedrooms"
                                    class="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-emerald-500"
                                >
                                    <option v-for="n in 11" :key="n" :value="n - 1">
                                        {{ n - 1 }}{{ n === 11 ? '+' : '' }}
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label for="bathrooms" class="mb-2 block text-sm font-semibold text-slate-700">
                                    {{ t('addPropertyBathrooms') }}
                                </label>
                                <select
                                    id="bathrooms"
                                    v-model.number="form.bathrooms"
                                    class="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-emerald-500"
                                >
                                    <option v-for="n in 11" :key="n" :value="n - 1">
                                        {{ n - 1 }}{{ n === 11 ? '+' : '' }}
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label for="area" class="mb-2 block text-sm font-semibold text-slate-700">
                                    {{ t('addPropertyArea') }}
                                </label>
                                <input
                                    id="area"
                                    v-model="form.area"
                                    type="number"
                                    min="0"
                                    :placeholder="t('addPropertyAreaPlaceholder')"
                                    class="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                                />
                            </div>
                        </div>

                        <div class="mt-6">
                            <label for="description" class="mb-2 block text-sm font-semibold text-slate-700">
                                {{ t('addPropertyDescriptionLabel') }} <span class="text-rose-500">*</span>
                            </label>
                            <textarea
                                id="description"
                                v-model="form.description"
                                rows="5"
                                maxlength="2000"
                                required
                                :placeholder="t('addPropertyDescriptionPlaceholder')"
                                class="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                            ></textarea>
                            <p class="mt-2 text-right text-xs text-slate-400">
                                {{ form.description.length }}/2000 {{ t('addPropertyCharacters') }}
                            </p>
                        </div>
                    </section>

                    <!-- Photo upload -->
                    <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
                        <div class="mb-6">
                            <h2 class="text-lg font-bold text-slate-900">{{ t('addPropertyPhotos') }}</h2>
                            <p class="mt-1 text-sm text-slate-500">
                                {{ t('addPropertyPhotoInstructions') }}
                            </p>
                        </div>

                        <input
                            ref="photoInput"
                            type="file"
                            accept="image/*"
                            multiple
                            class="hidden"
                            @change="handlePhotos"
                        />

                        <div
                            class="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center transition hover:border-emerald-400 hover:bg-emerald-50/50"
                            role="button"
                            tabindex="0"
                            @click="openPhotoPicker"
                            @keydown.enter.prevent="openPhotoPicker"
                            @keydown.space.prevent="openPhotoPicker"
                        >
                            <div class="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                                <svg class="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                                        d="M12 16V4m0 0L7 9m5-5 5 5M5 15v4a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-4" />
                                </svg>
                            </div>
                            <p class="text-sm font-semibold text-slate-800">
                                {{ t('addPropertyClickUpload') }}
                            </p>
                            <p class="mt-2 text-xs text-slate-500">
                                {{ photos.length }} {{ t('addPropertyPhotosSelected') }}
                            </p>
                            <span class="mt-4 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm ring-1 ring-slate-200">
                                {{ t('addPropertyChooseImages') }}
                            </span>
                        </div>

                        <div v-if="photos.length" class="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
                            <div
                                v-for="(photo, index) in photoPreviews"
                                :key="photo.id"
                                class="group relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-100"
                            >
                                <img
                                    :src="photo.url"
                                    :alt="`${t('addPropertyPhotoAlt')} ${index + 1}`"
                                    class="h-full w-full object-cover"
                                />
                                <span
                                    v-if="index === 0"
                                    class="absolute bottom-2 left-2 rounded-md bg-slate-900/75 px-2 py-1 text-xs font-medium text-white"
                                >
                                    {{ t('addPropertyCoverPhoto') }}
                                </span>
                                <button
                                    type="button"
                                    class="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow transition hover:bg-rose-500 hover:text-white"
                                    :aria-label="`${t('addPropertyRemovePhoto')} ${index + 1}`"
                                    @click="removePhoto(photo.id)"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    </section>
                </div>

                <!-- Right sidebar -->
                <aside class="space-y-5 lg:sticky lg:top-6">
                    <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div class="mb-5 flex items-center gap-3">
                            <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                                        d="M12 8c-1.7 0-3 .9-3 2s1.3 2 3 2 3 1 3 2-1.3 2-3 2m0-8V6m0 12v-2m9-4a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            </div>
                            <div>
                                <h2 class="font-bold text-slate-900">{{ t('addPropertyListingDuration') }}</h2>
                                <p class="text-xs text-slate-500">{{ t('addPropertyChooseDuration') }}</p>
                            </div>
                        </div>

                        <div class="rounded-xl bg-slate-50 p-4">
                            <div class="flex items-end justify-between">
                                <span class="text-sm text-slate-500">{{ t('addPropertyDuration') }}</span>
                                <span class="text-xl font-bold text-slate-900">
                                    {{ duration }}
                                    <span class="text-sm font-medium text-slate-500">
                                        {{ duration === 1 ? t('addPropertyMonth') : t('addPropertyMonths') }}
                                    </span>
                                </span>
                            </div>

                            <input
                                v-model.number="duration"
                                type="range"
                                min="1"
                                max="12"
                                step="1"
                                class="mt-5 w-full cursor-pointer accent-emerald-500"
                                :aria-label="t('addPropertyDurationInMonths')"
                            />

                            <div class="mt-2 flex justify-between text-xs text-slate-400">
                                <span>1 {{ t('addPropertyMonth') }}</span>
                                <span>12 {{ t('addPropertyMonths') }}</span>
                            </div>
                        </div>

                        <div class="mt-5 space-y-3">
                            <div class="flex justify-between text-sm">
                                <span class="text-slate-500">{{ t('addPropertyPointsPerMonthLabel') }}</span>
                                <span class="font-semibold text-slate-800">{{ t('addPropertyOnePoint') }}</span>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span class="text-slate-500">{{ t('addPropertyTotalCost') }}</span>
                                <span class="font-bold text-emerald-700">
                                    {{ requiredPoints }} {{ t('addPropertyPoints') }}
                                </span>
                            </div>
                            <div class="border-t border-slate-100 pt-3">
                                <div class="flex justify-between text-sm">
                                    <span class="text-slate-500">{{ t('addPropertyRemainingBalance') }}</span>
                                    <span
                                        class="font-bold"
                                        :class="remainingPoints < 0 ? 'text-rose-600' : 'text-slate-900'"
                                    >
                                        {{ remainingPoints }} {{ t('addPropertyPoints') }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <p class="mt-5 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">
                            {{ t('addPropertyDemoBalanceNotice') }}
                        </p>
                    </section>

                    <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 class="font-bold text-slate-900">{{ t('addPropertyBeforePublishing') }}</h3>
                        <ul class="mt-4 space-y-3 text-sm text-slate-600">
                            <li class="flex items-start gap-2">
                                <span class="mt-0.5 text-emerald-600">✓</span>
                                {{ t('addPropertyAccurateTitle') }}
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="mt-0.5 text-emerald-600">✓</span>
                                {{ t('addPropertyClearLocationPrice') }}
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="mt-0.5 text-emerald-600">✓</span>
                                {{ t('addPropertyClearPhotos') }}
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="mt-0.5 text-emerald-600">✓</span>
                                {{ t('addPropertyCheckDurationCost') }}
                            </li>
                        </ul>
                    </section>

                    <div
                        v-if="errorMessage"
                        class="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"
                        role="alert"
                    >
                        {{ errorMessage }}
                    </div>

                    <button
                        type="submit"
                        :disabled="remainingPoints < 0"
                        class="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                    >
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                                d="M12 5v14m-7-7h14" />
                        </svg>
                        Publish rental listing
                    </button>

                    <p class="text-center text-xs leading-5 text-slate-400">
                        {{ t('addPropertyFrontendDemoOnly') }}
                    </p>
                </aside>
            </form>

            <footer class="mt-10 border-t border-slate-200 pt-6 text-center text-xs text-slate-400">
                {{ t('addPropertyFooter') }}
            </footer>
        </div>
    </div>
</template>
