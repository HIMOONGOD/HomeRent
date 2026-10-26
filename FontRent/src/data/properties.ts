import { reactive } from 'vue'

export type LeaseType = 'monthly' | 'short'

export interface Property {
  id: number
  title: string
  category: string
  city: string
  neighborhood: string
  description: string
  descriptionMy: string
  amenities: string[]
  amenitiesMy: string[]
  bedrooms: number
  bathrooms: number
  sqft: number
  monthlyPrice: number
  nightlyPrice: number
  rating: number
  reviewsCount: number
  leaseType: LeaseType
  furnished: boolean
  image: string
  photos?: string[]
  ownerName?: string
  ownerEmail?: string
  ownerPhone?: string
  listingExpiresAt?: string
  isOwnerListing?: boolean
  purpose?: 'For Rent' | 'For Sale'
  currency?: 'USD' | 'MMK'
}

const sampleProperties: Property[] = [
  {
    id: 1,
    title: 'The Fern House',
    category: 'Detached house',
    city: 'Yangon',
    neighborhood: 'Mayangone',
    description: 'A light-filled garden villa with generous living spaces, a quiet neighborhood setting, and room for the whole family.',
    descriptionMy: 'အလင်းရောင်ကောင်းစွာရရှိပြီး ဥယျာဉ်ပါဝင်သော ဗီလာဖြစ်ကာ မိသားစုတစ်စုလုံးအတွက် ကျယ်ဝန်းသောနေထိုင်ခန်းများ ပါဝင်သည်။',
    amenities: ['Private garden', 'Air conditioning', 'Furnished', 'On-site parking'],
    amenitiesMy: ['သီးသန့်ဥယျာဉ်', 'လေအေးပေးစက်', 'ပရိဘောဂပါ', 'ကားပါကင်'],
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2480,
    monthlyPrice: 2400,
    nightlyPrice: 185,
    rating: 4.98,
    reviewsCount: 24,
    leaseType: 'monthly',
    furnished: true,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=85',
  },
  {
    id: 2,
    title: 'Skyline Riverside Suite',
    category: 'Apartment',
    city: 'Singapore',
    neighborhood: 'Robertson Quay',
    description: 'A contemporary riverside penthouse close to the city, with an open-plan interior and easy access to dining and transit.',
    descriptionMy: 'မြို့အနီးရှိ ခေတ်မီမြစ်ကမ်းဘေး ပင့်ဟောက်စ်ဖြစ်ပြီး ကျယ်ဝန်းသောအတွင်းပိုင်းနှင့် စားသောက်ဆိုင်၊ သယ်ယူပို့ဆောင်ရေးများသို့ သွားလာရလွယ်ကူသည်။',
    amenities: ['River views', 'Air conditioning', 'Furnished', 'Building security'],
    amenitiesMy: ['မြစ်ရှုခင်း', 'လေအေးပေးစက်', 'ပရိဘောဂပါ', 'အဆောက်အအုံလုံခြုံရေး'],
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1260,
    monthlyPrice: 3900,
    nightlyPrice: 260,
    rating: 4.92,
    reviewsCount: 18,
    leaseType: 'short',
    furnished: true,
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=85',
  },
  {
    id: 3,
    title: 'Garden Lane Family Home',
    category: 'Detached house',
    city: 'Mandalay',
    neighborhood: 'Chanayethazan',
    description: 'A comfortable family home on a peaceful residential street, with flexible rooms and a practical layout for everyday living.',
    descriptionMy: 'အေးချမ်းသော လူနေရပ်ကွက်လမ်းပေါ်ရှိ သက်သောင့်သက်သာ မိသားစုအိမ်ဖြစ်ပြီး နေ့စဉ်ဘဝအတွက် အဆင်ပြေသော အခန်းဖွဲ့စည်းပုံ ပါဝင်သည်။',
    amenities: ['Family-friendly layout', 'Private outdoor space', 'On-site parking', 'Near local shops'],
    amenitiesMy: ['မိသားစုနေထိုင်ရန် သင့်တော်သောဖွဲ့စည်းပုံ', 'သီးသန့်အပြင်ဘက်နေရာ', 'ကားပါကင်', 'ဒေသတွင်းဆိုင်များအနီး'],
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1850,
    monthlyPrice: 1450,
    nightlyPrice: 110,
    rating: 4.89,
    reviewsCount: 31,
    leaseType: 'monthly',
    furnished: false,
    image: 'https://images.unsplash.com/photo-1600047550582-2f7d865e0f54?auto=format&fit=crop&w=1000&q=85',
  },
  {
    id: 4,
    title: 'Old Town Loft',
    category: 'Apartment',
    city: 'Chiang Mai',
    neighborhood: 'Old City',
    description: 'A thoughtfully furnished loft tucked into Chiang Mai’s Old City, close to local cafes, markets, and cultural landmarks.',
    descriptionMy: 'ချင်းမိုင်မြို့ဟောင်းအတွင်းရှိ ပရိဘောဂပြည့်စုံသော အိမ်ဖြစ်ပြီး ဒေသတွင်းကဖေးများ၊ ဈေးများနှင့် ယဉ်ကျေးမှုအထင်ကရနေရာများအနီးတွင် တည်ရှိသည်။',
    amenities: ['Walkable location', 'Air conditioning', 'Furnished', 'Fast Wi-Fi'],
    amenitiesMy: ['လမ်းလျှောက်သွားလာရန် အဆင်ပြေသောနေရာ', 'လေအေးပေးစက်', 'ပရိဘောဂပါ', 'မြန်နှုန်းမြင့် Wi-Fi'],
    bedrooms: 1,
    bathrooms: 1,
    sqft: 720,
    monthlyPrice: 980,
    nightlyPrice: 72,
    rating: 4.96,
    reviewsCount: 42,
    leaseType: 'short',
    furnished: true,
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85',
  },
  {
    id: 5,
    title: 'Quiet Courtyard Villa',
    category: 'Detached house',
    city: 'Yangon',
    neighborhood: 'Bahan',
    description: 'A private villa with a calm courtyard, spacious bedrooms, and a welcoming layout for longer stays.',
    descriptionMy: 'အေးချမ်းသော ခြံဝင်းနှင့် ကျယ်ဝန်းသောအိပ်ခန်းများ ပါဝင်သည့် သီးသန့်ဗီလာဖြစ်ပြီး ရေရှည်နေထိုင်ရန် သင့်တော်သည်။',
    amenities: ['Private courtyard', 'Air conditioning', 'Furnished', 'On-site parking'],
    amenitiesMy: ['သီးသန့်ခြံဝင်း', 'လေအေးပေးစက်', 'ပရိဘောဂပါ', 'ကားပါကင်'],
    bedrooms: 3,
    bathrooms: 3,
    sqft: 2110,
    monthlyPrice: 3200,
    nightlyPrice: 220,
    rating: 4.94,
    reviewsCount: 16,
    leaseType: 'monthly',
    furnished: true,
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=85',
  },
  {
    id: 6,
    title: 'The Cedar Residence',
    category: 'Detached house',
    city: 'Chiang Mai',
    neighborhood: 'Nimman',
    description: 'A roomy, modern residence in the lively Nimman area, offering comfortable indoor space close to neighborhood favorites.',
    descriptionMy: 'နိမန်ရပ်ကွက်၏ စည်ကားသောနေရာတွင်ရှိသည့် ခေတ်မီကျယ်ဝန်းသောအိမ်ဖြစ်ပြီး လူကြိုက်များသည့် နေရာများနှင့်လည်း နီးကပ်သည်။',
    amenities: ['Near cafes and shops', 'Air conditioning', 'Furnished', 'Family-friendly layout'],
    amenitiesMy: ['ကဖေးနှင့်ဆိုင်များအနီး', 'လေအေးပေးစက်', 'ပရိဘောဂပါ', 'မိသားစုနေထိုင်ရန် သင့်တော်သောဖွဲ့စည်းပုံ'],
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2320,
    monthlyPrice: 2800,
    nightlyPrice: 195,
    rating: 4.9,
    reviewsCount: 21,
    leaseType: 'short',
    furnished: true,
    image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1000&q=85',
  },
  {
    id: 7,
    title: 'Inya Lake Garden Residence',
    category: 'Detached house',
    city: 'Yangon',
    neighborhood: 'Yankin',
    description: 'A peaceful modern home near Inya Lake, with bright living spaces, a private garden, and room to unwind.',
    descriptionMy: 'အင်းလျားကန်အနီးရှိ အေးချမ်းသော ခေတ်မီအိမ်ဖြစ်ပြီး အလင်းရောင်ကောင်းသော နေထိုင်ခန်းများ၊ သီးသန့်ဥယျာဉ်နှင့် အနားယူရန် နေရာကျယ်များ ပါဝင်သည်။',
    amenities: ['Private garden', 'Air conditioning', 'Furnished', 'On-site parking'],
    amenitiesMy: ['သီးသန့်ဥယျာဉ်', 'လေအေးပေးစက်', 'ပရိဘောဂပါ', 'ကားပါကင်'],
    bedrooms: 3,
    bathrooms: 3,
    sqft: 2050,
    monthlyPrice: 2950,
    nightlyPrice: 210,
    rating: 4.93,
    reviewsCount: 19,
    leaseType: 'monthly',
    furnished: true,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=85',
    photos: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=85',
    ],
  },
  {
    id: 8,
    title: 'Mandalay Palace View House',
    category: 'Detached house',
    city: 'Mandalay',
    neighborhood: 'Aungmyethazan',
    description: 'A spacious family home with a welcoming interior, a leafy outdoor area, and convenient access to the city.',
    descriptionMy: 'မိသားစုအတွက် ကျယ်ဝန်းသောအိမ်ဖြစ်ပြီး နွေးထွေးသည့် အတွင်းပိုင်း၊ သစ်ပင်စိမ်းလန်းသော အပြင်ဘက်နေရာနှင့် မြို့တွင်းသွားလာရန် အဆင်ပြေမှုတို့ ပါဝင်သည်။',
    amenities: ['Family-friendly layout', 'Private outdoor space', 'Air conditioning', 'Near local shops'],
    amenitiesMy: ['မိသားစုနေထိုင်ရန် သင့်တော်သောဖွဲ့စည်းပုံ', 'သီးသန့်အပြင်ဘက်နေရာ', 'လေအေးပေးစက်', 'ဒေသတွင်းဆိုင်များအနီး'],
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2380,
    monthlyPrice: 1850,
    nightlyPrice: 135,
    rating: 4.91,
    reviewsCount: 14,
    leaseType: 'short',
    furnished: true,
    image: 'https://images.unsplash.com/photo-1600047550582-2f7d865e0f54?auto=format&fit=crop&w=1000&q=85',
    photos: [
      'https://images.unsplash.com/photo-1600047550582-2f7d865e0f54?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85',
    ],
  },
]

const storageKey = 'fontrent-listings'
const hiddenStorageKey = 'fontrent-hidden-listings'
function loadHiddenIds(): number[] {
  if (typeof window === 'undefined') return []
  try {
    const saved = JSON.parse(window.localStorage.getItem(hiddenStorageKey) || '[]') as number[]
    return Array.isArray(saved) ? saved.filter((id) => Number.isFinite(id)) : []
  } catch {
    return []
  }
}

function loadOwnerListings(): Property[] {
  if (typeof window === 'undefined') return []
  try {
    const saved = JSON.parse(window.localStorage.getItem(storageKey) || '[]') as Property[]
    const hiddenIds = new Set(loadHiddenIds())
    return Array.isArray(saved) ? saved.filter((item) => item && item.isOwnerListing && !hiddenIds.has(item.id)) : []
  } catch {
    return []
  }
}

const hiddenIdsAtStart = new Set(loadHiddenIds())
export const properties = reactive<Property[]>([
  ...sampleProperties.filter((item) => !hiddenIdsAtStart.has(item.id)),
  ...loadOwnerListings(),
])

export function publishProperty(property: Property) {
  const ownerListings = properties.filter((item) => item.isOwnerListing)
  window.localStorage.setItem(storageKey, JSON.stringify([property, ...ownerListings]))
  properties.unshift(property)
}

export function removeProperty(id: number) {
  const property = properties.find((item) => item.id === id)
  if (!property || typeof window === 'undefined') return false

  const hiddenIds = loadHiddenIds()
  if (!hiddenIds.includes(id)) hiddenIds.push(id)
  const ownerListings = properties.filter((item) => item.isOwnerListing && item.id !== id)
  window.localStorage.setItem(storageKey, JSON.stringify(ownerListings))
  window.localStorage.setItem(hiddenStorageKey, JSON.stringify(hiddenIds))
  const index = properties.findIndex((item) => item.id === id)
  if (index !== -1) properties.splice(index, 1)
  return true
}
