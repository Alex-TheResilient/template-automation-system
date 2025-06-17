import { Request, Response } from 'express';
import { specificationService } from '../services/specification.service';
import { ilacionService } from '../../ilaciones/services/ilacion.service';
import { educcionService } from '../../educciones/services/educcion.service';
import { projectService } from '../../../projects/services/project.service';
import { SpecificationDTO, SpecificationResponse } from '../models/specification.model';
import * as ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';

export class SpecificationController {
  /**
   * Creates a new specification
   */
  async createSpecification(req: Request, res: Response) {
    try {
      const { orgcod, projcod, educod, ilacod } = req.params;
      const specificationDto: SpecificationDTO = req.body;

      // Verify the project belongs to this organization
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      // Verify the educcion belongs to this project
      const educcion = await educcionService.getEduccionByCode(educod, project.id);
      if (!educcion) {
        return res.status(404).json({ error: 'Educcion not found in this project.' });
      }

      // Verify the ilacion belongs to this educcion
      const ilacion = await ilacionService.getIlacionByCode(ilacod, educcion.id);
      if (!ilacion) {
        return res.status(404).json({ error: 'Ilacion not found in this educcion.' });
      }

      // Validate required fields
      if (!specificationDto.name || specificationDto.name.trim() === '') {
        return res.status(400).json({ error: 'Name is required.' });
      }

      // También deberías validar los campos obligatorios según tus requisitos
      if (!specificationDto.precondition || specificationDto.precondition.trim() === '') {
        return res.status(400).json({ error: 'Precondition is required.' });
      }

      if (!specificationDto.procedure || specificationDto.procedure.trim() === '') {
        return res.status(400).json({ error: 'Procedure is required.' });
      }

      if (!specificationDto.postcondition || specificationDto.postcondition.trim() === '') {
        return res.status(400).json({ error: 'Postcondition is required.' });
      }

      const newSpecification = await specificationService.createSpecification(ilacion.id, specificationDto);

      res.status(201).json({
        message: 'Specification created successfully.',
        specification: newSpecification,
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error creating specification:', err.message);
      res.status(500).json({ error: 'Error creating specification.' });
    }
  }

  /**
   * Gets all specifications from an ilacion
   */
  async getSpecificationsByIlacion(req: Request, res: Response) {
    try {
      const { orgcod, projcod, educod, ilacod } = req.params;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

      // Verify the project belongs to this organization
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      // Verify the educcion belongs to this project
      const educcion = await educcionService.getEduccionByCode(educod, project.id);
      if (!educcion) {
        return res.status(404).json({ error: 'Educcion not found in this project.' });
      }

      // Verify the ilacion belongs to this educcion
      const ilacion = await ilacionService.getIlacionByCode(ilacod, educcion.id);
      if (!ilacion) {
        return res.status(404).json({ error: 'Ilacion not found in this educcion.' });
      }

      const specifications = await specificationService.getSpecificationsByIlacion(ilacion.id, page, limit);
      res.status(200).json(specifications);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching specifications:', err.message);
      res.status(500).json({ error: 'Error fetching specifications.' });
    }
  }

  /**
   * Gets a specification by its code
   */
  async getSpecificationByCode(req: Request, res: Response) {
    try {
      const { orgcod, projcod, educod, ilacod, speccod } = req.params;

      // Verify the project belongs to this organization
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      // Verify the educcion belongs to this project
      const educcion = await educcionService.getEduccionByCode(educod, project.id);
      if (!educcion) {
        return res.status(404).json({ error: 'Educcion not found in this project.' });
      }

      // Verify the ilacion belongs to this educcion
      const ilacion = await ilacionService.getIlacionByCode(ilacod, educcion.id);
      if (!ilacion) {
        return res.status(404).json({ error: 'Ilacion not found in this educcion.' });
      }

      const specification = await specificationService.getSpecificationByCode(speccod, ilacion.id);
      if (!specification) {
        return res.status(404).json({ error: 'Specification not found.' });
      }

      res.status(200).json(specification);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching specification:', err.message);
      res.status(500).json({ error: 'Error fetching specification.' });
    }
  }

  /**
   * Updates a specification
   */
  async updateSpecification(req: Request, res: Response) {
    try {
      const { orgcod, projcod, educod, ilacod, speccod } = req.params;
      const specificationDto: Partial<SpecificationDTO> = req.body;

      // Verify the project belongs to this organization
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      // Verify the educcion belongs to this project
      const educcion = await educcionService.getEduccionByCode(educod, project.id);
      if (!educcion) {
        return res.status(404).json({ error: 'Educcion not found in this project.' });
      }

      // Verify the ilacion belongs to this educcion
      const ilacion = await ilacionService.getIlacionByCode(ilacod, educcion.id);
      if (!ilacion) {
        return res.status(404).json({ error: 'Ilacion not found in this educcion.' });
      }

      // Verify the specification exists and belongs to this ilacion
      const existingSpecification = await specificationService.getSpecificationByCode(speccod, ilacion.id);
      if (!existingSpecification) {
        return res.status(404).json({ error: 'Specification not found.' });
      }

      if (existingSpecification.ilacionId !== ilacion.id) {
        return res.status(404).json({ error: 'Specification not found in this ilacion.' });
      }

      // Validate non-empty fields if provided
      if (specificationDto.name !== undefined && specificationDto.name.trim() === '') {
        return res.status(400).json({ error: 'Name cannot be empty.' });
      }

      if (specificationDto.precondition !== undefined && specificationDto.precondition.trim() === '') {
        return res.status(400).json({ error: 'Precondition cannot be empty.' });
      }

      if (specificationDto.procedure !== undefined && specificationDto.procedure.trim() === '') {
        return res.status(400).json({ error: 'Procedure cannot be empty.' });
      }

      if (specificationDto.postcondition !== undefined && specificationDto.postcondition.trim() === '') {
        return res.status(400).json({ error: 'Postcondition cannot be empty.' });
      }

      const updatedSpecification = await specificationService.updateSpecification(
        existingSpecification.id,
        specificationDto
      );

      res.status(200).json({
        message: 'Specification updated successfully.',
        specification: updatedSpecification,
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error updating specification:', err.message);
      res.status(500).json({ error: 'Error updating specification.' });
    }
  }

  /**
   * Deletes a specification
   */
  async deleteSpecification(req: Request, res: Response) {
    try {
      const { orgcod, projcod, educod, ilacod, speccod } = req.params;

      // Verify the project belongs to this organization
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      // Verify the educcion belongs to this project
      const educcion = await educcionService.getEduccionByCode(educod, project.id);
      if (!educcion) {
        return res.status(404).json({ error: 'Educcion not found in this project.' });
      }

      // Verify the ilacion belongs to this educcion
      const ilacion = await ilacionService.getIlacionByCode(ilacod, educcion.id);
      if (!ilacion) {
        return res.status(404).json({ error: 'Ilacion not found in this educcion.' });
      }

      // Verify the specification exists and belongs to this ilacion
      const existingSpecification = await specificationService.getSpecificationByCode(speccod, ilacion.id);
      if (!existingSpecification) {
        return res.status(404).json({ error: 'Specification not found.' });
      }

      await specificationService.deleteSpecification(existingSpecification.id);

      res.status(200).json({
        message: 'Specification deleted successfully.',
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error deleting specification:', err.message);
      res.status(500).json({ error: 'Error deleting specification.' });
    }
  }

  /**
   * Searches specifications by name
   */
  async searchSpecificationsByName(req: Request, res: Response) {
    try {
      const { orgcod, projcod, educod, ilacod } = req.params;
      const { name } = req.query;

      // Verify the project belongs to this organization
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      // Verify the educcion belongs to this project
      const educcion = await educcionService.getEduccionByCode(educod, project.id);
      if (!educcion) {
        return res.status(404).json({ error: 'Educcion not found in this project.' });
      }

      // Verify the ilacion belongs to this educcion
      const ilacion = await ilacionService.getIlacionByCode(ilacod, educcion.id);
      if (!ilacion) {
        return res.status(404).json({ error: 'Ilacion not found in this educcion.' });
      }

      if (!name || (name as string).trim() === '') {
        return res.status(400).json({ error: 'Name parameter is required for search.' });
      }

      const specifications = await specificationService.searchSpecificationsByName(ilacion.id, name as string);
      res.status(200).json(specifications);
    } catch (error) {
      const err = error as Error;
      console.error('Error searching specifications:', err.message);
      res.status(500).json({ error: 'Error searching specifications.' });
    }
  }

  /**
   * Gets the next unique code without incrementing counter
   */
  async getNextCode(req: Request, res: Response) {
    try {
      const { orgcod, projcod, educod, ilacod } = req.params;

      // Verify the project belongs to this organization
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      // Verify the educcion belongs to this project
      const educcion = await educcionService.getEduccionByCode(educod, project.id);
      if (!educcion) {
        return res.status(404).json({ error: 'Educcion not found in this project.' });
      }

      // Verify the ilacion belongs to this educcion
      const ilacion = await ilacionService.getIlacionByCode(ilacod, educcion.id);
      if (!ilacion) {
        return res.status(404).json({ error: 'Ilacion not found in this educcion.' });
      }

      const nextCode = await specificationService.getNextCodePreview(ilacion.id);
      res.status(200).json({ nextCode });
    } catch (error) {
      const err = error as Error;
      console.error('Error generating next code:', err.message);
      res.status(500).json({ error: 'Error generating next code.' });
    }
  }

  /**
   * Exports specifications to Excel
   */
  async exportToExcel(req: Request, res: Response) {
    try {
      const { orgcod, projcod, educod, ilacod } = req.params;

      // Verify the project belongs to this organization
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      // Verify the educcion belongs to this project
      const educcion = await educcionService.getEduccionByCode(educod, project.id);
      if (!educcion) {
        return res.status(404).json({ error: 'Educcion not found in this project.' });
      }

      // Verify the ilacion belongs to this educcion
      const ilacion = await ilacionService.getIlacionByCode(ilacod, educcion.id);
      if (!ilacion) {
        return res.status(404).json({ error: 'Ilacion not found in this educcion.' });
      }

      // Get all specifications for this ilacion
      const specifications = await specificationService.getSpecificationsByIlacion(ilacion.id, 1, 1000);

      // Create a new workbook
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Specifications');

      // Add headers
      worksheet.columns = [
        { header: 'Code', key: 'code', width: 15 },
        { header: 'Name', key: 'name', width: 30 },
        { header: 'Version', key: 'version', width: 10 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Importance', key: 'importance', width: 15 },
        { header: 'Precondition', key: 'precondition', width: 50 },
        { header: 'Procedure', key: 'procedure', width: 50 },
        { header: 'Postcondition', key: 'postcondition', width: 50 },
        { header: 'Created', key: 'creationDate', width: 20 },
        { header: 'Modified', key: 'modificationDate', width: 20 }
      ];

      // Style the headers
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

      // Add data
      specifications.forEach((spec: SpecificationResponse) => {
        worksheet.addRow({
          code: spec.code,
          name: spec.name,
          version: spec.version,
          status: spec.status || 'N/A',
          importance: spec.importance || 'N/A',
          precondition: spec.precondition || 'N/A',
          procedure: spec.procedure || 'N/A',
          postcondition: spec.postcondition || 'N/A',
          creationDate: spec.creationDate
            ? new Date(spec.creationDate).toLocaleDateString()
            : 'N/A',
          modificationDate: spec.modificationDate
            ? new Date(spec.modificationDate).toLocaleDateString()
            : 'N/A'
        });
      });

      // Auto fit rows for better readability
      worksheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
        if (rowNumber > 1) { // Skip header row
          row.eachCell({ includeEmpty: false }, function (cell) {
            cell.alignment = {
              wrapText: true,
              vertical: 'top'
            };
          });
          // Set a reasonable height for content rows
          row.height = 80;
        }
      });

      // Set content type and disposition
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=specifications.xlsx');

      // Send the workbook
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      const err = error as Error;
      console.error('Error exporting specifications to Excel:', err.message);
      res.status(500).json({ error: 'Error exporting specifications to Excel.' });
    }
  }

  /**
   * Exports specifications to PDF
   */
  async exportToPDF(req: Request, res: Response) {
    try {
      const { orgcod, projcod, educod, ilacod } = req.params;

      // Verify the project belongs to this organization
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      // Verify the educcion belongs to this project
      const educcion = await educcionService.getEduccionByCode(educod, project.id);
      if (!educcion) {
        return res.status(404).json({ error: 'Educcion not found in this project.' });
      }

      // Verify the ilacion belongs to this educcion
      const ilacion = await ilacionService.getIlacionByCode(ilacod, educcion.id);
      if (!ilacion) {
        return res.status(404).json({ error: 'Ilacion not found in this educcion.' });
      }

      // Get all specifications for this ilacion
      const specifications = await specificationService.getSpecificationsByIlacion(ilacion.id, 1, 1000);

      // Create a new PDF document
      const doc = new PDFDocument({
        margin: 30,
        size: 'A4',
        bufferPages: true
      });

      // Set response headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=specifications.pdf');

      // Pipe the PDF to the response
      doc.pipe(res);

      // Add title and metadata
      doc.fontSize(18).text(`Specifications for ${ilacion.name}`, { align: 'center' });
      doc.fontSize(10).text(`Project: ${projcod} - Educcion: ${educod} - Ilacion: ${ilacod}`, { align: 'center' });
      doc.fontSize(10).text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' });
      doc.moveDown(2);

      // Draw specifications one per page
      for (let i = 0; i < specifications.length; i++) {
        const spec = specifications[i];
        if (i > 0) {
          doc.addPage();
        }

        // Add specification header
        doc.fontSize(14).text(`Specification: ${spec.code}`, { underline: true });
        doc.moveDown(1);

        // Create attributes table with the requested structure
        // Adding Precondition, Procedure, and Postcondition to the attributes table
        const attributeRows = [
          ['Code', spec.code || 'N/A'],
          ['Name', spec.name || 'N/A'],
          ['Version', spec.version || 'N/A'],
          ['Status', spec.status || 'N/A'],
          ['Importance', spec.importance || 'N/A'],
          ['Creation Date', spec.creationDate ? new Date(spec.creationDate).toLocaleDateString() : 'N/A'],
          ['Modification Date', spec.modificationDate ? new Date(spec.modificationDate).toLocaleDateString() : 'N/A'],
          ['Precondition', spec.precondition || 'N/A'],
          ['Procedure', spec.procedure || 'N/A'],
          ['Postcondition', spec.postcondition || 'N/A']
        ];

        // If there's a comment, add it to the attributes
        if (spec.comment) {
          attributeRows.push(['Comments', spec.comment]);
        }

        // Draw the attributes table with the "Atributos | Descripción" structure
        this.drawAttributesTable(doc, ['Atributos', 'Descripción'], attributeRows);
        doc.moveDown(1.5);

        // Add page number
        doc.fontSize(8).text(
          `Page ${i + 1} of ${specifications.length}`,
          doc.page.width - 100,
          doc.page.height - 20,
          { align: 'right' }
        );
      }

      // Finalize the PDF and end the response
      doc.end();

    } catch (error) {
      const err = error as Error;
      console.error('Error exporting specifications to PDF:', err.message);
      res.status(500).json({ error: 'Error exporting specifications to PDF.' });
    }
  }

  /**
   * Draw attribute table with "Atributos | Descripción" structure
   * with improved text overflow handling
   */
  private drawAttributesTable(doc: PDFKit.PDFDocument, headers: string[], rows: any[][]) {
    const tableTop = doc.y;
    const tableLeft = 30;
    const tableWidth = doc.page.width - 60;
    const cellPadding = 5;

    // Column widths - first column (attributes) is narrower
    const columnWidths = [tableWidth * 0.3, tableWidth * 0.7];

    // Draw header row
    doc.fontSize(10).font('Helvetica-Bold');
    headers.forEach((header, i) => {
      doc.text(
        header,
        tableLeft + (i === 0 ? 0 : columnWidths[0]) + cellPadding,
        tableTop + cellPadding,
        {
          width: columnWidths[i] - (2 * cellPadding),
          align: 'left'
        }
      );
    });

    // Draw header line
    const headerBottom = tableTop + 20;
    doc.moveTo(tableLeft, headerBottom)
      .lineTo(tableLeft + tableWidth, headerBottom)
      .stroke();

    // Draw rows with dynamic heights
    let currentY = headerBottom;

    for (const row of rows) {
      // Get the text content for each column
      const attributeText = String(row[0] || '');
      const descriptionText = String(row[1] || '');

      // Calculate the height needed for each cell
      const textOptions = { lineBreak: true, width: 0, paragraphGap: 5 };

      const attributeTextOptions = {
        ...textOptions,
        width: columnWidths[0] - (2 * cellPadding)
      };

      const descriptionTextOptions = {
        ...textOptions,
        width: columnWidths[1] - (2 * cellPadding)
      };

      // Measure text using PDFKit's heightOfString method for more accurate height
      doc.font('Helvetica-Bold');
      const attributeHeight = doc.heightOfString(attributeText, attributeTextOptions);

      doc.font('Helvetica');
      const descriptionHeight = doc.heightOfString(descriptionText, descriptionTextOptions);

      // Use the taller height plus padding
      const rowHeight = Math.max(attributeHeight, descriptionHeight) + (2 * cellPadding);

      // Check if we need to start a new page
      if (currentY + rowHeight > doc.page.height - 50) {
        doc.addPage();
        currentY = 50; // Start at top of new page with some margin

        // Redraw table header on new page
        doc.font('Helvetica-Bold').fontSize(10);
        headers.forEach((header, i) => {
          doc.text(
            header,
            tableLeft + (i === 0 ? 0 : columnWidths[0]) + cellPadding,
            currentY + cellPadding,
            {
              width: columnWidths[i] - (2 * cellPadding),
              align: 'left'
            }
          );
        });

        // Draw header line
        currentY += 20;
        doc.moveTo(tableLeft, currentY)
          .lineTo(tableLeft + tableWidth, currentY)
          .stroke();
      }

      // Save current position for borders
      const rowTop = currentY;

      // Draw attribute (left column)
      doc.font('Helvetica-Bold').fontSize(10);
      const attributeY = doc.y;
      doc.text(
        attributeText,
        tableLeft + cellPadding,
        currentY + cellPadding,
        attributeTextOptions
      );

      // Draw description (right column)
      doc.font('Helvetica').fontSize(10);
      doc.text(
        descriptionText,
        tableLeft + columnWidths[0] + cellPadding,
        currentY + cellPadding,
        descriptionTextOptions
      );

      // Update Y position for next row
      currentY += rowHeight;

      // Draw horizontal line below row
      doc.moveTo(tableLeft, currentY)
        .lineTo(tableLeft + tableWidth, currentY)
        .stroke();

      // Draw vertical line between columns
      doc.moveTo(tableLeft + columnWidths[0], rowTop)
        .lineTo(tableLeft + columnWidths[0], currentY)
        .stroke();
    }

    // Draw vertical borders
    doc.moveTo(tableLeft, tableTop)
      .lineTo(tableLeft, currentY)
      .stroke();

    doc.moveTo(tableLeft + tableWidth, tableTop)
      .lineTo(tableLeft + tableWidth, currentY)
      .stroke();

    // Update y position for next element
    doc.y = currentY + 10;
  }
}

export const specificationController = new SpecificationController();