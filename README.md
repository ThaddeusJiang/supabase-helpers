# supabase-helpers

DevOps Toolkit for [supabase](https://supabase.io/)

To install dependencies:

```bash
bun install
```

## Features

- backup supabase storage

## Usage

### setup environment

```bash
cp .env.example .env
```

### backup supabase storage to local directory

```bash
bun run backup_storage_buckets.ts
```

your storage buckets will be saved in `./storage` directory
