import styles from './page.module.css'
import { unstable_cache } from 'next/cache'

export const fetchCache = 'force-no-store'
export const dynamic = 'force-dynamic'

export default async function Home() {
  const result = unstable_cache(async () => {
    console.time('test')
    await new Promise(r => setTimeout(r, 20000));
    console.timeEnd('test')
    return 'test'
  }, ['test'], {
    revalidate: 10,
    tags: ['test']
  })
  const hi = await result()

  return (
    <main className={styles.main}>
      {hi}
    </main>
  )
}
