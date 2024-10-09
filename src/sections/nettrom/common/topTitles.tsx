"use client"

import Link from "next/link"
import { useEffect } from "react"
import { MangaContentRating } from "@/api/manga"
import { Includes, Order } from "@/api/static"
import { useMangadex } from "@/contexts/mangadex"
import useSearchManga from "@/hooks/useSearchManga"
import routes from "@/routes"
import { getMangaTitle, getOriginalMangaTitle } from "@/utils/getMangaTitle"
import getCoverArt from "@/utils/getCoverArt"

export default function TopTitles({ groupId }: { groupId?: string }) {
    const { mangaList } = useSearchManga({
        limit: 7,
        includes: [Includes.COVER_ART,],
        order: {
            followedCount: Order.DESC,
        },
        contentRating: [MangaContentRating.SAFE, MangaContentRating.SUGGESTIVE],
        hasAvailableChapters: "true",
        availableTranslatedLanguage: ['vi'],
        group: groupId ? groupId : undefined
    })

    const { addMangas, updateMangaStatistics, mangaStatistics } = useMangadex()

    useEffect(() => {
        if (mangaList.length > 0) {
            addMangas(mangaList)
            updateMangaStatistics({ manga: mangaList.map(m => m.id) })
        }
    }, [mangaList])

    return (
        <div className="comic-wrap Module Module-168">
            <div className="ModuleContent">
                <div className="box-tab box darkBox">
                    <ul className="tab-nav clearfix">
                        <li>
                            <Link
                                rel="nofollow"
                                title="BXH truyện tranh theo tháng"
                                className="active"
                                href={`${routes.nettrom.search}?order[followedCount]=desc#results`}
                            >
                                Top
                            </Link>
                        </li>
                        <li>
                            <Link
                                rel="nofollow"
                                title="BXH truyện tranh theo tuần"
                                href={`${routes.nettrom.search}?order[rating]=desc#results`}
                            >
                                Yêu thích
                            </Link>
                        </li>
                        <li>
                            <Link
                                rel="nofollow"
                                title="BXH truyện tranh theo ngày"
                                href={`${routes.nettrom.search}?order[createdAt]=desc#results`}
                            >
                                Mới
                            </Link>
                        </li>
                    </ul>
                    <div className="tab-pane">
                        <div id="topMonth">
                            <ul className="list-unstyled">
                                {
                                    mangaList.map((manga, index) => {
                                        const title = getMangaTitle(manga)
                                        return (
                                            <li className="clearfix" key={manga.id}>
                                                <span className={`txt-rank fn-order pos${index + 1}`}>0{index + 1}</span>
                                                <div className="t-item comic-item" data-id={17696}>
                                                    <Link
                                                        className="thumb"
                                                        title={title}
                                                        href={routes.nettrom.manga(manga.id)}
                                                    >
                                                        <img
                                                            className="lazy w-full h-full object-cover"
                                                            src={getCoverArt(manga)}
                                                            alt={title}
                                                        />
                                                    </Link>
                                                    <h3 className="title">
                                                        <Link href={routes.nettrom.manga(manga.id)}>
                                                            {title}
                                                        </Link>
                                                    </h3>
                                                    <p className="chapter top">
                                                        <Link
                                                            title={title}
                                                            href={routes.nettrom.manga(manga.id)}
                                                        >
                                                            {getOriginalMangaTitle(manga)}
                                                        </Link>
                                                        <span className="view pull-right">
                                                            <i className="fa fa-star"></i> {mangaStatistics[manga.id]?.follows || 0}
                                                        </span>
                                                    </p>
                                                </div>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                        <div id="topWeek"></div>
                        <div id="topDay"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}