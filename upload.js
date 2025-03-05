import path from 'path'

import mime from 'mime'
import { glob } from 'glob'
import debug from 'debug'
import Bottleneck from 'bottleneck'
import { Storage } from '@google-cloud/storage'

const log = debug('NX_GCS')

async function uploadFile(file, bucket, { access, gzipSet, metadata, baseDir }) {
  const opts = {
    destination: file.replace(`${baseDir}/`, ''),
    resumable: false,
    public: access === 'public',
    gzip: gzipSet.has(path.extname(file)),
    metadata: {
      contentType: mime.getType(file) || 'application/octet-stream',
      cacheControl: 'no-cache, max-age=0',
      ...metadata,
    },
  }

  const [result] = await bucket.upload(file, opts)

  log('file %s uploaded', result.name)

  return result
}

const keyFilename = process.env.KEYFILE_NAME
const bucketName = process.env.BUCKET_NAME
const failEmpty = true
const sources = ["docs/**/*"]
const gzip = ['.css', '.js', '.html']
const bucketDir = ''
const access = 'public'
const baseDir = 'docs'
const cwd = './'
const metadata = {}
const retries = 5

const gcloud = async () => {
  const limiter = new Bottleneck({
    maxConcurrent: 5,
  })

  const ctx = { uploaded: [] }

  const gcs = new Storage({ keyFilename })
  const bucket = gcs.bucket(bucketName)

  log('bucket: %s', bucketName)

  const [firstFile, ...queuedFiles] = sources.flatMap((source) => glob.sync(source, { cwd, nodir: true }))

  log('uploading files: %o', [firstFile, ...queuedFiles])

  if (!firstFile) {
    ctx.success = !failEmpty
    log('no files for uploading')
    return ctx
  }

  const gzipSet = gzip && gzip.length ? new Set(gzip) : new Set()

  try {
    const pRetry = (await import('p-retry')).default
    // firstly try to upload one file (check credentials, destination conflict)
    await uploadFile(firstFile, bucket, { bucketDir, access, gzipSet, baseDir, metadata })

    // bulk upload files with retries and rate limit
    const uploadJobs = queuedFiles.map((filePath) => {
      return pRetry(() => uploadFile(filePath, bucket, { bucketDir, access, baseDir, gzipSet, metadata }), { retries })
    })

    await limiter.schedule(() => Promise.all(uploadJobs))

    log('uploading files to Google Cloud Storage completed')
    ctx.success = true
  } catch (err) {
    log('uploading files to Google Cloud Storage failed', err)
    ctx.success = false
    ctx.err = err
  }

  return ctx
}

gcloud()

