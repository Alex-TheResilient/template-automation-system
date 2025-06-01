import { Request, Response } from 'express';
import { projectService } from '../services/project.service';
import { ProjectDTO } from '../models/project.model';
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';

export class ProjectController {
  /**
   * Creates a new project
   */
  async createProject(req: Request, res: Response) {
    try {
      const { orgcod } = req.params;
      const { name, description, status, comments } = req.body;

      const projectData: ProjectDTO = {
        name,
        description,
        status,
        comments
      };

      const newProject = await projectService.createProject(orgcod, projectData);

      res.status(201).json(newProject);
    } catch (error) {
      console.error('Error creating project:', error);
      res.status(500).json({ error: 'Error creating project' });
    }
  }

  /**
   * Updates a project
   */
  async updateProject(req: Request, res: Response) {
    const { orgcod, projcod } = req.params;
    const data = req.body;

    try {
      const updatedProject = await projectService.updateProject(orgcod, projcod, data);
      res.status(200).json({
        message: 'Project updated successfully',
        project: updatedProject,
      });
    } catch (err) {
      console.error('Error updating project:', err);
      res.status(500).json({ error: 'Error updating project' });
    }
  }

  /**
   * Deletes a project
   */
  async deleteProject(req: Request, res: Response) {
    const { orgcod, projcod } = req.params;

    try {
      await projectService.deleteProject(orgcod, projcod);
      res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
      console.error('Error deleting project:', error);
      res.status(500).json({ error: 'Error deleting project' });
    }
  }

  /**
   * Gets a project by organization code and project code
   */
  async getProjectByOrgAndCode(req: Request, res: Response) {
    const { orgcod, projcod } = req.params;

    try {
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
      if (!project) return res.status(404).json({ error: 'Project not found' });
      res.status(200).json(project);
    } catch (error) {
      console.error('Error getting project:', error);
      res.status(500).json({ error: 'Error getting project' });
    }
  }

  /**
   * Gets all projects for an organization
   */
  async getProjectsByOrganization(req: Request, res: Response) {
    const { orgcod } = req.params;

    try {
      const projects = await projectService.getProjectsByOrganization(orgcod);
      res.status(200).json(projects);
    } catch (err) {
      console.error('Error getting projects:', err);
      res.status(500).json({ error: 'Error getting projects' });
    }
  }

  /**
   * Gets the next unique code for a project without incrementing the counter
   */
  async getNextCode(req: Request, res: Response) {
    try {
      const { orgcod } = req.params;
      // Cambiamos a usar getNextCodePreview
      const nextCode = await projectService.getNextCodePreview(orgcod);
      res.status(200).json({ nextCode });
    } catch (error) {
      console.error('Error getting next code:', error);
      res.status(500).json({ error: 'Error getting next code' });
    }
  }

  /**
   * Searches projects by name
   */
  async searchProjects(req: Request, res: Response) {
    try {
      const { orgcod } = req.params;
      const { name } = req.query;

      if (typeof name !== 'string') {
        return res.status(400).json({ error: 'Invalid parameters' });
      }

      const projects = await projectService.searchProjectsByName(orgcod, name);
      res.status(200).json(projects);
    } catch (error) {
      console.error('Error searching projects:', error);
      res.status(500).json({ error: 'Error searching projects' });
    }
  }

  /**
   * Searches projects by date
   */
  async searchProjectsByDate(req: Request, res: Response) {
    try {
      const { orgcod } = req.params;
      const { year, month } = req.query;

      // Validate that at least one parameter is present
      if (!year && !month) {
        return res.status(400).json({ error: 'You must provide at least year or month' });
      }

      // Validate year and month format if present
      if (year && !/^\d{4}$/.test(year as string)) {
        return res.status(400).json({ error: 'Invalid year format' });
      }

      if (month && (parseInt(month as string) < 1 || parseInt(month as string) > 12)) {
        return res.status(400).json({ error: 'Month must be between 1 and 12' });
      }

      const projects = await projectService.searchProjectsByDate(
        orgcod,
        year as string,
        month as string
      );

      res.status(200).json(projects);
    } catch (error) {
      console.error('Error searching projects by date:', error);
      res.status(500).json({ error: 'Error searching projects' });
    }
  }

  /**
   * Exports projects to Excel
   */
  async exportToExcel(req: Request, res: Response) {
    const { orgcod } = req.params;
    try {
      const projects = await projectService.getProjectsByOrganization(orgcod);
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Projects');

      // Add headers
      worksheet.columns = [
        { header: 'Code', key: 'code', width: 15 },
        { header: 'Name', key: 'name', width: 30 },
        { header: 'Creation Date', key: 'creationDate', width: 20 },
        { header: 'Modification Date', key: 'modificationDate', width: 20 },
        { header: 'Status', key: 'status', width: 30 },
      ];

      // Add data
      projects.forEach(project => {
        worksheet.addRow({
          code: project.code,
          name: project.name,
          creationDate: project.creationDate,
          modificationDate: project.modificationDate,
          status: project.status
        });
      });

      // Set response headers
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=projects-${orgcod}.xlsx`);

      // Write to response
      await workbook.xlsx.write(res);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      res.status(500).json({ error: 'Error exporting to Excel' });
    }
  }

  /**
   * Exports projects to PDF
   */
  async exportToPDF(req: Request, res: Response) {
    const { orgcod } = req.params;
    try {
      const projects = await projectService.getProjectsByOrganization(orgcod);
      const doc = new PDFDocument({ size: 'A4', margin: 30 });

      // Set response headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=projects-${orgcod}.pdf`);

      // Pipe PDF to response
      doc.pipe(res);

      // PDF header
      doc.fontSize(18).text(`Project List for Organization ${orgcod}`, { align: 'center' });
      doc.moveDown();

      // Create table with project data
      let y = 150;
      const rowHeight = 20;
      const columnWidths = [80, 150, 100, 100, 80];

      // Table headers
      doc.fontSize(12).text('Code', 30, y);
      doc.text('Name', 110, y);
      doc.text('Creation Date', 260, y);
      doc.text('Mod. Date', 360, y);
      doc.text('Status', 460, y);

      y += rowHeight;

      // Table rows
      projects.forEach(project => {
        doc.fontSize(10).text(project.code, 30, y);
        doc.text(project.name, 110, y, { width: 150 });
        doc.text(project.creationDate instanceof Date
          ? project.creationDate.toISOString().split('T')[0]
          : 'N/A', 260, y);
        doc.text(project.modificationDate instanceof Date
          ? project.modificationDate.toISOString().split('T')[0]
          : 'N/A', 360, y);
        doc.text(project.status || 'N/A', 460, y);

        y += rowHeight;
      });

      // Finalize document
      doc.end();
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      res.status(500).json({ error: 'Error exporting to PDF' });
    }
  }

  /**
   * Exports project requirements catalog to PDF
   */
  async exportRequirementsCatalogToPDF(req: Request, res: Response) {
    try {
      const { orgcod, projcod } = req.params;

      // Get the project with all its requirements using the service layer
      const { project, educciones } = await projectService.getProjectRequirementsCatalog(orgcod, projcod);

      // Create PDF document
      const doc = new PDFDocument({ margin: 50, size: 'A4' });

      // Set response headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=requirements-catalog-${project.code}.pdf`);

      // Pipe PDF to response
      doc.pipe(res);

      // Configuración de tabla
      const pageWidth = doc.page.width - 100; // Ancho de página menos márgenes
      const colWidth1 = 150; // Ancho de la primera columna (atributos)
      const colWidth2 = pageWidth - colWidth1; // Ancho de la segunda columna (descripciones)

      // Función para agregar una fila a la tabla
      const addTableRow = (attribute: string, value: string, x: number, y: number, fontSize: number = 10): number => {
        // Dibujar bordes de celda
        doc.rect(x, y, colWidth1, 25).stroke();
        doc.rect(x + colWidth1, y, colWidth2, 25).stroke();

        // Agregar texto centrado verticalmente
        doc.fontSize(fontSize);
        doc.text(attribute, x + 5, y + 7, { width: colWidth1 - 10 });
        doc.text(value, x + colWidth1 + 5, y + 7, { width: colWidth2 - 10 });

        return y + 25; // Devolver la nueva posición Y
      };

      // Función para crear un encabezado de sección
      const addSectionHeader = (title: string, x: number, y: number, fontSize: number = 14): number => {
        doc.fontSize(fontSize).text(title, x, y, { underline: true });
        return y + 30; // Espacio después del encabezado
      };

      // Cabecera del documento
      doc.fontSize(24).text(`Catálogo de Requisitos - ${project.name}`, { align: 'center' });
      doc.moveDown(2);

      let y = 150;

      // Información del proyecto
      y = addSectionHeader('Información del Proyecto', 50, y);
      y = addTableRow('Código', project.code, 50, y);
      y = addTableRow('Nombre', project.name, 50, y);
      y = addTableRow('Organización', project.organization?.name || orgcod, 50, y);
      y = addTableRow('Fecha de Generación', new Date().toLocaleString(), 50, y);

      y += 30;

      // Sección de Educciones
      if (educciones.length === 0) {
        y = addSectionHeader('1. Educciones', 50, y);
        doc.text('No hay educciones registradas para este proyecto.', 50, y);
      } else {
        educciones.forEach((educcion, eIndex) => {
          // Nueva página para cada educción excepto la primera
          if (eIndex > 0) {
            doc.addPage();
            y = 50;
          }

          // Encabezado de educción
          y = addSectionHeader(`1.${eIndex + 1}. Educción: ${educcion.code}`, 50, y);

          // Tabla con detalles de la educción
          y = addTableRow('Nombre', educcion.name, 50, y);
          y = addTableRow('Descripción', educcion.description, 50, y);
          y = addTableRow('Estado', educcion.status, 50, y);
          y = addTableRow('Importancia', educcion.importance, 50, y);
          if (educcion.comment) {
            y = addTableRow('Comentarios', educcion.comment, 50, y);
          }

          y += 20;

          // Sección de Ilaciones
          if (educcion.ilaciones.length > 0) {
            educcion.ilaciones.forEach((ilacion, iIndex) => {
              // Verificar si es necesario agregar una nueva página
              if (y > doc.page.height - 150) {
                doc.addPage();
                y = 50;
              }

              // Encabezado de ilación
              y = addSectionHeader(`1.${eIndex + 1}.${iIndex + 1}. Ilación: ${ilacion.code}`, 50, y, 12);

              // Tabla con detalles de la ilación
              y = addTableRow('Nombre', ilacion.name, 50, y);
              y = addTableRow('Precondición', ilacion.precondition, 50, y);
              y = addTableRow('Procedimiento', ilacion.procedure, 50, y);
              y = addTableRow('Postcondición', ilacion.postcondition, 50, y);
              y = addTableRow('Estado', ilacion.status, 50, y);
              y = addTableRow('Importancia', ilacion.importance, 50, y);
              if (ilacion.comment) {
                y = addTableRow('Comentarios', ilacion.comment, 50, y);
              }

              y += 15;

              // Sección de Especificaciones
              if (ilacion.specifications.length > 0) {
                ilacion.specifications.forEach((spec, sIndex) => {
                  // Verificar si es necesario agregar una nueva página
                  if (y > doc.page.height - 150) {
                    doc.addPage();
                    y = 50;
                  }

                  // Encabezado de especificación
                  y = addSectionHeader(`1.${eIndex + 1}.${iIndex + 1}.${sIndex + 1}. Especificación: ${spec.code}`, 50, y, 11);

                  // Tabla con detalles de la especificación
                  y = addTableRow('Nombre', spec.name, 50, y, 9);
                  y = addTableRow('Precondición', spec.precondition, 50, y, 9);
                  y = addTableRow('Procedimiento', spec.procedure, 50, y, 9);
                  y = addTableRow('Postcondición', spec.postcondition, 50, y, 9);
                  y = addTableRow('Estado', spec.status, 50, y, 9);
                  y = addTableRow('Importancia', spec.importance, 50, y, 9);
                  if (spec.comment) {
                    y = addTableRow('Comentarios', spec.comment, 50, y, 9);
                  }

                  y += 15;
                });
              }
            });
          } else {
            y = addSectionHeader(`Ilaciones de ${educcion.code}`, 50, y, 12);
            doc.text('No hay ilaciones registradas para esta educción.', 50, y);
          }
        });
      }

      // Finish PDF
      doc.end();

    } catch (error) {
      console.error('Error exporting requirements catalog:', error);
      res.status(500).json({ error: 'Error exporting requirements catalog to PDF' });
    }
  }
}

// Export singleton instance of the controller
export const projectController = new ProjectController();