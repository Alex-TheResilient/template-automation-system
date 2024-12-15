// backend/src/services/organizacion.service.ts
import { PrismaClient, Organizacion } from '@prisma/client';

const prisma = new PrismaClient();

// Crear una nueva organización
export const createOrganizacion = async (data: Partial<Organizacion>) => {
    const codigo = await generateCodigo();
    const version = '00.01';

    return handlePrismaError(() =>
        prisma.organizacion.create({
            data: {
                codigo,
                version,
                fechaCreacion: new Date(),
                nombre: data.nombre ?? '',
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
        })
    );
};

export const getOrganizacionByCodigo = async (codigo: string) => {
    return await prisma.organizacion.findUnique({
        where: { codigo },
    });
};

// Obtener todas las organizaciones
export const getOrganizaciones = async (page: number, limit: number) => {
    const skip = (page - 1) * limit;
    return await prisma.organizacion.findMany({
        skip,
        take: limit,
    });
};

// Obtener una organización por ID
export const getOrganizacionById = async (id: string) => {
    return await prisma.organizacion.findUnique({
        where: { id },
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

// Codigo de Automatizacion
// Función para generar el próximo código
const generateCodigo = async (): Promise<string> => {
    const entidad = 'organizacion';
    const contextoId = 'GLOBAL'; // Valor fijo para organizaciones sin contexto

    const contador = await prisma.contador.upsert({
        where: { entidad_contextoId: { entidad, contextoId } },
        create: {
            entidad,
            contextoId,
            contador: 1,
        },
        update: {
            contador: { increment: 1 },
        },
    });

    return `ORG-${contador.contador.toString().padStart(3, '0')}`;
};

// Agregar esta función para reutilizar la lógica de generateCodigo
export const getNextCode = async (): Promise<string> => {
    const entidad = 'organizacion';
    const contextoId = 'GLOBAL';

    const contador = await prisma.contador.findUnique({
        where: { entidad_contextoId: { entidad, contextoId } },
    });

    const nextCodeNumber = (contador?.contador || 0) + 1;
    return `ORG-${nextCodeNumber.toString().padStart(3, '0')}`;
};


// Incrementar la versión
const incrementVersion = (currentVersion: string): string => {
    const [major, minor] = currentVersion.split('.').map(Number);
    return `${major.toString().padStart(2, '0')}.${(minor + 1).toString().padStart(2, '0')}`;
};

// Codigo Especifico para la Organizacion
// Obtener la organización principal por código
export const getMainOrganization = async () => {
    return await prisma.organizacion.findUnique({
        where: { codigo: 'ORG-MAIN' },
    });
    
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

//BusquedaPorNombre
export const searchOrganizacionesByName = async (nombre: string) => {
    return await prisma.organizacion.findMany({
        where: {
            nombre: {
                contains: nombre,
                mode: 'insensitive', // Búsqueda sin importar mayúsculas o minúsculas
            },
        },
    });
};

const handlePrismaError = async (operation: () => Promise<any>) => {
    try {
        return await operation();
    } catch (error) {
        console.error('Error en la operación de Prisma:', error);
        throw new Error('Error en la operación de base de datos.');
    }
};

// Obtener una Organización con sus Proyectos:
export const getOrganizacionWithProyectos = async (id: string) => {
    return await prisma.organizacion.findUnique({
        where: { id },
        include: { proyectos: true },
    });
};
