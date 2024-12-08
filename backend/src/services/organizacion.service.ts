// backend/src/services/organizacion.service.ts
import { prisma } from '../prisma';
import { Organizacion } from '@prisma/client';

// Crear una nueva organización
export const createOrganizacion = async (data: Partial<Organizacion>) => {
    const codigo = await generateCodigo();
    const version = '00.01';

    return await prisma.organizacion.create({
        data: {
            codigo, // Campo obligatorio generado automáticamente
            version, // Versión inicial generada automáticamente
            fechaCreacion: new Date(), // Fecha de creación
            nombre: data.nombre ?? '', // Validar que `nombre` esté definido
            direccion: data.direccion || null,
            telefono: data.telefono || null,
            representanteLegal: data.representanteLegal || null,
            telefonoRepresentante: data.telefonoRepresentante || null,
            ruc: data.ruc || null,
            contacto: data.contacto || null,
            telefonoContacto: data.telefonoContacto || null,
            estado: data.estado || null,
            comentarios: data.comentarios || null,
        },
    });
};

// Obtener todas las organizaciones
export const getOrganizaciones = async () => {
    return await prisma.organizacion.findMany();
};

// Obtener una organización por ID
export const getOrganizacionById = async (id: string) => {
    return await prisma.organizacion.findUnique({
        where: { id },
    });
};

// Obtener la organización principal por código
export const getMainOrganization = async () => {
    return await prisma.organizacion.findUnique({
        where: { codigo: 'ORG-MAIN' },
    });
    
};

// Actualizar una organización
export const updateOrganizacion = async (id: string, data: Partial<Organizacion>) => {
    const existingOrganizacion = await prisma.organizacion.findUnique({ where: { id } });
    if (!existingOrganizacion) throw new Error('Organización no encontrada');

    const newVersion = incrementVersion(existingOrganizacion.version); // Incrementar la versión

    return await prisma.organizacion.update({
        where: { id },
        data: {
            ...data,
            version: newVersion, // Actualizar versión
            fechaModificacion: new Date(), // Actualizar fecha de modificación
        },
    });
};

// Eliminar una organización
export const deleteOrganizacion = async (id: string) => {
    return await prisma.organizacion.delete({
        where: { id },
    });
};

// Función para generar el próximo código
const generateCodigo = async (): Promise<string> => {
    const organizaciones = await prisma.organizacion.findMany({
        orderBy: { fechaCreacion: 'desc' }, // Ordenar por fecha de creación como alternativa confiable
    });

    if (organizaciones.length === 0) {
        return 'ORG-001'; // Si no hay organizaciones, empezar en ORG-001
    }

    const lastCodigo = organizaciones[0].codigo; // Obtener el último código creado
    const lastCodeNumber = parseInt(lastCodigo.split('-')[1], 10); // Extraer el número del código
    return `ORG-${(lastCodeNumber + 1).toString().padStart(3, '0')}`; // Generar el siguiente código
};



// Incrementar la versión
const incrementVersion = (currentVersion: string): string => {
    const [major, minor] = currentVersion.split('.').map(Number);
    return `${major.toString().padStart(2, '0')}.${(minor + 1).toString().padStart(2, '0')}`;
};

// Función para inicializar la organización principal
export const initializeMainOrganization = async () => {
    const mainOrgCode = 'ORG-MAIN'; // Código único para la organización principal
  
    // Verificar si la organización principal ya existe
    const existingOrg = await prisma.organizacion.findUnique({
        where: { codigo: mainOrgCode },
    });
  
    if (existingOrg) {
        console.log('La organización principal ya existe:', existingOrg.nombre);
        return;
    }
  
    // Crear la organización principal si no existe
    const mainOrganization = await prisma.organizacion.create({
      data: {
        codigo: mainOrgCode,
        version: '00.00', // Versión inicial
        fechaCreacion: new Date(),
        nombre: 'ReqWizard', // Nombre inicial
        direccion: 'Dirección de la organización principal',
        telefono: '777-0000',
        estado: 'Activo',
        comentarios: 'Esta es la organización principal del sistema.',
      },
    });
  
    console.log('Organización principal creada:', mainOrganization.nombre);
};

// Agregar esta función para reutilizar la lógica de generateCodigo
export const getNextCodigo = async (): Promise<string> => {
    return await generateCodigo();
};
