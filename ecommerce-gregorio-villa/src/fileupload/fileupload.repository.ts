import { Injectable } from '@nestjs/common';
import * as toStream from 'buffer-to-stream';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

@Injectable()
export class FileuploadRepository {
  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    console.log(file.buffer);

    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { resource_type: 'auto' },
        (error, result: UploadApiResponse) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        },
      );
      toStream(file.buffer).pipe(upload);
    });
  }
}
