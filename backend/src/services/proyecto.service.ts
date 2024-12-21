// backend/src/services/proyecto.service.ts
import { PrismaClient, Proyecto } from '@prisma/client';

const prisma = new PrismaClient();

// Crear un nuevo proyecto
export const createProyecto = async (
    organizacionCodigo: string,
    data: {
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

    const codigo = await generateCodigo(organizacion.id);

    return await prisma.proyecto.create({
        data: {
            ...data,
            codigo,
            version: '01.00', // Inicializar la versión del proyecto
            organizacionId: organizacion.id,
        },
    });
};

// Actualizar un proyecto
export const updateProyecto = async (
    organizacionCodigo: string,
    proyectoCodigo: string,
    data: {
        nombre?: string;
        descripcion?: string;
        estado?: string;
        comentarios?: string;
    }
): Promise<Proyecto | null> => {
    const organizacion = await prisma.organizacion.findUnique({
        where: { codigo: organizacionCodigo },
    });

    if (!organizacion) {
        throw new Error('Organización no encontrada');
    }

    const proyecto = await prisma.proyecto.findUnique({
        where: {
            codigo_organizacionId: {
                codigo: proyectoCodigo,
                organizacionId: organizacion.id,
            },
        },
    });

    if (!proyecto) {
        throw new Error('Proyecto no encontrado');
    }

    const newVersion = incrementVersion(proyecto.version);

    return await prisma.proyecto.update({
        where: {
            codigo_organizacionId: {
                codigo: proyectoCodigo,
                organizacionId: organizacion.id,
            },
        },
        data: {
            ...data,
            version: newVersion,
        },
    });
};

// Eliminar un proyecto
export const deleteProyecto = async (orgcod: string, projcod: string) => {
    const organizacion = await prisma.organizacion.findUnique({
        where: { codigo: orgcod },
    });

    if (!organizacion) {
        throw new Error(`Organización con código ${orgcod} no encontrada.`);
    }

    const proyecto = await prisma.proyecto.findUnique({
        where: {
            codigo_organizacionId: {
                codigo: projcod,
                organizacionId: organizacion.id,
            },
        },
    });

    if (!proyecto) {
        throw new Error(`Proyecto con código ${projcod} no encontrado.`);
    }

    await prisma.proyecto.delete({
        where: {
            codigo_organizacionId: {
                codigo: projcod,
                organizacionId: organizacion.id,
            },
        },
    });

    return true;
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

// Incrementar la versión del proyecto
const incrementVersion = (currentVersion: string): string => {
    const [major, minor] = currentVersion.split('.').map(Number);
    return `${major.toString().padStart(2, '0')}.${(minor + 1).toString().padStart(2, '0')}`;
};

// Obtener el siguiente código único para un proyecto
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

export const getProyectoById = async (id: string) => {
    return await prisma.proyecto.findUnique({
        where: { id },
    });
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

// Obtener todos los proyectos de una organización
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

//busqueda de proyectos por nombre
export const searchProyectosByNombre = async (orgcod: string, nombre: string) => {
    const organizacion = await prisma.organizacion.findUnique({
        where: { codigo: orgcod }
    });
    if(!organizacion){
        throw new Error(`Organización con código ${orgcod} no encontrada.`);
    }
    return await prisma.proyecto.findMany({
        where: {
            organizacionId: organizacion.id,
            nombre: {
                contains: nombre,
                mode: 'insensitive'
            }
        }
    });
}

