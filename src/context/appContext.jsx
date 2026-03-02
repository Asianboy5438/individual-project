import { createContext, useContext, useState, useCallback, useSyncExternalStore } from 'react'

const AppContext = createContext()

export const AppProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(true)
    const [joinedSubs, setJoinedSubs] = useState(new Set (['r/programming', 'r/gaming']))

    const toggleDarkMode = useCallback(() => {
        setDarkMode(prev => !prev)
    }, [])

    const toggleJoin = useCallback((subId) => {
        setJoinedSubs(prev => {
            const next = new Set(prev)
            if (next.has(subId)) next.delete(subId)
            else next.add(subId)
            return next
        })
    }, [])

    return (
        <AppContext.Provider value = {{ darkMode, toggleDarkMode, joinedSubs, toggleJoin }}>{children}</AppContext.Provider>
    )
}

export const useAppContext = () => {
    const ctx = useContext(AppContext)
    if (!ctx) throw new Error('useAppContext must be used within AppProvider')
    return ctx
}