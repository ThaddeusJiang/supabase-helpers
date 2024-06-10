import { createClient } from '@supabase/supabase-js'
import { env } from 'bun'

export function generate_storage_link(bucket_id: string) {
  const project_id = env.SUPABASE_URL.replace(/^https:\/\/(.*).supabase.co$/, '$1')
  return `https://supabase.com/dashboard/project/${project_id}/storage/buckets/${bucket_id}`
}

async function create_bucket(id: string, is_public: boolean = false) {
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

  const { data, error } = await supabase.storage.createBucket(id, {
    public: is_public,
  })
  if (error) {
    console.error('Error seeding storage_buckets', error.message)
    return
  }

  console.log('Bucket created', {
    name: data.name,
    preview: generate_storage_link(data.name),
  })
}

async function main() {
  const prompt = "Your bucket id (e.g. 'avatars'): "
  process.stdout.write(prompt)
  let bucket = ''
  for await (const line of console) {
    bucket = line.trim()
    if (!bucket) {
      console.log('Exiting...')
      break
    }

    await create_bucket(bucket).catch((e) => {
      console.error(e)
      process.exit(1)
    })

    process.stdout.write(prompt)
  }
}

main()
