"use client"

import Link from "next/link";
import Image from "next/image";

import { useEffect, useState } from "react";
import routes from "@/routes";
import SearchInput from "@/sections/nettrom/common/searchInput";
import NettromLogo from "@/assets/nettrom-logo.png"
import MainNav from "./mainNav";
import { usePathname, useSearchParams } from "next/navigation";

export default function Header() {
    const [openMenu, setOpenMenu] = useState(false)
    const pathname = usePathname()
    const params = useSearchParams()

    useEffect(() => {
        setOpenMenu(false)
    }, [pathname, params])

    return (
        <header className={`header ${openMenu ? "menu-open fixed top-0 right-0 z-999" : ""}`} id="header">
            <div className="navbar">
                <div className="container">
                    <div className="navbar-header">
                        <div className="navbar-brand">
                            <Link className="logo !flex !items-center" title="Truyện tranh online" href={routes.nettrom.index}>
                                <Image alt="Logo NetTrom" className="my-auto" src={NettromLogo} width="150" style={{ "aspectRatio": 5 }} />
                            </Link>
                        </div>
                        <div className="navbar-form navbar-left hidden-xs search-box comicsearchbox">
                            <SearchInput />
                        </div>
                        <i className="fa fa-lightbulb-o toggle-dark"></i>
                        <Link href={routes.nettrom.search} type="button" className="search-button-icon visible-xs" aria-label="Search">
                            <i className="fa fa-search"></i>
                        </Link>
                        <button type="button" className="navbar-toggle" aria-label="Menu"
                            onClick={() => setOpenMenu(prev => !prev)}
                        >
                            {
                                openMenu ?
                                    <i className="fa fa-times"></i>
                                    :
                                    <i className="fa fa-bars"></i>
                            }
                        </button>
                    </div>
                    {/* <ul className="nav-account list-inline hidden-xs pull-right mt-[13px]">
                        <li className="login-link"><a rel="nofollow" href="https://github.com/hoangquandev/doctruyen" target="_blank">Source code</a></li>
                        <li className="register-link"><a rel="nofollow" href="https://mangadex.org/" target="_blank">MangaDex</a></li>
                    </ul> */}
                </div>
            </div>
            <div className="navbar-collapse">
                <div className="search-box comicsearchbox">
                    <SearchInput />
                </div>
                <MainNav />
                {/* <ul className="nav-account list-inline">
                    <li className="login-link"><a rel="nofollow" href="https://github.com/hoangquandev/doctruyen" target="_blank">Source code</a></li>
                    <li className="register-link"><a rel="nofollow" href="https://mangadex.org/" target="_blank">MangaDex</a></li>
                </ul> */}
            </div>
        </header>
    )
}