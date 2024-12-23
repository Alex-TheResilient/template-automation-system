// backend/src/services/experto.service.ts
import { PrismaClient, Experto } from '@prisma/client';

const prisma = new PrismaClient();

// Crear un nuevo experto
export const createExperto = async (
    proyectoCodigo: string,
    data: {
        apellidoPaterno: string;
        apellidoMaterno?: string;
        nombres: string;
        experiencia: string;
        comentario?: string;
        estado: string;
    }
) => {
    const proyecto = await prisma.proyecto.findFirst({
        where: { codigo: proyectoCodigo },
    });

    if (!proyecto) {
        throw new Error('Proyecto no encontrado');
    }

    const codigo = await generateCodigo(proyecto.id);

    return await prisma.experto.create({
        data: {
            ...data,
            codigo,
            version: '01.00', // Inicializar la versión del experto
            proyectoId: proyecto.id,
        },
    });
};

// Actualizar un experto
export const updateExperto = async (
    proyectoCodigo: string,
    expertoCodigo: string,
    data: {
        apellidoPaterno?: string;
        apellidoMaterno?: string;
        nombres?: string;
        experiencia?: string;
        comentario?: string;
        estado?: string;
    }
): Promise<Experto | null> => {
    const proyecto = await prisma.proyecto.findFirst({
        where: { codigo: proyectoCodigo },
    });

    if (!proyecto) {
        throw new Error('Proyecto no encontrado');
    }

    const experto = await prisma.experto.findFirst({
        where: {codigo: expertoCodigo},
    });

    if (!experto) {
        throw new Error('Experto no encontrado');
    }

    const newVersion = incrementVersion(experto.version);

    return await prisma.experto.update({
        where: {
            codigo: expertoCodigo},
        data: {
            ...data,
            version: newVersion,
        },
    });
};

// Eliminar un experto
export const deleteExperto = async (proyectoCodigo: string, expertoCodigo: string) => {
    const proyecto = await prisma.proyecto.findFirst({
        where: { codigo: proyectoCodigo },
    });

    if (!proyecto) {
        throw new Error(`Proyecto con código ${proyectoCodigo} no encontrado.`);
    }

    const experto = await prisma.experto.findUnique({
        where: {
            codigo: expertoCodigo
        },
    });

    if (!experto) {
        throw new Error(`Experto con código ${expertoCodigo} no encontrado.`);
    }

    await prisma.experto.delete({
        where: {
            codigo: expertoCodigo
        },
    });

    return true;
};

const generateCodigo = async (proyectoId: string): Promise<string> => {
    // Intentar encontrar el contador antes de actualizarlo
    const contador = await prisma.contador.upsert({
        where: { entidad_contextoId: { entidad: 'experto', contextoId: proyectoId } },
        create: {
            entidad: 'experto',
            contextoId: proyectoId,
            contador: 1,
        },
        update: {
            contador: { increment: 1 },
        },
    });

    return `EXP-${contador.contador.toString().padStart(3, '0')}`;
};

export const getNextCodigo = async (proyectoCodigo: string): Promise<string> => {
    // Buscar el proyecto
    const proyecto = await prisma.proyecto.findFirst({
        where: { codigo: proyectoCodigo },
    });

    if (!proyecto) {
        throw new Error(`El proyecto con código ${proyectoCodigo} no existe.`);
    }

    const entidad = 'experto';
    const contextoId = proyecto.id;

    // Buscar el contador para el proyecto
    const contador = await prisma.contador.findUnique({
        where: { entidad_contextoId: { entidad, contextoId } },
    });

    // Si el contador no existe, crearlo
    if (!contador) {
        const newContador = await prisma.contador.create({
            data: {
                entidad,
                contextoId,
                contador: 1,
            },
        });
        return `EXP-${newContador.contador.toString().padStart(3, '0')}`;
    }

    // Si existe el contador, incrementarlo
    const nextCount = contador.contador + 1;

    return `EXP-${nextCount.toString().padStart(3, '0')}`;
};

// Incrementar la versión del experto
const incrementVersion = (currentVersion: string): string => {
    const [major, minor] = currentVersion.split('.').map(Number);
    return `${major.toString().padStart(2, '0')}.${(minor + 1).toString().padStart(2, '0')}`;
};



export const getExpertoById = async (id: string) => {
    return await prisma.experto.findUnique({
        where: { id },
    });
};

export const getExpertoByProyectoAndCode = async (proyectoCodigo: string, expertoCodigo: string) => {
    return await prisma.experto.findFirst({
        where: {
            codigo: expertoCodigo,
            proyecto: {
                codigo: proyectoCodigo,
            },
        },
    });
};

// Obtener todos los expertos de un proyecto
export const getExpertosByProyecto = async (proyectoCodigo: string) => {
    const proyecto = await prisma.proyecto.findFirst({
        where: { codigo: proyectoCodigo },
        include: { expertos: true },
    });

    if (!proyecto) {
        throw new Error(`Proyecto con código ${proyectoCodigo} no encontrado.`);
    }

    return proyecto.expertos;
};

// Buscar expertos por nombre
export const searchExpertosByNombre = async (proyectoCodigo: string, nombres: string) => {
    const proyecto = await prisma.proyecto.findFirst({
        where: { codigo: proyectoCodigo },
    });
    if (!proyecto) {
        throw new Error(`Proyecto con código ${proyectoCodigo} no encontrado.`);
    }
    return await prisma.experto.findMany({
        where: {
            proyectoId: proyecto.id,
            nombres: {
                contains: nombres,
                mode: 'insensitive',
            },
        },
    });
};

// Buscar expertos por fecha (month and year)
export const searchExpertosByDate = async (proyectoCodigo: string, year?: string, month?: string) => {
    const proyecto = await prisma.proyecto.findFirst({
        where: { codigo: proyectoCodigo },
    });

    if (!proyecto) {
        throw new Error(`Proyecto con código ${proyectoCodigo} no encontrado.`);
    }

    let dateFilter = {};

    if (year && month) {
        const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
        const endDate = new Date(parseInt(year), parseInt(month), 0);
        dateFilter = {
            fechaCreacion: {
                gte: startDate,
                lte: endDate,
            },
        };
    } else if (year) {
        dateFilter = {
            fechaCreacion: {
                gte: new Date(parseInt(year), 0, 1),
                lt: new Date(parseInt(year) + 1, 0, 1),
            },
        };
    } else if (month) {
        const currentYear = new Date().getFullYear();
        dateFilter = {
            fechaCreacion: {
                gte: new Date(currentYear, parseInt(month) - 1, 1),
                lt: new Date(currentYear, parseInt(month), 0),
            },
        };
    }

    return await prisma.experto.findMany({
        where: {
            proyectoId: proyecto.id,
            ...dateFilter,
        },
    });
};