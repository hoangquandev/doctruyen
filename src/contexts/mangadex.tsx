"use client";

import React, { createContext, useContext, useState } from "react";
import { uniq } from "lodash"

import { GetMangasStatisticResponse, MangaList, MangaResponse, MangaStatistic } from "../api/schema";
import { Manga as MangaApi, Statistic as StatisticApi } from "../api";
import { GetSearchMangaRequestOptions, MangaContentRating } from "../api/manga";
import { Includes } from "../api/static";
import extendRelationship from "../utils/extendRelationship";
import { ExtendManga } from "../api/extend";
import { GetMangasStatisticRequestOptions } from "../api/statistic";

export type Mangas = { [k: string]: ExtendManga }
export type MangaStatistics = Record<string, MangaStatistic>

export const MangadexContext = createContext<{
    mangas: Mangas,
    mangaStatistics: MangaStatistics,
    updateMangas: (options: GetSearchMangaRequestOptions) => Promise<void>,
    updateMangaStatistics: (options: GetMangasStatisticRequestOptions) => Promise<void>,
    addMangas: (mangaList: ExtendManga[]) => void
}>({
    mangas: {},
    mangaStatistics: {},
    updateMangas: () => new Promise(() => null),
    updateMangaStatistics: () => new Promise(() => null),
    addMangas: ([]) => null
});

export const MangadexContextProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [mangas, setMangas] = useState<Mangas>({})
    const [mangaStatistics, setMangaStatistics] = useState<MangaStatistics>({})

    const updateMangas = async (options: GetSearchMangaRequestOptions) => {
        if (!options.includes) {
            options.includes = [Includes.COVER_ART]
        }
        if (options.ids) {
            options.ids = uniq(options.ids.filter(id => {
                if (!mangas[id]) return true
                if (options.includes?.length === 1) return false
                if (options.includes?.includes(Includes.AUTHOR) && !mangas[id].author?.attributes)
                    return true
                if (options.includes?.includes(Includes.ARTIST) && !mangas[id].artist?.attributes)
                    return true
                return false
            }))
        }
        if (!options.includes.includes(Includes.COVER_ART)) {
            options.includes.push(Includes.COVER_ART)
        }

        // nothing to update
        if (options.ids?.length === 0) return

        // only one
        if (options.ids?.length === 1) {
            const mangaId = options.ids[0]
            const { data } = await MangaApi.getMangaId(mangaId, {
                includes: options.includes
            })
            if (data && (data as MangaResponse).data) {
                setMangas((prevMangas) => {
                    prevMangas[mangaId] = extendRelationship((data as MangaResponse).data) as ExtendManga;
                    return { ...prevMangas }
                })
            }
            return
        }

        // rewrite
        options.limit = 100
        options.contentRating = [MangaContentRating.EROTICA, MangaContentRating.PORNOGRAPHIC, MangaContentRating.SAFE, MangaContentRating.SUGGESTIVE]
        try {
            const { data } = await MangaApi.getSearchManga(options)
            if (data && (data as MangaList).data) {
                setMangas((prevMangas) => {
                    for (const manga of (data as MangaList).data) {
                        prevMangas[manga.id] = extendRelationship(manga) as ExtendManga;
                    }
                    return { ...prevMangas };
                })
            }
        } catch (error) {
            console.error(error)
        }
    }

    const addMangas = (mangaList: ExtendManga[]) => {
        setMangas((prevMangas) => {
            for (const manga of mangaList) {
                prevMangas[manga.id] = extendRelationship(manga) as ExtendManga;
            }
            return { ...prevMangas };
        })
    }

    const updateMangaStatistics = async (options: GetMangasStatisticRequestOptions) => {
        options.manga = uniq(options.manga.filter(id => !mangaStatistics[id]))
        if (options.manga.length === 0) return;
        try {
            const { data } = await StatisticApi.getMangasStatistic(options)
            if (data && (data as GetMangasStatisticResponse).statistics) {
                setMangaStatistics((prev) => ({ ...prev, ...(data as GetMangasStatisticResponse).statistics }))
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <MangadexContext.Provider value={{ mangas, updateMangas, mangaStatistics, updateMangaStatistics, addMangas }}>
            {children}
        </MangadexContext.Provider>
    );
};

export const useMangadex = () => useContext(MangadexContext)