// backend/src/services/proyecto.service.ts
import { PrismaClient, Proyecto } from '@prisma/client';

const prisma = new PrismaClient();

// Crear un nuevo proyecto
export const createProyecto = async (
    organizacionCodigo: string,
    data: {
        codigo: string;
        nombre: string;
        descripcion?: string;
        estado?: string;
        comentarios?: string;
    }
) => {
    const organizacion = await prisma.organizacion.findUnique({
        where: { codigo: organizacionCodigo },
    });

    if (!organizacion) {
        throw new Error('Organización no encontrada');
    }

    return await prisma.proyecto.create({
        data: {
            ...data,
            organizacionId: organizacion.id,
        },
    });
};

export const getProyectoById = async (id: string) => {
    return await prisma.proyecto.findUnique({
        where: { id },
        include: { organizacion: true }, // Incluir datos de la organización
    });
};


export const deleteProyecto = async (id: string) => {
    return await prisma.proyecto.delete({
        where: { id },
    });
};

// Generar un código único para el proyecto dentro de la organización
const generateCodigo = async (organizacionId: string): Promise<string> => {
    const contador = await prisma.contador.upsert({
        where: { entidad_contextoId: { entidad: 'proyecto', contextoId: organizacionId } },
        create: {
            entidad: 'proyecto',
            contextoId: organizacionId,
            contador: 1,
        },
        update: {
            contador: { increment: 1 },
        },
    });

    return `PROY-${contador.contador.toString().padStart(3, '0')}`;
};

// Función para obtener el próximo código del proyecto
export const getNextCodigo = async (organizacionCodigo: string): Promise<string> => {
    // Buscar la organización por su código
    const organizacion = await prisma.organizacion.findUnique({
        where: { codigo: organizacionCodigo },
    });

    if (!organizacion) {
        throw new Error(`La organización con código ${organizacionCodigo} no existe.`);
    }

    const entidad = 'proyecto';
    const contextoId = organizacion.id;

    // Consultar el valor actual del contador sin incrementarlo
    const contador = await prisma.contador.findUnique({
        where: { entidad_contextoId: { entidad, contextoId } },
    });

    const nextCount = (contador?.contador || 0) + 1; // El siguiente número
    return `PROY-${nextCount.toString().padStart(3, '0')}`;
};


// Incrementar la versión del proyecto
const incrementVersion = (currentVersion: string): string => {
    const [major, minor] = currentVersion.split('.').map(Number);
    return `${major.toString().padStart(2, '0')}.${(minor + 1).toString().padStart(2, '0')}`;
};

export const getProyectoByOrgAndCode = async (orgcod: string, procod: string) => {
    return await prisma.proyecto.findFirst({
        where: {
            codigo: procod,
            organizacion: {
                codigo: orgcod,
            },
        },
    });
};

// Obtener un proyecto por código y código de organización
export const getProyectoByCodigo = async (codigo: string, organizacionCodigo: string) => {
    const organizacion = await prisma.organizacion.findUnique({
        where: { codigo: organizacionCodigo },
    });

    if (!organizacion) {
        throw new Error('Organización no encontrada');
    }

    return await prisma.proyecto.findUnique({
        where: {
            codigo_organizacionId: {
                codigo,
                organizacionId: organizacion.id,
            },
        },
    });
};

// Obtener todos los proyectos de una organización
export const getProyectosByOrganizacion = async (orgcod: string) => {
    // Buscar la organización por su código
    const organizacion = await prisma.organizacion.findUnique({
        where: { codigo: orgcod },
        include: { proyectos: true }, // Incluye los proyectos relacionados
    });

    if (!organizacion) {
        throw new Error(`Organización con código ${orgcod} no encontrada.`);
    }

    return organizacion.proyectos; // Devuelve solo los proyectos
};

export const getProyectoByCodigoAndOrganizacionId = async (
    codigo: string,
    organizacionId: string
) => {
    return await prisma.proyecto.findFirst({
        where: {
            codigo,
            organizacionId,
        },
    });
};

export const updateProyecto = async (id: string, data: Partial<Proyecto>) => {
    return await prisma.proyecto.update({
        where: { id },
        data,
    });
};

