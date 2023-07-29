import Image from 'next/image'
import styles from './page.module.css'
import { unstable_cache } from 'next/cache'

export default async function Home() {
  const result = unstable_cache(async () => {
    await new Promise(r => setTimeout(r, 20000));
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
