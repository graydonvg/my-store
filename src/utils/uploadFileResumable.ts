import { LOGGER_ERROR_MESSAGES, USER_ERROR_MESSAGES } from '@/constants';
import createSupabaseBrowserClient from '@/lib/supabase/supabase-browser';
import { Logger } from 'next-axiom';
import { Upload } from 'tus-js-client';
import { getUserRoleFromSession } from './auth';
import { UploadResult } from '@/types';

const log = new Logger();
const supabase = createSupabaseBrowserClient();

export async function uploadFileResumable(
  bucketName: string,
  filePath: string,
  file: File,
  onProgress?: (uploadedBytes: number, totalBytes: number) => void
) {
  const logger = log.with({ context: 'utils: uploadFileResumable' });
  logger.info('Attempting to upload product image to storage', { bucketName, filePath });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return new Promise<UploadResult>((resolve, reject) => {
    const upload = new Upload(file, {
      endpoint: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/upload/resumable`,
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
      chunkSize: 6 * 1024 * 1024, // NOTE: it must be set to 6MB (for now) do not change it (from the docs https://supabase.com/docs/guides/storage/uploads/resumable-uploads?queryGroups=language&language=js)
      retryDelays: [0, 1000, 3000, 5000], // Retry delays for failed uploads
      metadata: {
        bucketName: bucketName,
        objectName: filePath,
        contentType: file.type,
      },
      onError: async (error) => {
        // 'Not authorized' returned by supabase stored procedure
        if (error.message.includes('Not authorized')) {
          const userRole = await getUserRoleFromSession(supabase);
          logger.warn(LOGGER_ERROR_MESSAGES.notAuthorized, { fileName: filePath, role: userRole });

          reject({
            error: USER_ERROR_MESSAGES.notAuthorized,
            fileName: filePath,
          });
        } else {
          logger.error('Image upload failed.', { error, fileName: filePath });

          reject({ error, fileName: filePath });
        }
      },
      onProgress: (uploadedBytes, totalBytes) => {
        if (onProgress) onProgress(uploadedBytes, totalBytes);
      },
      onSuccess: () => {
        try {
          const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);

          if (data?.publicUrl) {
            logger.info('Product image uploaded successfully', { imageUrl: data.publicUrl, fileName: filePath });

            resolve({ imageUrl: data.publicUrl, fileName: filePath });
          } else {
            const error = new Error('Failed to fetch public URL');

            logger.error('Failed to fetch public URL', { error, fileName: filePath });

            reject({ error, fileName: filePath });
          }
        } catch (error) {
          logger.error('Failed to fetch public URL', { error, fileName: filePath });

          reject({ error, fileName: filePath });
        }
      },
    });

    upload.start();
  });
}
