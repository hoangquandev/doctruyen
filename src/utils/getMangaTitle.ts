import { ExtendManga } from "../api/extend";

export function getMangaTitle(manga: ExtendManga | null | undefined) {
    if (!manga) return ""
    return manga.attributes.altTitles.find(t => t['vi'])?.['vi'] || manga.attributes.title?.['en'] || Object.values(manga.attributes.title)?.[0] || "No title";
}

export function getMangaAltTitles(manga: ExtendManga | null | undefined) {
    if (!manga) return []
    return manga.attributes.altTitles.filter(aT => aT["ja"] || aT["ja-ro"] || aT["en"]).map(aT => Object.values(aT)[0]);
}

export function getOriginalMangaTitle(manga: ExtendManga | null | undefined) {
    if (!manga) return ""
    const originalLanguage = manga.attributes.originalLanguage || 'ja'
    return manga.attributes.altTitles.find(t => t[originalLanguage])?.[originalLanguage] || manga.attributes.title?.['ja-ro'] || "";
}