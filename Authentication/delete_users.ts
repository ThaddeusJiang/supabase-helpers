import { User, createClient } from "@supabase/supabase-js"
import { env } from "bun"

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

async function list_users() {
  const {
    data: { users },
    error,
  } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: Number.MAX_SAFE_INTEGER,
  })

  if (error) {
    console.error("Error: supabase.auth.api.getUserList()", error.message)
    throw error
  }

  return users
}

function filter_unconfirmed_users(users: User[]) {
  return users.filter((user) => !user.confirmed_at)
}

function exclude_users(users: User[], user_ids: string[]) {
  return users.filter((user) => !user_ids.includes(user.id))
}

async function delete_user(user_id: string) {
  const {
    data: { user },
    error,
  } = await supabase.auth.admin.deleteUser(user_id)

  if (error) {
    console.error("Error: supabase.auth.api.deleteUser()", error.message)
    return Promise.reject(error)
  }

  if (!user) {
    console.warn("Error: supabase.auth.api.deleteUser()", "User not found")
    return Promise.reject(new Error("User not found"))
  }

  return user
}

async function delete_users(user_ids: string[]) {
  const results = await Promise.allSettled(user_ids.map((user_id) => delete_user(user_id)))

  const deleted = results.reduce((acc: User[], result) => {
    if (result.status === "fulfilled") {
      acc.push(result.value)
    } else {
      console.error("Error: delete_users()", result.reason)
    }
    return acc
  }, [])

  return deleted
}

async function main() {
  try {
    const users = await list_users()
    console.log("Total users:", users.length)

    const user_ids = env.USER_IDS.split(",").map((id) => id.trim())
    console.log("User IDs:", user_ids)

    const deleted = await delete_users(exclude_users(users, user_ids).map((user) => user.id))
    console.log("Deleted users:", deleted.length)
  } catch (error) {
    console.error(error)
  }
}

main()
