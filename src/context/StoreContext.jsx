import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { seedIfNeeded } from '../services/seedService'

/**
 * Store context: menjadi jembatan antara service (localStorage/API) dan UI.
 * Komponen tidak menyimpan/membaca localStorage secara langsung.
 */
const StoreContext = createContext({ version: 0, touch: () => {} })

export function StoreProvider({ children }) {
  const [version, setVersion] = useState(0)

  useEffect(() => {
    seedIfNeeded()
  }, [])

  const touch = useCallback(() => setVersion((v) => v + 1), [])
  const value = useMemo(() => ({ version, touch }), [version, touch])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  return useContext(StoreContext)
}

/** Jalankan reader saat version berubah (setelah CRUD). */
export function useStoreValue(reader, deps = []) {
  const { version } = useStore()
  const [value, setValue] = useState(() => reader())
  useEffect(() => {
    setValue(reader())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version, ...deps])
  return value
}
