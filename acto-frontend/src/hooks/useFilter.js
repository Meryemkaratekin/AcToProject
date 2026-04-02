import { useState, useMemo } from 'react'

export function useFilter(events) {
  const [search, setSearch]   = useState('')
  const [city, setCity]       = useState('')
  const [category, setCategory] = useState('Tümü')
  const [sort, setSort]       = useState('popular')

  const filtered = useMemo(() => {
    let result = events.filter((e) => {
      const q = search.toLowerCase()
      const matchSearch =
        !q ||
        e.title.toLowerCase().includes(q) ||
        e.district.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        e.city.toLowerCase().includes(q)
      const matchCity = !city || e.city.toLowerCase().includes(city.toLowerCase())
      const matchCat  = category === 'Tümü' || e.category === category
      return matchSearch && matchCity && matchCat
    })

    if (sort === 'popular') result = [...result].sort((a, b) => b.current - a.current)
    if (sort === 'filling')  result = [...result].sort((a, b) => (b.current / b.total) - (a.current / a.total))
    if (sort === 'soon')     result = [...result].sort((a, b) => a.id - b.id)

    return result
  }, [events, search, city, category, sort])

  return { search, setSearch, city, setCity, category, setCategory, sort, setSort, filtered }
}
