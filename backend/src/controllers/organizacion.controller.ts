// backend/src/controllers/organizacion.controller.ts

import { Request, Response } from 'express';
import * as organizacionService from '../services/organizacion.service';
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';

export const createOrganizacion = async (req: Request, res: Response) => {
    try {
        const { nombre } = req.body;
        if (!nombre || nombre.trim() === '') {
            return res.status(400).json({ error: 'El nombre es obligatorio.' });
        }

        const data = req.body;
        const newOrganizacion = await organizacionService.createOrganizacion(data);

        res.status(201).json({
            message: 'Organización creada con éxito.',
            organizacion: newOrganizacion,
        });
    } catch (error) {
        const err = error as Error;
        console.error('Error al crear la organización:', err.message);
        res.status(500).json({ error: 'Error al crear la organización.' });
    }
};

export const getOrganizaciones = async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const organizaciones = await organizacionService.getOrganizaciones(
            parseInt(page as string),
            parseInt(limit as string)
        );

        res.status(200).json(organizaciones);
    } catch (error) {
        const err = error as Error;
        console.error('Error al obtener las organizaciones:', err.message);
        res.status(500).json({ error: 'Error al obtener las organizaciones.' });
    }
};

export const getOrganizacionById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const organizacion = await organizacionService.getOrganizacionById(id);

        if (!organizacion) {
            return res.status(404).json({ error: `Organización con ID ${id} no encontrada.` });
        }

        res.status(200).json(organizacion);
    } catch (error) {
        const err = error as Error;
        console.error('Error al obtener la organización:', err.message);
        res.status(500).json({ error: 'Error al obtener la organización.' });
    }
};

export const getOrganizacionByCodigo = async (req: Request, res: Response) => {
    try {
        const { orgcod } = req.params;

        const organizacion = await organizacionService.getOrganizacionByCodigo(orgcod);

        if (!organizacion) {
            return res.status(404).json({ error: 'Organización no encontrada' });
        }

        res.status(200).json(organizacion);
    } catch (error) {
        const err = error as Error;
        console.error('Error al obtener la organización por código:', err.message);
        res.status(500).json({ error: 'Error al buscar la organización.' });
    }
};


export const updateOrganizacion = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = req.body;

        if (data.nombre && data.nombre.trim() === '') {
            return res.status(400).json({ error: 'El nombre no puede estar vacío.' });
        }

        const updatedOrganizacion = await organizacionService.updateOrganizacion(id, data);
        res.status(200).json({
            message: 'Organización actualizada con éxito.',
            organizacion: updatedOrganizacion,
        });
    } catch (error) {
        const err = error as Error;
        console.error('Error al actualizar la organización:', err.message);
        res.status(500).json({ error: 'Error al actualizar la organización.' });
    }
};

export const deleteOrganizacion = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const organizacion = await organizacionService.getOrganizacionById(id);

        if (!organizacion) {
            return res.status(404).json({ error: `Organización con ID ${id} no encontrada.` });
        }

        await organizacionService.deleteOrganizacion(id);
        res.status(204).send();
    } catch (error) {
        const err = error as Error;
        console.error('Error al eliminar la organización:', err.message);
        res.status(500).json({ error: 'Error al eliminar la organización.' });
    }
};

export const getMainOrganization = async (_req: Request, res: Response) => {
    try {
        const mainOrganization = await organizacionService.getMainOrganization();

        if (!mainOrganization) {
            console.error('No se encontró la organización principal en la base de datos.');
            return res.status(404).json({ error: 'No encontrada' });
        }

        res.json(mainOrganization);
    } catch (error) {
        console.error('Error al obtener la organización principal:', error);
        res.status(500).json({ error: 'Error al obtener la organización principal.' });
    }
};

export const getNextCode = async (_req: Request, res: Response) => {
    try {
        const nextCode = await organizacionService.getNextCode();
        res.status(200).json({ nextCode });
    } catch (error) {
        const err = error as Error;
        console.error('Error al obtener el siguiente código:', err.message);
        res.status(500).json({ error: 'Error al obtener el siguiente código.' });
    }
};

//busquedaPorNombre
export const searchOrganizaciones = async (req: Request, res: Response) => {
    try {
        const { nombre } = req.query;
        const organizaciones = await organizacionService.searchOrganizacionesByName(nombre as string);
        res.status(200).json(organizaciones);
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ error: err.message });
    }
};

// Exportar Organizaciones a Excel
export const exportToExcel = async (_req: Request, res: Response) => {
    try {
        const organizaciones = await organizacionService.getOrganizaciones(1, 1000);

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Organizaciones');

        // Agregar encabezados
        worksheet.columns = [
            { header: 'Código', key: 'codigo', width: 15 },
            { header: 'Nombre', key: 'nombre', width: 30 },
            { header: 'Fecha de Creación', key: 'fechaCreacion', width: 20 },
            { header: 'Versión', key: 'version', width: 10 },
        ];

        // Agregar datos
        organizaciones.forEach((org) => {
            worksheet.addRow({
                codigo: org.codigo,
                nombre: org.nombre,
                fechaCreacion: org.fechaCreacion.toISOString().split('T')[0],
                version: org.version,
            });
        });

        // Configurar la respuesta HTTP para descargar el archivo
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader('Content-Disposition', 'attachment; filename=organizaciones.xlsx');

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error al exportar a Excel:', error);
        res.status(500).json({ error: 'Error al exportar a Excel' });
    }
};

// Exportar Organizaciones a PDF
export const exportToPDF = async (_req: Request, res: Response) => {
    try {
        const organizaciones = await organizacionService.getOrganizaciones(1, 1000);
        const doc = new PDFDocument({  size: 'A4',margin: 30 });

        // Configurar encabezados de respuesta
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=organizaciones.pdf');

        // Encabezado
        doc.fontSize(18).text('Lista de Organizaciones', { align: 'center' });
        doc.moveDown();

        // Crear la tabla con los datos de las organizaciones
        const tableTop = doc.y;
        const table = {
            headers: ['Código', 'Nombre', 'Fecha Modificación', 'Versión'],
            rows: organizaciones.map(org => [
                org.codigo,
                org.nombre,
                org.fechaCreacion.toLocaleDateString(),
                org.version
            ])
        };
        const columnWidths = [80, 150, 100, 60, 80];
        const rowHeight = 20;
        const startY = tableTop;
        // Función para dibujar la tabla
        const drawTable = () => {
            let y = startY;
            // Dibuja los encabezados
            doc.fontSize(10).font('Helvetica-Bold');
            table.headers.forEach((header, index) => {
                const x = columnWidths.slice(0, index).reduce((a, b) => a + b, 0) + 100;
                doc.text(header, x, y, { width: columnWidths[index], align: 'center' });
            });
            y += rowHeight;
            // Dibuja las filas de datos
            doc.font('Helvetica');
            table.rows.forEach((row: any[]) => {
                row.forEach((cell, index) => {
                    const x = columnWidths.slice(0, index).reduce((a, b) => a + b, 0) + 100;
                    doc.text(String(cell), x, y, { width: columnWidths[index], align: 'center' });
                });
                y += rowHeight;
            });
        };
        // Dibujar la tabla en el PDF
        drawTable();
        doc.end();
        doc.pipe(res);
    } catch (error) {
        console.error('Error al exportar a PDF:', error);
        res.status(500).json({ error: 'Error al exportar a PDF' });
    }
};


export const getOrganizacionWithProyectos = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const organizacion = await organizacionService.getOrganizacionWithProyectos(id);

        if (!organizacion) {
            return res.status(404).json({ error: `Organización con ID ${id} no encontrada.` });
        }

        res.status(200).json(organizacion);
    } catch (error) {
        const err = error as Error;
        console.error('Error al obtener la organización con proyectos:', err.message);
        res.status(500).json({ error: 'Error al obtener la organización con proyectos.' });
    }
};
