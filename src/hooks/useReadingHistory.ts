import { ReadingHistory } from "@/types/readingHistory";
import useLocalStorage from "./useLocalStorage";


export default function useReadingHistory() {
    const [history, setHistory] = useLocalStorage<Record<string, ReadingHistory>>("truyendex-history", {})

    const addHistory = (mangaId: string, manga: ReadingHistory) => {
        setHistory((value) => {
            const mangaIds = Object.keys(value)
            if (mangaIds.length > 20) {
                delete value[mangaIds[0]]
            }
            return ({ [mangaId]: manga, ...value, })
        })
    }

    const removeHistory = (mangaId: string) => {
        setHistory((value) => {
            delete value[mangaId]
            return { ...value }
        })
    }

    return { history, setHistory, addHistory, removeHistory }
}