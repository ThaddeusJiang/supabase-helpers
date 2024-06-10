import { createClient } from '@supabase/supabase-js'
import { env } from 'bun'

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

async function list_buckets() {
  const { data, error } = await supabase.storage.listBuckets()

  if (error) {
    console.error('Error: listing storage_buckets', error.message)
    return []
  }

  return data
}

async function empty_buckets(bucketIds: string[] = []) {
  await Promise.all(
    bucketIds.map(async (bucketId) => {
      const { data, error } = await supabase.storage.emptyBucket(bucketId)
      if (error) {
        console.error('Error listing storage_files', error.message)
        return
      }

      console.log('Bucket emptied', bucketId)
    })
  )
}

async function delete_buckets(bucketIds: string[] = []) {
  await Promise.all(
    bucketIds.map(async (bucketId) => {
      const { error } = await supabase.storage.deleteBucket(bucketId)
      if (error) {
        console.error('Error deleting storage_buckets', error.message)
        return
      }
      console.log('Bucket deleted', bucketId)
    })
  )
}

async function main() {
  const buckets = await list_buckets()
  const bucketIds = buckets.map((bucket) => bucket.id)
  // TODO: next step: backup storage files
  await empty_buckets(bucketIds)
  await delete_buckets(bucketIds)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
