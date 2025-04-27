// backend/src/controllers/proyecto.controller.ts
import { Request, Response } from 'express';
import * as proyectoService from '../services/proyecto.service';
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';

// Crear un nuevo proyecto
export const createProyecto = async (req: Request, res: Response) => {
    try {
        const { orgcod } = req.params;
        const { nombre, descripcion, estado, comentarios } = req.body;

        const newProyecto = await proyectoService.createProyecto(orgcod, {
            nombre,
            descripcion,
            estado,
            comentarios,
        });

        res.status(201).json(newProyecto);
    } catch (error) {
        console.error('Error al crear el proyecto:', error);
        res.status(500).json({ error: 'Error al crear el proyecto' });
    }
};

// Obtener un proyecto por ID
export const getProyectoById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const proyecto = await proyectoService.getProyectoById(id);
        if (!proyecto) return res.status(404).json({ error: 'Proyecto no encontrado' });
        res.status(200).json(proyecto);
    } catch (error) {
        console.error('Error al obtener el proyecto:', error);
        res.status(500).json({ error: 'Error al obtener el proyecto' });
    }
};

// Actualizar un proyecto
export const updateProyecto = async (req: Request, res: Response) => {
    const { orgcod, projcod } = req.params;
    const data = req.body;

    try {
        const proyectoActualizado = await proyectoService.updateProyecto(orgcod, projcod, data);
        res.status(200).json({
            message: 'Proyecto actualizado con éxito.',
            proyecto: proyectoActualizado,
        });
    } catch (err) {
        console.error('Error al actualizar proyecto:', err);
        res.status(500).json({ error: 'Error al actualizar el proyecto.' });
    }
};

// Eliminar un proyecto
export const deleteProyecto = async (req: Request, res: Response) => {
    const { orgcod, projcod } = req.params;

    try {
        const result = await proyectoService.deleteProyecto(orgcod, projcod);
        res.status(200).json({ message: 'Proyecto eliminado exitosamente.' });
    } catch (error) {
        console.error('Error al eliminar el proyecto:', error);
        res.status(500).json({ error: 'Error al eliminar el proyecto' });
    }
};

// Obtener el siguiente código único para un proyecto
export const getNextCode = async (req: Request, res: Response) => {
    try {
        const { orgcod } = req.params;
        const nextCode = await proyectoService.getNextCodigo(orgcod);
        res.status(200).json({ nextCode });
    } catch (error) {
        console.error('Error al obtener el siguiente código:', error);
        res.status(500).json({ error: 'Error al obtener el siguiente código' });
    }
};

// Obtener detalles de un proyecto específico
export const getProyectoByOrgAndCode = async (req: Request, res: Response) => {
    const { orgcod, projcod } = req.params;

    try {
        const proyecto = await proyectoService.getProyectoByOrgAndCode(orgcod, projcod);
        if (!proyecto) return res.status(404).json({ error: 'Proyecto no encontrado' });
        res.status(200).json(proyecto);
    } catch (error) {
        console.error('Error al obtener el proyecto:', error);
        res.status(500).json({ error: 'Error al obtener el proyecto' });
    }
};

// Obtener todos los proyectos de una organización
export const getProyectosByOrganizacion = async (req: Request, res: Response) => {
    const { orgcod } = req.params;

    try {
        const proyectos = await proyectoService.getProyectosByOrganizacion(orgcod);
        res.status(200).json(proyectos);
    } catch (err) {
        console.error('Error al obtener los proyectos:', err);
        res.status(500).json({ error: 'Error al obtener los proyectos' });
    }
};

// Exportar Organizaciones a Excel
export const exportToExcel = async (_req: Request, res: Response) => {
    const { orgcod } = _req.params;
    try {
        const organizaciones = await proyectoService.getProyectosByOrganizacion(orgcod);
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Organizaciones');
        // Agregar encabezados
        worksheet.columns = [
            { header: 'Código', key: 'codigo', width: 15 },
            { header: 'Nombre', key: 'nombre', width: 30 },
            { header: 'Fecha de Creación', key: 'fechaCreacion', width: 20 },
            { header: 'Fecha de Modificacion', key: 'fechaModificacion', width: 20 },
            { header: 'Estado', key: 'estado', width: 30 },
        ];
        // Agregar datos
        // // organizaciones.forEach((orgcod) => {
        // //     worksheet.addRow({
        // //         codigo: orgcod.codigo,
        // //         nombre: orgcod.nombre,
        // //         fechaCreacion: orgcod.fechaCreacion.toISOString().split('T')[0],
        // //         orgcod: orgcod.fechaModificacion instanceof Date
        // //             ? orgcod.fechaModificacion.toISOString().split('T')[0]
        // //             : orgcod.fechaModificacion || 'N/A',
        // //         fechaModificacion: orgcod.fechaModificacion,
        // //         estado: orgcod.estado,
        // //     });
        // });
        // Configurar la respuesta HTTP para descargar el archivo
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader('Content-Disposition', `attachment; filename=proyectos-${orgcod}.xlsx`);
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error al exportar a Excel:', error);
        res.status(500).json({ error: 'Error al exportar a Excel' });
    }
};
// Exportar Organizaciones a PDF
export const exportToPDF = async (_req: Request, res: Response) => {
    const { orgcod } = _req.params;
    try {
        const organizaciones = await proyectoService.getProyectosByOrganizacion(orgcod);
        const doc = new PDFDocument({ size: 'A4', margin: 30 });
        // Configurar encabezados de respuesta
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=proyectos-${orgcod}.pdf`);
        // Conectar el flujo de datos del PDF con la respuesta HTTP
        doc.pipe(res);
        // Encabezado del PDF
        doc.fontSize(18).text(`Lista de Proyectos de la Organización ${orgcod}`, { align: 'center' });
        doc.moveDown();
        // Crear la tabla con los datos de los proyectos
        const tableHeaders = ['Código', 'Nombre', 'Fecha Creación', 'Fecha Modificación', 'Estado'];
        const columnWidths = [80, 150, 100, 120, 80];
        const rowHeight = 20;
        // Dibujar encabezados de tabla
        let y = doc.y;
        doc.fontSize(10).font('Helvetica-Bold');
        tableHeaders.forEach((header, index) => {
            const x = columnWidths.slice(0, index).reduce((a, b) => a + b, 0) + 30;
            doc.text(header, x, y, { width: columnWidths[index], align: 'center' });
        });
        y += rowHeight;
        // Dibujar filas de datos
        doc.font('Helvetica').fontSize(10);
        // organizaciones.forEach((proyecto) => {
        //     const row = [
        //         proyecto.codigo || 'N/A',
        //         proyecto.nombre || 'N/A',
        //         proyecto.fechaCreacion instanceof Date
        //             ? proyecto.fechaCreacion.toISOString().split('T')[0]
        //             : proyecto.fechaCreacion || 'N/A',
        //         proyecto.fechaModificacion instanceof Date
        //             ? proyecto.fechaModificacion.toISOString().split('T')[0]
        //             : proyecto.fechaModificacion || 'N/A',
        //         proyecto.estado || 'N/A',
        //     ];
        //     row.forEach((cell, index) => {
        //         const x = columnWidths.slice(0, index).reduce((a, b) => a + b, 0) + 30;
        //         doc.text(String(cell), x, y, { width: columnWidths[index], align: 'center' });
        //     });
        //     y += rowHeight;
        // });
        // Finalizar el documento
        doc.end();
    } catch (error) {
        console.error('Error al exportar a PDF:', error);
        res.status(500).json({ error: 'Error al exportar a PDF' });
    }
};


// Buscar proyectos por nombre
export const searchProyectos = async (req: Request, res: Response) => {
    try{
        const {orgcod} = req.params;
        const {nombre} = req.query;

        if(typeof nombre !== 'string'){
            return res.status(400).json({error: 'Parámetros inválidos'});
        }
        const proyectos = await proyectoService.searchProyectosByNombre(orgcod, nombre);
        res.status(200).json(proyectos);   
    }
    catch (error){
        console.error('Error al buscar proyectos:', error);
        res.status(500).json({ error: 'Error al buscar proyectos' });
    }
};
//buscar proyectos por fecha(month and year)
export const searchProyectosByDate = async (req: Request, res: Response) => {
    try {
        const { orgcod } = req.params;
        const { year, month } = req.query;

        // Validar que al menos uno de los parámetros esté presente
        if (!year && !month) {
            return res.status(400).json({ error: 'Debe proporcionar al menos año o mes' });
        }

        // Validar formato de año y mes si están presentes
        if (year && !/^\d{4}$/.test(year as string)) {
            return res.status(400).json({ error: 'Formato de año inválido' });
        }

        if (month && (parseInt(month as string) < 1 || parseInt(month as string) > 12)) {
            return res.status(400).json({ error: 'Mes debe estar entre 1 y 12' });
        }

        const proyectos = await proyectoService.searchProyectosByDate(
            orgcod,
            year as string,
            month as string
        );
        res.status(200).json(proyectos);
    } catch (error) {
        console.error('Error en la búsqueda de proyectos:', error);
        res.status(500).json({ error: 'Error al buscar proyectos' });
    }
};