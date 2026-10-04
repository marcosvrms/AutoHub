import { Injectable } from '@nestjs/common';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';

@Injectable()
export class ListingImageStorage {
  private readonly uploadDirectory = join(
    process.cwd(),
    'uploads',
    'listings',
  );

  async save(file: Express.Multer.File): Promise<string> {
    await mkdir(this.uploadDirectory, {
      recursive: true,
    });

    const extension = this.getExtension(file.mimetype);

    const fileName = `${randomUUID()}${extension}`;

    const filePath = join(
      this.uploadDirectory,
      fileName,
    );

    await writeFile(filePath, file.buffer);

    return `/uploads/listings/${fileName}`;
  }

  async delete(url: string): Promise<void> {
    const prefix = '/uploads/listings/';

    if (!url.startsWith(prefix)) {
      return;
    }

    const fileName = url.substring(prefix.length);

    if (
      !fileName ||
      fileName.includes('/') ||
      fileName.includes('\\') ||
      fileName.includes('..')
    ) {
      return;
    }

    const filePath = join(
      this.uploadDirectory,
      fileName,
    );

    try {
      await unlink(filePath);
    } catch (error: unknown) {
      const code =
        error &&
        typeof error === 'object' &&
        'code' in error
          ? error.code
          : undefined;

      if (code !== 'ENOENT') {
        throw error;
      }
    }
  }

  private getExtension(mimetype: string): string {
    switch (mimetype) {
      case 'image/jpeg':
        return '.jpg';

      case 'image/png':
        return '.png';

      case 'image/webp':
        return '.webp';

      default:
        throw new Error(
          `Tipo de imagem não suportado: ${mimetype}`,
        );
    }
  }
}