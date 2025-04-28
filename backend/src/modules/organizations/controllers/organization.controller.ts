import { Request, Response } from 'express';
import { organizationService } from '../services/organization.service';
import { OrganizationDTO, OrganizationResponse } from '../models/organization.model';
import * as ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';

export class OrganizationController {
  /**
   * Crea una nueva organización
   */
  async createOrganization(req: Request, res: Response) {
    try {
      const organizationDto: OrganizationDTO = req.body;
      
      if (!organizationDto.name || organizationDto.name.trim() === '') {
        return res.status(400).json({ error: 'Name is required.' });
      }

      const newOrganization = await organizationService.createOrganization(organizationDto);

      res.status(201).json({
        message: 'Organization created successfully.',
        organization: newOrganization,
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error creating organization:', err.message);
      res.status(500).json({ error: 'Error creating organization.' });
    }
  }

  /**
   * Obtiene todas las organizaciones
   */
  async getOrganizations(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const organizations = await organizationService.getOrganizations(page, limit);
      
      res.status(200).json(organizations);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching organizations:', err.message);
      res.status(500).json({ error: 'Error fetching organizations.' });
    }
  }

  /**
   * Obtiene una organización por su código
   */
  async getOrganizationByCode(req: Request, res: Response) {
    try {
      const { code } = req.params;
      const organization = await organizationService.getOrganizationByCode(code);
      
      if (!organization) {
        return res.status(404).json({ error: 'Organization not found.' });
      }
      
      res.status(200).json(organization);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching organization:', err.message);
      res.status(500).json({ error: 'Error fetching organization.' });
    }
  }

  /**
   * Obtiene proyectos de una organización
   */
  async getProjectsByOrganization(req: Request, res: Response) {
    try {
      const { code } = req.params;
      const organizationWithProjects = await organizationService.getOrganizationWithProjects(code);
      
      if (!organizationWithProjects) {
        return res.status(404).json({ error: 'Organization not found.' });
      }
      
      res.status(200).json(organizationWithProjects.projects);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching projects:', err.message);
      res.status(500).json({ error: 'Error fetching projects.' });
    }
  }

  /**
   * Actualiza una organización
   */
  async updateOrganization(req: Request, res: Response) {
    try {
      const { code } = req.params;
      const organizationDto: OrganizationDTO = req.body;
      
      const updatedOrganization = await organizationService.updateOrganization(code, organizationDto);
      
      res.status(200).json({
        message: 'Organization updated successfully.',
        organization: updatedOrganization,
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error updating organization:', err.message);
      res.status(500).json({ error: 'Error updating organization.' });
    }
  }

  /**
   * Elimina una organización
   */
  async deleteOrganization(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      await organizationService.deleteOrganization(id);
      
      res.status(200).json({
        message: 'Organization deleted successfully.',
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error deleting organization:', err.message);
      res.status(500).json({ error: 'Error deleting organization.' });
    }
  }

  /**
   * Busca organizaciones por nombre
   */
  async searchOrganizations(req: Request, res: Response) {
    try {
      const { name } = req.query;
      
      if (!name) {
        return res.status(400).json({ error: 'Name parameter is required.' });
      }
      
      const organizations = await organizationService.searchOrganizations(name as string);
      
      res.status(200).json(organizations);
    } catch (error) {
      const err = error as Error;
      console.error('Error searching organizations:', err.message);
      res.status(500).json({ error: 'Error searching organizations.' });
    }
  }

  /**
   * Busca organizaciones por fecha
   */
  async searchOrganizationsByDate(req: Request, res: Response) {
    try {
      const { month, year } = req.query;
      
      if (!month || !year) {
        return res.status(400).json({ error: 'Month and year parameters are required.' });
      }
      
      const organizations = await organizationService.searchOrganizationsByDate(
        parseInt(month as string), 
        parseInt(year as string)
      );
      
      res.status(200).json(organizations);
    } catch (error) {
      const err = error as Error;
      console.error('Error searching organizations by date:', err.message);
      res.status(500).json({ error: 'Error searching organizations by date.' });
    }
  }

  /**
   * Obtiene el siguiente código único
   */
  async getNextCode(req: Request, res: Response) {
    try {
      const nextCode = await organizationService.getNextCode();
      
      res.status(200).json({ nextCode });
    } catch (error) {
      const err = error as Error;
      console.error('Error generating next code:', err.message);
      res.status(500).json({ error: 'Error generating next code.' });
    }
  }

  /**
   * Exporta a Excel
   */
  async exportToExcel(req: Request, res: Response) {
    try {
      const organizations: OrganizationResponse[] = await organizationService.getOrganizations(1, 1000); // Máximo 1000 registros
      
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Organizations');
      
      // Definir cabeceras
      worksheet.columns = [
        { header: 'Code', key: 'code', width: 15 },
        { header: 'Name', key: 'name', width: 30 },
        { header: 'Creation Date', key: 'creationDate', width: 20 },
        { header: 'Version', key: 'version', width: 10 },
        { header: 'Status', key: 'status', width: 15 },
      ];
      
      // Agregar datos
      organizations.forEach(org => {
        worksheet.addRow({
          code: org.code,
          name: org.name,
          creationDate: org.creationDate.toISOString().split('T')[0],
          version: org.version,
          status: org.status || 'N/A',
        });
      });
      
      // Estilizar cabeceras
      worksheet.getRow(1).font = { bold: true };
      
      // Configurar la respuesta HTTP
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=organizations.xlsx');
      
      // Enviar el archivo
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      const err = error as Error;
      console.error('Error exporting to Excel:', err.message);
      res.status(500).json({ error: 'Error exporting to Excel.' });
    }
  }

  /**
   * Exporta a PDF
   */
  async exportToPDF(req: Request, res: Response) {
    try {
      const organizations: OrganizationResponse[] = await organizationService.getOrganizations(1, 1000);
     
      // Configurar la respuesta HTTP
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=organizations.pdf');
      
      // Crear documento PDF
      const doc = new PDFDocument({ margin: 30 });
      
      // Título
      doc.fontSize(16).font('Helvetica-Bold').text('Organizations Report', { align: 'center' });
      doc.moveDown();
      
      // Información de generación
      doc.fontSize(10).font('Helvetica').text(`Generated on: ${new Date().toLocaleString()}`, { align: 'right' });
      doc.moveDown(2);
      
      // Tabla de organizaciones
      const headers = ['Code', 'Name', 'Creation Date', 'Version'];
      const rows = organizations.map(org => [
        org.code,
        org.name,
        org.creationDate.toLocaleDateString(),
        org.version
      ]);
      
      // Dibujar tabla
      this.drawTable(doc, headers, rows);
      
      // Finalizar documento
      doc.end();
      doc.pipe(res);
    } catch (error) {
      const err = error as Error;
      console.error('Error exporting to PDF:', err.message);
      res.status(500).json({ error: 'Error exporting to PDF.' });
    }
  }

  /**
   * Función auxiliar para dibujar tablas en PDF
   */
  private drawTable(doc: typeof PDFDocument, headers: string[], rows: any[][]) {
    const columnWidths = [80, 150, 120, 60]; // Ajustar anchos de columna
    const tableMargin = 30; // Margen izquierdo
    const rowHeight = 20;
    
    let y = doc.y; // Posición inicial en Y
    
    // Dibujar encabezados
    doc.fontSize(10).font('Helvetica-Bold');
    headers.forEach((header, index) => {
      const x = tableMargin + columnWidths.slice(0, index).reduce((a, b) => a + b, 0);
      doc.text(header, x, y, { width: columnWidths[index], align: 'center' });
    });
    
    y += rowHeight;
    
    // Dibujar filas de datos
    doc.font('Helvetica');
    rows.forEach(row => {
      row.forEach((cell, index) => {
        const x = tableMargin + columnWidths.slice(0, index).reduce((a, b) => a + b, 0);
        doc.text(String(cell), x, y, { width: columnWidths[index], align: 'center' });
      });
      y += rowHeight;
    });
  }

  /**
   * Obtiene la organización principal (implementar según necesidad)
   */
  async getMainOrganization(req: Request, res: Response) {
    try {
      // Obtener la primera organización o una predefinida según tu lógica
      const organizations: OrganizationResponse[] = await organizationService.getOrganizations(1, 1);
      const mainOrg = organizations[0] || null;
      
      if (!mainOrg) {
        return res.status(404).json({ error: 'No main organization found.' });
      }
      
      res.status(200).json(mainOrg);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching main organization:', err.message);
      res.status(500).json({ error: 'Error fetching main organization.' });
    }
  }
}

// Creamos y exportamos una instancia del controlador
export const organizationController = new OrganizationController();