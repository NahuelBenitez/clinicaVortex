import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';

@Controller('pdf')
export class DocumentController {
  @Get('download/:filename')
  async downloadFile(
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    try {
      const filePath = `C:\\Users\\nahue\\Documents\\${filename}.pdf`;
      // console.log(filePath);

      const fileStats = fs.statSync(filePath);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Length', fileStats.size);
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${filename}".pdf`,
      );

      // Iniciar la lectura
      const readStream = fs.createReadStream(filePath);
      readStream.pipe(res);
    } catch (error) {
      console.error('Error al descargar el archivo:', error);
      res.status(500).send('Error al descargar el archivo');
    }
  }
}
