// // backend/src/controllers/organizacion.controller.ts

// import { Request, Response } from 'express';
// import * as organizacionService from '../services/organizacion.service';
// import ExcelJS from 'exceljs';
// import PDFDocument from 'pdfkit';

// export const createOrganizacion = async (req: Request, res: Response) => {
//     try {
//         const { nombre } = req.body;
//         if (!nombre || nombre.trim() === '') {
//             return res.status(400).json({ error: 'El nombre es obligatorio.' });
//         }

//         const data = req.body;
//         const newOrganizacion = await organizacionService.createOrganizacion(data);

//         res.status(201).json({
//             message: 'Organización creada con éxito.',
//             organizacion: newOrganizacion,
//         });
//     } catch (error) {
//         const err = error as Error;
//         console.error('Error al crear la organización:', err.message);
//         res.status(500).json({ error: 'Error al crear la organización.' });
//     }
// };

// export const getOrganizaciones = async (req: Request, res: Response) => {
//     try {
//         const { page = 1, limit = 10 } = req.query;
//         const organizaciones = await organizacionService.getOrganizaciones(
//             parseInt(page as string),
//             parseInt(limit as string)
//         );

//         res.status(200).json(organizaciones);
//     } catch (error) {
//         const err = error as Error;
//         console.error('Error al obtener las organizaciones:', err.message);
//         res.status(500).json({ error: 'Error al obtener las organizaciones.' });
//     }
// };

// export const getOrganizacionById = async (req: Request, res: Response) => {
//     try {
//         const { id } = req.params;
//         const organizacion = await organizacionService.getOrganizacionById(id);

//         if (!organizacion) {
//             return res.status(404).json({ error: `Organización con ID ${id} no encontrada.` });
//         }

//         res.status(200).json(organizacion);
//     } catch (error) {
//         const err = error as Error;
//         console.error('Error al obtener la organización:', err.message);
//         res.status(500).json({ error: 'Error al obtener la organización.' });
//     }
// };

// export const getOrganizacionByCodigo = async (req: Request, res: Response) => {
//     try {
//         const { orgcod } = req.params;

//         const organizacion = await organizacionService.getOrganizacionByCodigo(orgcod);

//         if (!organizacion) {
//             return res.status(404).json({ error: 'Organización no encontrada' });
//         }

//         res.status(200).json(organizacion);
//     } catch (error) {
//         const err = error as Error;
//         console.error('Error al obtener la organización por código:', err.message);
//         res.status(500).json({ error: 'Error al buscar la organización.' });
//     }
// };

// export const getProyectosByOrganizacion = async (req: Request, res: Response) => {
//     try {
//         const { orgcod } = req.params;

//         // Busca la organización y sus proyectos
//         const proyectos = await organizacionService.getProyectosByOrganizacion(orgcod);

//         if (!proyectos) {
//             return res
//                 .status(404)
//                 .json({ error: `No se encontraron proyectos para la organización ${orgcod}.` });
//         }

//         res.status(200).json(proyectos);
//     } catch (error) {
//         const err = error as Error;
//         console.error('Error al obtener proyectos por organización:', err.message);
//         res.status(500).json({ error: 'Error al obtener los proyectos de la organización.' });
//     }
// };

// export const updateOrganizacion = async (req: Request, res: Response) => {
//     try {
//         const { orgcod } = req.params; // Extraer orgcod de los parámetros
//         const data = req.body;

//         // Validar que el nombre no sea vacío
//         if (data.nombre && data.nombre.trim() === '') {
//             return res.status(400).json({ error: 'El nombre no puede estar vacío.' });
//         }

//         // Llamar al servicio para actualizar la organización por orgcod
//         const updatedOrganizacion = await organizacionService.updateOrganizacionByCodigo(orgcod, data);

//         res.status(200).json({
//             message: 'Organización actualizada con éxito.',
//             organizacion: updatedOrganizacion,
//         });
//     } catch (error) {
//         const err = error as Error;
//         console.error('Error al actualizar la organización:', err.message);
//         res.status(500).json({ error: 'Error al actualizar la organización.' });
//     }
// };

// export const deleteOrganizacion = async (req: Request, res: Response) => {
//     try {
//         const { id } = req.params;
//         const organizacion = await organizacionService.getOrganizacionById(id);

//         if (!organizacion) {
//             return res.status(404).json({ error: `Organización con ID ${id} no encontrada.` });
//         }

//         await organizacionService.deleteOrganizacion(id);
//         res.status(204).send();
//     } catch (error) {
//         const err = error as Error;
//         console.error('Error al eliminar la organización:', err.message);
//         res.status(500).json({ error: 'Error al eliminar la organización.' });
//     }
// };

// export const getMainOrganization = async (_req: Request, res: Response) => {
//     try {
//         const mainOrganization = await organizacionService.getMainOrganization();

//         if (!mainOrganization) {
//             console.error('No se encontró la organización principal en la base de datos.');
//             return res.status(404).json({ error: 'No encontrada' });
//         }

//         res.json(mainOrganization);
//     } catch (error) {
//         console.error('Error al obtener la organización principal:', error);
//         res.status(500).json({ error: 'Error al obtener la organización principal.' });
//     }
// };

// export const getNextCode = async (_req: Request, res: Response) => {
//     try {
//         const nextCode = await organizacionService.getNextCode();
//         res.status(200).json({ nextCode });
//     } catch (error) {
//         const err = error as Error;
//         console.error('Error al obtener el siguiente código:', err.message);
//         res.status(500).json({ error: 'Error al obtener el siguiente código.' });
//     }
// };

// //busquedaPorNombre
// export const searchOrganizaciones = async (req: Request, res: Response) => {
//     try {
//         const { nombre } = req.query;
        
//         console.log('Término de búsqueda:', nombre); // Para depuración
        
//         const organizaciones = await organizacionService.searchOrganizacionesByName(nombre as string);
        
//         console.log('Resultados encontrados:', organizaciones.length); // Para depuración
        
//         res.status(200).json(organizaciones);
//     } catch (error) {
//         console.error('Error en la búsqueda:', error);
//         res.status(500).json({ error: 'Error al buscar organizaciones' });
//     }
// };

// //busqueda por fecha(año y mes)
// export const searchOrganizacionesByDate = async (req: Request, res: Response) => {
//     try{
//         const {year, month} = req.query;
//         //si no hay criterio de busqueda, retorna todas las organizaciones
//         if(!year && !month){
//             const organizaciones = await organizacionService.searchOrganizacionesByDate();
//             res.status(200).json(organizaciones);   
//         }
//         const organizaciones = await organizacionService.searchOrganizacionesByDate(
//             year as string,
//             month as string
//         );
//         res.status(200).json(organizaciones);
//     }catch(error){
//         console.error('Error en la búsqueda por fecha', error);
//         res.status(500).json({ error: 'Error al buscar organizaciones por fecha' });
//     }
// };


// // Exportar Organizaciones a Excel
// export const exportToExcel = async (_req: Request, res: Response) => {
//     try {
//         const organizaciones = await organizacionService.getOrganizaciones(1, 1000);

//         const workbook = new ExcelJS.Workbook();
//         const worksheet = workbook.addWorksheet('Organizaciones');

//         // Agregar encabezados
//         worksheet.columns = [
//             { header: 'Código', key: 'codigo', width: 15 },
//             { header: 'Nombre', key: 'nombre', width: 30 },
//             { header: 'Fecha de Creación', key: 'fechaCreacion', width: 20 },
//             { header: 'Versión', key: 'version', width: 10 },
//         ];

//         // Agregar datos
//         organizaciones.forEach((org) => {
//             worksheet.addRow({
//                 codigo: org.codigo,
//                 nombre: org.nombre,
//                 fechaCreacion: org.fechaCreacion.toISOString().split('T')[0],
//                 version: org.version,
//             });
//         });

//         // Configurar la respuesta HTTP para descargar el archivo
//         res.setHeader(
//             'Content-Type',
//             'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
//         );
//         res.setHeader('Content-Disposition', 'attachment; filename=organizaciones.xlsx');

//         await workbook.xlsx.write(res);
//         res.end();
//     } catch (error) {
//         console.error('Error al exportar a Excel:', error);
//         res.status(500).json({ error: 'Error al exportar a Excel' });
//     }
// };

// // Exportar Organizaciones a PDF
// export const exportToPDF = async (_req: Request, res: Response) => {
//     try {
//         // Obtener datos de la organización principal y las organizaciones
//         const organizacionPrincipal = await organizacionService.getOrganizacionPrincipal();
//         let organizaciones = await organizacionService.getOrganizaciones(1, 1000);

//         // Filtrar la organización principal de la lista de organizaciones
//         organizaciones = organizaciones.filter(org => org.codigo !== organizacionPrincipal.codigo);

//         const doc = new PDFDocument({ size: 'A4', margin: 30 });

//         // Configurar encabezados de respuesta
//         res.setHeader('Content-Type', 'application/pdf');
//         res.setHeader('Content-Disposition', 'attachment; filename=organizaciones.pdf');

//         // Encabezado del documento
//         doc.fontSize(18).text('Lista de Organizaciones', { align: 'center' });
//         doc.moveDown();

//         // Título para la tabla de la organización principal
//         doc.fontSize(14).text('Organización Principal', { align: 'center' });
//         doc.moveDown(0.5);

//         const principalHeaders = ['Código', 'Nombre', 'Fecha Creación', 'Versión'];
//         const principalData = [
//             [
//                 organizacionPrincipal.codigo,
//                 organizacionPrincipal.nombre,
//                 organizacionPrincipal.fechaCreacion.toLocaleDateString(),
//                 organizacionPrincipal.version
//             ]
//         ];

//         drawTable(doc, principalHeaders, principalData);

//         doc.moveDown(2);

//         // Título para la tabla de las organizaciones (centrado manualmente)
//         const pageWidth = 595.28; // Ancho de página A4 en puntos
//         const textWidth = doc.widthOfString('Organizaciones');
//         const textX = (pageWidth - textWidth) / 2; // Calcular posición X para centrar el texto
//         doc.fontSize(14).text('Organizaciones', textX, doc.y); // Posición Y actual de doc.y
//         doc.moveDown(0.5);

//         const orgHeaders = ['Código', 'Nombre', 'Fecha Creación', 'Versión'];
//         const orgData = organizaciones.map(org => [
//             org.codigo,
//             org.nombre,
//             org.fechaCreacion.toLocaleDateString(),
//             org.version
//         ]);

//         drawTable(doc, orgHeaders, orgData);

//         // Finalizar el documento
//         doc.end();
//         doc.pipe(res);
//     } catch (error) {
//         console.error('Error al exportar a PDF:', error);
//         res.status(500).json({ error: 'Error al exportar a PDF' });
//     }
// };

// // Función para dibujar tablas
// const drawTable = (doc: PDFKit.PDFDocument, headers: string[], rows: any[][]) => {
//     const columnWidths = [80, 150, 120, 60]; // Ajuste de anchos de columna
//     const tableMargin = 30; // Margen izquierdo
//     const rowHeight = 20;
//     let y = doc.y; // Posición inicial en Y

//     // Dibujar los encabezados
//     doc.fontSize(10).font('Helvetica-Bold');
//     headers.forEach((header, index) => {
//         const x = tableMargin + columnWidths.slice(0, index).reduce((a, b) => a + b, 60);
//         doc.text(header, x, y, { width: columnWidths[index], align: 'center' });
//     });

//     y += rowHeight;

//     // Dibujar las filas de datos
//     doc.font('Helvetica');
//     rows.forEach(row => {
//         row.forEach((cell, index) => {
//             const x = tableMargin + columnWidths.slice(0, index).reduce((a, b) => a + b, 60);
//             doc.text(String(cell), x, y, { width: columnWidths[index], align: 'center' });
//         });
//         y += rowHeight;
//     });
// };





// // export const getProyectoByCodigo = async (req: Request, res: Response) => {
// //     try {
// //         const { orgcod, procod } = req.params;

// //         // Llama al servicio para obtener el proyecto
// //         const proyecto = await organizacionService.getProyectoByCodigo(orgcod, procod);

// //         if (!proyecto) {
// //             return res
// //                 .status(404)
// //                 .json({ error: `No se encontró el proyecto ${procod} en la organización ${orgcod}.` });
// //         }

// //         res.status(200).json(proyecto);
// //     } catch (error) {
// //         const err = error as Error;
// //         console.error('Error al obtener el proyecto por código:', err.message);
// //         res.status(500).json({ error: 'Error al obtener el proyecto.' });
// //     }
// // };