import { useEffect } from "react"

const siteUrl = "https://pairuppromo.vercel.app"

export function useDocumentMetadata(title: string, description: string, path = "/") {
  useEffect(() => {
    document.title = title

    const descriptionMeta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    descriptionMeta?.setAttribute("content", description)

    document.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.setAttribute("content", title)
    document.querySelector<HTMLMetaElement>('meta[property="og:description"]')?.setAttribute("content", description)

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement("link")
      canonical.rel = "canonical"
      document.head.append(canonical)
    }
    canonical.href = new URL(path, siteUrl).toString()
    document.querySelector<HTMLMetaElement>('meta[property="og:url"]')?.setAttribute("content", canonical.href)
  }, [description, path, title])
}
