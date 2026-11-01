<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN: Rule Project -->
# AGENTS.md — Arif Portfolio

Panduan wajib untuk semua AI agent (dan developer) yang mengerjakan repo ini.
**Baca seluruh file ini sebelum menulis kode.** Kalau ada konflik antara file ini dan kebiasaanmu, ikuti file ini.

- Bahasa balasan ke pemilik proyek: **Bahasa Indonesia**.
- Bahasa kode (nama variabel, fungsi, file, komentar, commit message): **English**.
- Bahasa konten UI: lewat file i18n (`id` dan `en`), jangan hardcode.

---

## 1. Ringkasan proyek

Portfolio satu halaman milik Arif (Fullstack Web Developer). Section berurutan:
**Hero → Overview/Skills → Education → Projects → GitHub → Contact → Footer.**
Dua bahasa: Indonesia (`id`) dan English (`en`). Tema dark dengan aksen ungu dan lime.

### Stack (jangan ganti tanpa persetujuan)

| Kebutuhan | Pilihan |
|---|---|
| Framework | Next.js 16.x (App Router), minimal **16.2.6** (patch keamanan) |
| UI | React 19, TypeScript `strict` |
| Styling | Tailwind CSS v4 (token di `globals.css` lewat `@theme`) |
| Package manager | **Bun** (hanya `bun`, bukan npm/pnpm/yarn) |
| Runtime Next.js | Node.js 20.9+ (jangan pakai `bun --bun` kecuali diminta) |
| Animasi | `motion` (dulu Framer Motion), import dari `motion/react` |
| i18n | `next-intl` dengan segmen `[locale]` |
| Validasi | `zod` |
| Font | `next/font`: **DM Sans** (utama), **Instrument Serif Italic** (aksen) |

---

## 2. Aturan emas (tidak boleh dilanggar)

1. **Server Component adalah default.** `"use client"` hanya untuk interaksi, dan ditaruh di komponen kecil (daun), bukan di section utuh atau layout.
2. **Tidak ada nilai desain mentah di JSX.** Tidak ada hex (`#C0A8E8`), tidak ada `text-[37px]`, tidak ada `p-[23px]`. Semua lewat token (bagian 6).
3. **`#7B2FBE` bukan warna teks.** Kontrasnya hanya ±2,9:1 di atas latar gelap. Teks ungu memakai `text-purple` (`#A66BE0`).
4. **`motion/react` hanya diimpor di `src/components/motion/`** (pengecualian: komponen interaktif yang memang butuh, mis. penanda menu aktif). Section dan feature memakai primitif dari sana.
5. **Teks UI tidak di-hardcode di JSX.** Masuk `src/messages/{id,en}.json`.
6. **Jangan mengarang data pribadi** (nama kampus, jurusan, username GitHub, email, link proyek, nomor telepon). Pakai placeholder bertanda jelas dan laporkan.
7. **Satu arah import** (bagian 4). Feature tidak mengimpor feature lain.
8. **Jangan menambah dependency** tanpa alasan jelas. Sebutkan alasan dan alternatif yang sudah dipertimbangkan.
9. **Jangan menyentuh file di luar lingkup tugas** (refactor liar, rename massal, format ulang file lain).
10. **Kalau ragu, tanya.** Lebih baik satu pertanyaan singkat daripada menebak.

---

## 3. Perintah

```bash
bun install                 # install dependency (gunakan --frozen-lockfile di CI)
bun run dev                 # dev server (Turbopack default)
bun run build               # production build
bun run start               # jalankan hasil build
bun run lint                # ESLint
bun run typecheck           # tsc --noEmit
bun add <pkg>               # tambah dependency
bun add -d <pkg>            # tambah devDependency
```

- Commit hanya **`bun.lock`**. Jangan buat `package-lock.json`, `yarn.lock`, atau `pnpm-lock.yaml`.
- Paket yang butuh postinstall script harus didaftarkan di `trustedDependencies` (Bun memblokirnya secara default).
- Sebelum menyatakan tugas selesai, jalankan: `bun run lint && bun run typecheck && bun run build`.

---

## 4. Struktur folder dan aturan layering

```
src/
├── app/                      # routing + komposisi halaman SAJA
│   ├── [locale]/
│   │   ├── layout.tsx        # font, metadata, MotionProvider, NextIntlClientProvider
│   │   ├── page.tsx          # menyusun section (tipis, tanpa logika)
│   │   ├── not-found.tsx
│   │   └── error.tsx
│   ├── globals.css           # design tokens + base styles
│   ├── sitemap.ts
│   └── robots.ts
├── proxy.ts                  # deteksi locale (pengganti middleware.ts di Next 16)
│
├── features/                 # satu folder = satu section
│   ├── hero/
│   ├── skills/
│   ├── education/
│   ├── projects/             # components/, data/projects.ts, types.ts
│   ├── github/               # components/, services/github.ts, types.ts
│   └── contact/              # components/, actions.ts, schema.ts
│
├── components/
│   ├── ui/                   # primitif: button, chip, badge, input, section-heading
│   ├── layout/               # navbar, footer, language-switcher, container
│   └── motion/               # reveal, stagger, hover-lift, motion-provider
│
├── lib/                      # util murni, tanpa UI
│   ├── env.ts                # validasi env (zod)
│   ├── cn.ts
│   └── motion/               # tokens.ts, variants.ts
├── i18n/                     # routing.ts, request.ts
└── messages/                 # id.json, en.json
```

### Arah import (satu arah)

```
app  →  features  →  components  →  lib
```

- `components/ui` **tidak boleh** mengimpor dari `features`.
- `features/a` **tidak boleh** mengimpor dari `features/b`. Kalau dua feature butuh hal yang sama, pindahkan ke `components/` atau `lib/`.
- `lib/` tidak mengimpor React component.
- `app/` tidak berisi markup besar atau logika bisnis.
- Alias import: `@/*` → `src/*`. Jangan pakai path relatif naik lebih dari satu level (`../../..`).
- Setiap feature boleh punya `index.ts` sebagai pintu publik. Jangan buat barrel di setiap subfolder.

### Penamaan

- File dan folder: `kebab-case` (`project-card.tsx`).
- Komponen: `PascalCase`. Hook: `useXxx`. Konstanta: `SCREAMING_SNAKE_CASE` hanya untuk konstanta global sungguhan.
- Satu komponen utama per file; nama file = nama komponen.
- Dilarang membuat `utils.ts`, `helpers.ts`, atau `constants.ts` serba guna. Beri nama sesuai isi (`format-date.ts`, `social-links.ts`).
- Hindari `default export` kecuali yang diwajibkan Next (`page.tsx`, `layout.tsx`, dst.). Selainnya gunakan named export.

---

## 5. Server vs Client

- Fetch data di Server Component atau di `features/*/services/`, lalu oper sebagai props. **Jangan fetch di `useEffect`.**
- Komponen yang butuh state, event handler, atau browser API → file terpisah dengan `"use client"` di baris pertama.
- Section harus tetap Server Component. Bagian interaktif di dalamnya diekstrak menjadi komponen client kecil.
- Secret (token GitHub, kredensial email) hanya dibaca di server. Hanya variabel berawalan `NEXT_PUBLIC_` yang boleh sampai ke browser.
- Semua akses `process.env` lewat `src/lib/env.ts` (divalidasi zod). Dilarang membaca `process.env` langsung di komponen.
- Next.js 16: `params` dan `searchParams` bersifat **async** (`await params`). `middleware.ts` diganti **`proxy.ts`**.
- Caching eksplisit lewat `"use cache"` + `cacheLife` (Cache Components). Jangan mengandalkan caching implisit.

---

## 6. Design tokens (sumber: Figma)

Nilai di bawah berasal dari desain desktop 1920 px. Token didefinisikan **sekali** di `src/app/globals.css` dengan `@theme`, dan nama token di kode sama dengan nama variabel di Figma.

### 6.1 Warna

| Token (Tailwind) | Hex | Dipakai untuk |
|---|---|---|
| `bg-base` | `#080614` | latar halaman |
| `bg-surface` | `#130921` | kartu, form |
| `text-primary` | `#FFFFFF` | heading |
| `text-secondary` | `#C0A8E8` | body, meta (kontras ±9,7:1) |
| `text-accent` | `#ACF83A` | penekanan, status aktif |
| `text-purple` | `#A66BE0` | eyebrow, tahun, tag (kontras ±5,6:1) |
| `brand-purple` | `#7B2FBE` | **fill, border, glow saja. Bukan teks.** |
| `brand-lime` | `#ACF83A` | tombol primer, border aksen |

Aturan warna:
- Tombol primer = **lime solid** dengan teks `bg-base`. Jangan memakai gradient ungu→lime dengan teks gelap (kontras gagal di sisi ungu).
- Placeholder input: `text-secondary` dengan opacity sekitar 60%, supaya beda dari label.
- Kontras minimum: teks biasa 4,5:1, teks besar (≥24 px) 3:1.

### 6.2 Tipografi (type scale)

Hanya boleh memakai skala berikut. Jangan membuat ukuran baru.

| Utility | Ukuran desktop | Line-height | Letter-spacing | Font |
|---|---|---|---|---|
| `text-display` | 176 px | 100% | -3% | DM Sans Regular |
| `text-display-serif` | 176 px | 100% | -2% | Instrument Serif Italic |
| `text-closing` | 128 px | 105% | -2% | DM Sans Regular |
| `text-h2` | 96 px | 110% | -2% | DM Sans Regular |
| `text-h3` | 72 px | 112% | -2% | DM Sans Regular |
| `text-h4` | 40 px | 120% | 0 | DM Sans Medium |
| `text-title` | 32 px | 125% | 0 | DM Sans Regular |
| `text-eyebrow` | 32 px | 115% | 0 | Instrument Serif Italic |
| `text-body-l` | 24 px | 150% | 0 | DM Sans Regular |
| `text-body` | 20 px | 150% | 0 | DM Sans Regular |
| `text-caption` | 16 px | 150% | 0 | DM Sans Regular |
| `text-overline` | 14 px | 100% | +8%, uppercase | DM Sans Bold |
| `text-button` | 20 px | 100% | 0 | DM Sans SemiBold |

Aturan tipografi:
- Semua heading section = `text-h2`. Semua eyebrow = `text-eyebrow` dengan warna `text-purple`.
- Ukuran di tabel adalah **desktop 1920**. Implementasikan responsif dengan `clamp()` di token (mis. `--text-display: clamp(3.5rem, 9.2vw, 11rem)`), bukan dengan menambah ukuran baru per breakpoint. Desain tablet/mobile belum ada; ikuti `clamp()` dan tanyakan jika layout meragukan.
- Teks serif italic hanya sebagai aksen (kata kunci hero, eyebrow, "Hello!"), bukan untuk paragraf.
- Ukuran teks minimum 14 px (hanya untuk overline). Teks bacaan minimal 16 px.
- Gunakan tanda baca tipografis pada teks yang dibaca orang: apostrof `’` dan kutip `“ ”`. Kalimat diawali huruf kapital.
- Kapitalisasi konsisten: "Get in Touch" (bukan "Get In Touch").

### 6.3 Spacing dan layout

- Skala spacing (kelipatan 8): `8, 16, 24, 32, 48, 64, 96, 128, 160`.
- Container konten: **1600 px**, margin kiri-kanan **160 px** (desktop). Satu container untuk semua section, kecuali navbar yang memang lebih sempit.
- Padding vertikal section: **128 px**.
- Eyebrow → heading: **16 px**. Heading → konten: **64 px**. Gap antar kartu: **32 px**.
- Radius: `md` 16, `lg` 32, `pill` 999.

---

## 7. Animasi (Motion)

Pola: primitif client kecil di `components/motion/`, section tetap Server Component dan hanya membungkus kontennya.

```tsx
// Benar: section (server) memakai primitif
import { Reveal } from "@/components/motion/reveal";
<Reveal><SectionHeading ... /></Reveal>

// Salah: motion.div langsung di dalam section
```

Aturan:
1. `MotionProvider` (sekali di `[locale]/layout.tsx`) berisi `LazyMotion features={domAnimation} strict` dan `MotionConfig reducedMotion="user"`.
2. Pakai komponen **`m`** (bukan `motion`) agar bundle kecil. Mode `strict` akan error kalau `motion` dipakai.
3. **Durasi, easing, spring, viewport diambil dari `lib/motion/tokens.ts`.** Tidak ada angka durasi di komponen.
4. Animasikan **`opacity` dan `transform` saja** (`x`, `y`, `scale`). Hindari `width`, `height`, `top`, `left`. Gunakan prop `layout` untuk perubahan ukuran.
5. Jangan menumpuk class `transition-*` Tailwind dengan animasi Motion pada elemen yang sama.
6. `viewport={{ once: true }}` untuk animasi masuk.
7. **Hero (above the fold) tidak boleh dimulai dari `opacity: 0`**, karena merusak LCP dan SSR. Cukup gerak halus (`y` kecil). Fade-in penuh hanya untuk section di bawah fold.
8. Stagger maksimal sekitar 8 elemen per grup; total animasi masuk di bawah sekitar 1 detik.
9. Heatmap GitHub: tanpa animasi per sel.
10. Jangan memakai `Reorder`. `AnimatePresence` hanya untuk menu mobile atau modal.
11. Semua konten harus tetap terlihat dengan "Reduce motion" aktif.

---

## 8. i18n dan konten

- Routing: `/id` dan `/en` lewat segmen `[locale]`. Deteksi bahasa di `proxy.ts`.
- Teks UI: `src/messages/id.json` dan `en.json`, dikelompokkan per feature (`projects.title`, `contact.form.name`, dst.). Kunci harus sama di kedua file.
- Data terstruktur (proyek, pendidikan) ada di `features/*/data/*.ts` dengan field teks per bahasa (`{ id: "...", en: "..." }`). Tidak ada kalimat bercampur bahasa dalam satu JSX.
- Language switcher adalah salah satu dari sedikit komponen navbar yang boleh `"use client"`. Bahasa aktif jelas terlihat (IDN aktif = fill, yang lain = outline).
- `generateStaticParams` untuk semua locale; `generateMetadata` per locale (title, description, Open Graph, `alternates.languages`).

---

## 9. Pola per feature

### Section
- Komponen server tipis: ambil terjemahan + data, render `SectionHeading` + isi.
- `id` section harus cocok dengan link navbar (`skills`, `education`, `projects`, `github`, `contact`).

### Projects
- Setiap kartu menampilkan: gambar, judul, kategori, **chip tech stack**, satu kalimat deskripsi, dan link ("Case study", "Live", "Repo").
- Data di `features/projects/data/projects.ts`; tipe di `types.ts`. Link yang belum ada diisi `null` dan UI menyembunyikannya.

### GitHub
- Fetch hanya di server (`services/github.ts`), token tidak boleh ke client.
- Petakan respons API ke tipe internal (`GithubStats`); komponen hanya menerima tipe bersih.
- Cache dengan `"use cache"` + `cacheLife` (beberapa jam). Sediakan fallback bila API gagal, supaya halaman tetap tampil.

### Contact
- `schema.ts` (zod) dipakai di client **dan** server action. Validasi server wajib.
- `actions.ts` (`"use server"`) mengembalikan `{ ok: true } | { ok: false, errors }`. Jangan melempar error mentah ke UI.
- Tambahkan honeypot atau rate limit. Tampilkan state loading, sukses, dan error.
- Ikon sosial: area sentuh minimal 44×44 px; sertakan GitHub dan LinkedIn.

---

## 10. SEO, performa, aksesibilitas

- Satu `<h1>` saja (di hero), lalu `h2` per section, `h3` untuk item.
- Gambar lewat `next/image` dengan `sizes` benar; foto hero memakai `priority`; semua gambar punya `alt` bermakna (dekoratif: `alt=""`).
- Elemen interaktif harus berupa `<button>` atau `<a>` yang benar, bisa difokus keyboard, dengan focus ring yang terlihat (`focus-visible`).
- Link navbar adalah anchor ke section; tambahkan `scroll-margin-top` agar tidak tertutup navbar.
- Target: Lighthouse Performance dan Accessibility ≥ 90, CLS = 0.
- `sitemap.ts` dan `robots.ts` memakai API bawaan Next.js.

---

## 11. Gaya kode

- TypeScript `strict`. Dilarang `any` (pakai `unknown` + narrowing), dilarang `@ts-ignore` tanpa komentar alasan.
- Props diketik eksplisit (`type XxxProps = { ... }`), bukan `React.FC`.
- Komponen kecil dan fokus. Bila satu file melewati sekitar 150 baris, pertimbangkan memecahnya.
- Komentar menjelaskan **kenapa**, bukan **apa**. Hapus kode mati; jangan tinggalkan blok yang dikomentari.
- Class Tailwind digabung dengan helper `cn()`. Urutan class dirapikan oleh Prettier plugin.
- Tidak ada `console.log` di kode yang di-commit.
- Commit memakai Conventional Commits: `feat(projects): add tech stack chips`, `fix(contact): validate email on server`, `chore: bump next to 16.2.x`.
- Husky + lint-staged menjalankan lint dan typecheck sebelum commit. Jangan melewatinya dengan `--no-verify`.

---

## 12. Cara mengerjakan tugas (workflow agent)

1. **Baca** file ini dan file yang terkait tugas. Jangan berasumsi struktur; cek dulu dengan melihat folder.
2. **Rencanakan** singkat: file apa yang dibuat atau diubah, dan feature mana yang terkena.
3. **Cek token**: butuh warna atau ukuran baru? Tambahkan ke token dan beri tahu pemilik proyek; jangan hardcode.
4. **Implementasikan** sekecil mungkin sesuai lingkup. Satu tugas = satu perubahan yang bisa direview.
5. **Verifikasi**: `bun run lint && bun run typecheck && bun run build`. Lihat hasilnya di browser jika tugas visual.
6. **Laporkan** dalam Bahasa Indonesia: apa yang diubah, file yang disentuh, hal yang tidak sempat dikerjakan, dan data yang masih placeholder.

### Menambah section baru
1. Buat `src/features/<nama>/` dengan `components/`, `index.ts`, dan (jika perlu) `data/`, `services/`, `types.ts`.
2. Tambahkan teks ke `messages/id.json` dan `en.json`.
3. Render di `app/[locale]/page.tsx`, bungkus judul dengan `Reveal`.
4. Tambahkan link navbar dan footer (dua menu ini harus identik).

### Definition of done
- [ ] Lint, typecheck, dan build lulus.
- [ ] Tidak ada hex, ukuran font, atau spacing mentah di JSX.
- [ ] Tidak ada teks berwarna `#7B2FBE`.
- [ ] Teks UI ada di `id.json` dan `en.json` (kunci sama).
- [ ] Section masih Server Component; `"use client"` hanya di komponen daun.
- [ ] Animasi lewat primitif `components/motion/` dan token; aman untuk reduce motion.
- [ ] Kontras terpenuhi; elemen interaktif bisa diakses keyboard.
- [ ] Tidak ada data pribadi karangan; placeholder dilaporkan.
- [ ] Tidak ada file atau dependency di luar lingkup tugas.

---

## 13. Yang dilarang

- `"use client"` di level layout atau section utuh hanya demi satu tombol.
- Fetch data di `useEffect` untuk konten yang bisa dirender di server.
- `motion.div` langsung di feature, atau mengimpor `framer-motion`.
- File `constants.ts` / `utils.ts` serba guna; abstraksi berlebihan (repository pattern, state manager global) untuk portfolio sederhana.
- Menyalin nilai hex atau ukuran dari Figma langsung ke JSX.
- Mencampur teks Indonesia dan Inggris langsung di JSX.
- Menambah `package-lock.json`, `yarn.lock`, atau `pnpm-lock.yaml`.
- Mengarang data pribadi, testimoni, metrik, atau link.
- Menghapus atau melemahkan aturan di file ini tanpa persetujuan pemilik proyek.

---

## 14. Referensi desain

- File Figma: `https://www.figma.com/design/BrHlrfO34Gof8LT9hRuFwH/Untitled` (fileKey `BrHlrfO34Gof8LT9hRuFwH`), page **Portfolio**, section **Workspace**.
- Frame asli: **Arif portfolio** (desktop 1920). Frame revisi hero: **Introduction — Revised**.
- Variabel Figma (collection `Tokens`) dan text style Figma menjadi sumber kebenaran untuk bagian 6. Jika desain dan file ini berbeda, tanyakan mana yang benar sebelum melanjutkan.
- Belum ada desain tablet (768) dan mobile (390). Hingga ada, ikuti aturan fluid di bagian 6.2 dan tandai keputusan layout responsif sebagai asumsi dalam laporan.
<!-- BEGIN: Rule Project -->
