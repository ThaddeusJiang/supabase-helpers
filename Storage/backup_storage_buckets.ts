import { createClient } from "@supabase/supabase-js"
import { join, dirname } from "node:path"
import { existsSync, mkdirSync } from "node:fs"

import { decodeBase64 } from "../utils/base64"
import { env } from "bun"

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

async function list_buckets() {
  const { data, error } = await supabase.storage.listBuckets()
  if (error) {
    console.error("Error: supabase.storage.listBuckets()", error.message)
    throw error
  }
  return data
}

async function list_files(bucket_id: string) {
  const { data: folders, error } = await supabase.storage.from(bucket_id).list()
  if (error) {
    console.error("Error: supabase.storage.from(bucket_id).list()", error.message)
    throw error
  }

  const data = await Promise.all(
    folders.map(async (folder) => {
      const { data, error } = await supabase.storage.from(bucket_id).list(folder.name)
      if (error) {
        console.error("Error: supabase.storage.from(bucket_id).list(folder.name)", error.message)
        throw error
      }

      return {
        folder: folder.name,
        files: data,
      }
    })
  )

  return data
}

async function download_file(bucket_id: string, file_path: string) {
  const { data, error } = await supabase.storage.from(bucket_id).download(file_path)
  if (error) {
    console.error("Error: supabase.storage.from(bucket_id).download(file_path)", error.message)
    throw error
  }
  return data
}

async function write_file(bucket_id: string, file_path: string, data: Blob) {
  const file = join(__dirname, ".storage", bucket_id, file_path)
  const dir = dirname(file)
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
  }
  await Bun.write(file, data)
}

async function main() {
  const buckets = await list_buckets()
  for (const bucket of buckets) {
    console.log("Bucket:", bucket.id)
    const folders = await list_files(bucket.id)
    for (const item of folders) {
      console.log(" Folder:", item.folder)
      item.files.forEach(async (file) => {
        console.log("  File:", file.name)
        const file_path = `${item.folder}/${file.name}`
        const blob = await download_file(bucket.id, file_path)
        const original_filename = decodeBase64(file.name)
        await write_file(bucket.id, `${item.folder}/${original_filename}`, blob)
      })
    }
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
