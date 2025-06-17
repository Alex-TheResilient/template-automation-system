import { Request, Response } from 'express';
import { organizationService } from '../services/organization.service';
import { OrganizationDTO, OrganizationResponse } from '../models/organization.model';
import * as ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';

export class OrganizationController {
  /**
   * Creates a new organization
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
   * Gets all organizations
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
   * Gets an organization by code
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
   * Gets projects for an organization
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
   * Updates an organization
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
   * Deletes an organization
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
   * Searches organizations by name
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
   * Searches organizations by date
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
   * Gets the next unique code without incrementing the counter
   */
  async getNextCode(req: Request, res: Response) {
    try {
      const nextCode = await organizationService.getNextCodePreview();

      res.status(200).json({ nextCode });
    } catch (error) {
      const err = error as Error;
      console.error('Error generating next code:', err.message);
      res.status(500).json({ error: 'Error generating next code.' });
    }
  }

  /**
   * Exports to Excel
   */
  async exportToExcel(req: Request, res: Response) {
    try {
      // Get all organizations
      const organizations = await organizationService.getOrganizations(1, 1000);

      // Create a new workbook
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Organizations');

      // Add headers
      worksheet.columns = [
        { header: 'Code', key: 'code', width: 15 },
        { header: 'Name', key: 'name', width: 30 },
        { header: 'Version', key: 'version', width: 10 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Phone', key: 'phone', width: 15 },
        { header: 'Address', key: 'address', width: 30 },
        { header: 'Created', key: 'creationDate', width: 20 },
        { header: 'Modified', key: 'modificationDate', width: 20 }
      ];

      // Style the headers
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

      // Add rows
      organizations.forEach((org: OrganizationResponse) => {
        worksheet.addRow({
          code: org.code,
          name: org.name,
          version: org.version,
          status: org.status || 'N/A',
          phone: org.phone || 'N/A',
          address: org.address || 'N/A',
          creationDate: org.creationDate
            ? new Date(org.creationDate).toLocaleDateString()
            : 'N/A',
          modificationDate: org.modificationDate
            ? new Date(org.modificationDate).toLocaleDateString()
            : 'N/A'
        });
      });

      // Set content type and disposition
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=organizations.xlsx');

      // Send the workbook
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      const err = error as Error;
      console.error('Error exporting to Excel:', err.message);
      res.status(500).json({ error: 'Error exporting to Excel.' });
    }
  }

  /**
   * Exports to PDF
   */
  async exportToPDF(req: Request, res: Response) {
    try {
      // Get all organizations
      const organizations = await organizationService.getOrganizations(1, 1000);

      // Create a new PDF document
      const doc = new PDFDocument({
        margin: 30,
        size: 'A4',
        layout: 'landscape',
        autoFirstPage: true
      });

      // Set response headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=organizations.pdf');

      // Pipe the PDF to the response
      doc.pipe(res);

      // Add title and date
      doc.fontSize(18).text('Organizations Report', { align: 'center' });
      doc.fontSize(10).text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' });
      doc.moveDown(2);

      // Create table headers and rows
      const headers = ['Code', 'Name', 'Version', 'Status', 'Phone', 'Address', 'Creation Date'];
      const rows = organizations.map((org: OrganizationResponse) => [
        org.code || 'N/A',
        org.name || 'N/A',
        org.version || 'N/A',
        org.status || 'N/A',
        org.phone || 'N/A',
        org.address || 'N/A',
        org.creationDate ? new Date(org.creationDate).toLocaleDateString() : 'N/A'
      ]);

      // Draw the table with improved handling of text overflow
      this.drawTableImproved(doc, headers, rows);

      // Add page numbers
      const totalPages = doc.bufferedPageRange().count;
      for (let i = 0; i < totalPages; i++) {
        doc.switchToPage(i);
        doc.fontSize(8).text(
          `Page ${i + 1} of ${totalPages}`,
          30,
          doc.page.height - 20,
          { align: 'center' }
        );
      }

      // Finalize the PDF and end the response
      doc.end();
    } catch (error) {
      const err = error as Error;
      console.error('Error exporting to PDF:', err.message);
      res.status(500).json({ error: 'Error exporting to PDF.' });
    }
  }

  /**
   * Improved table drawing function with text wrapping and dynamic row heights
   */
  private drawTableImproved(doc: PDFKit.PDFDocument, headers: string[], rows: any[][]) {
    const pageWidth = doc.page.width - 60; // Account for margins
    const columnWidths = this.calculateColumnWidths(headers, rows, pageWidth);
    const margin = 30;
    let y = doc.y;

    // Draw headers
    doc.font('Helvetica-Bold').fontSize(10);
    let x = margin;

    headers.forEach((header, i) => {
      doc.text(header, x, y, {
        width: columnWidths[i],
        align: 'center'
      });
      x += columnWidths[i];
    });

    // Draw header line
    y += 20;
    doc.moveTo(margin, y).lineTo(margin + pageWidth, y).stroke();
    y += 5;

    // Draw rows with dynamic heights
    doc.font('Helvetica').fontSize(9);

    rows.forEach((row) => {
      // Calculate row height based on content
      const rowHeight = this.calculateRowHeight(doc, row, columnWidths);

      // Check if we need a new page
      if (y + rowHeight > doc.page.height - 50) {
        doc.addPage();
        y = 50;
      }

      // Draw cells with wrapped text
      x = margin;
      let maxCellHeight = 0;

      row.forEach((cell, i) => {
        const cellText = cell ? String(cell) : 'N/A';
        const cellOptions = {
          width: columnWidths[i],
          align: 'left' as const,
          lineBreak: true
        };

        // Draw cell text
        doc.text(cellText, x, y, cellOptions);

        // Move to next column
        x += columnWidths[i];
      });

      // Move to next row and draw divider
      y += rowHeight + 5;
      doc.moveTo(margin, y - 2).lineTo(margin + pageWidth, y - 2).stroke();
    });
  }

  /**
   * Calculate dynamic row height based on content
   */
  private calculateRowHeight(doc: PDFKit.PDFDocument, row: any[], columnWidths: number[]): number {
    let maxHeight = 15; // Minimum row height

    row.forEach((cell, i) => {
      if (!cell) return;

      const cellText = String(cell);
      const wrappedText = doc.widthOfString(cellText, {
        width: columnWidths[i],
        lineBreak: true
      });

      // Estimate the height based on text length and column width
      const textLines = Math.ceil(wrappedText / columnWidths[i]);
      const estimatedHeight = textLines * 12; // 12 points per line

      maxHeight = Math.max(maxHeight, estimatedHeight);
    });

    return maxHeight;
  }

  /**
   * Calculate optimal column widths based on content
   */
  private calculateColumnWidths(headers: string[], rows: any[][], totalWidth: number): number[] {
    // Define column width ratios based on typical content
    const widthRatios = [0.1, 0.25, 0.1, 0.1, 0.15, 0.2, 0.1];

    return widthRatios.map(ratio => totalWidth * ratio);
  }

  /**
   * Gets the main organization of the system
   */
  async getMainOrganization(req: Request, res: Response) {
    try {
      const mainOrgCode = 'ORG-MAIN';
      const mainOrg = await organizationService.getOrganizationByCode(mainOrgCode);

      if (!mainOrg) {
        return res.status(404).json({ error: 'Main organization not found.' });
      }

      res.status(200).json(mainOrg);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching main organization:', err.message);
      res.status(500).json({ error: 'Error fetching main organization.' });
    }
  }
}

// Export singleton instance of the controller
export const organizationController = new OrganizationController();