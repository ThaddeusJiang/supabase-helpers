import { test, expect } from 'bun:test'
import { generate_storage_link } from './seed_storage_buckets'
import { env } from 'bun'

test('generates storage link', () => {
  const bucketId = 'my-bucket'
  const expectedLink = 'https://supabase.com/dashboard/project/my-project-id/storage/buckets/my-bucket'

  env.SUPABASE_URL = 'https://my-project-id.supabase.co'

  expect(generate_storage_link(bucketId)).toBe(expectedLink)
})
