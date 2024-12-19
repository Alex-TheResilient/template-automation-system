// backend/src/services/organizacion.service.ts
import { PrismaClient, Organizacion } from '@prisma/client';
import { parse } from 'path';

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


// Actualizar una organización por código
export const updateOrganizacionByCodigo = async (codigo: string, data: Partial<Organizacion>) => {
    const existingOrganizacion = await prisma.organizacion.findUnique({
        where: { codigo }, // Buscar por código (orgcod)
    });

    if (!existingOrganizacion) {
        throw new Error('Organización no encontrada');
    }

    const newVersion = incrementVersion(existingOrganizacion.version); // Incrementar versión

    return await prisma.organizacion.update({
        where: { codigo }, // Actualizar por código (orgcod)
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
export const searchOrganizacionesByName = async (nombre: string | undefined) => {
    // Si no hay nombre o está vacío, retornar todas las organizaciones
    if (!nombre || nombre.trim() === '') {
        return await prisma.organizacion.findMany({
            orderBy: {
                nombre: 'asc'
            }
        });
    }

    // Buscar organizaciones que coincidan con el nombre (parcial)
    return await prisma.organizacion.findMany({
        where: {
            nombre: {
                contains: nombre,
                mode: 'insensitive' // No distingue entre mayúsculas y minúsculas
            }
        },
        orderBy: {
            nombre: 'asc'
        }
    });
};

//Busqueda por mes y año
export const searchOrganizacionesByDate = async (year?: string, month?: string) => {
    //si no hay año ni mes, retorna todas las organizaciones
    if (!year && !month) {
        return await prisma.organizacion.findMany({
            where:{
                codigo: {not: 'ORG-MAIN'} //excluye la organizacion principal
            },
            orderBy: {
                fechaCreacion: 'desc'
            }
        });
    }
    let startDate: Date;
    let endDate: Date;

    if (year && month) {
        //busqueda por año y mes en especifico
        startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
        endDate = new Date(parseInt(year), parseInt(month), 0);
    } else if (year) {
        //busqueda solo por año
        startDate = new Date(parseInt(year), 0, 1);
        endDate = new Date(parseInt(year), 11, 31);
    } else {
        //busqueda solo por mes
        const currentYear = new Date().getFullYear();
        startDate = new Date(parseInt(year || currentYear.toString()), parseInt(month!) - 1, 1);
        endDate = new Date(parseInt(year || currentYear.toString()), parseInt(month!), 0);
    }
    return await prisma.organizacion.findMany({
        where: {
            AND:[
                {
                    codigo : {not: 'ORG-MAIN'} //excluye la organizacion principal
                }, 
                {
                    fechaCreacion: {
                        gte: startDate,
                        lte: endDate
                    }
                }
            ]
        },
        orderBy: {
            fechaCreacion: 'desc'
        }
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
export const getOrganizacionWithProyectosByCodigo = async (codigo: string) => {
    return await prisma.organizacion.findUnique({
        where: { codigo }, // Buscar por el campo `codigo`
        include: { proyectos: true }, // Incluir los proyectos asociados
    });
};

// export const getProyectoByCodigo = async (orgcod: string, procod: string) => {
//     // Buscar la organización por su código
//     const organizacion = await prisma.organizacion.findUnique({
//         where: { codigo: orgcod },
//     });

//     if (!organizacion) {
//         throw new Error(`Organización con código ${orgcod} no encontrada.`);
//     }

//     // Buscar el proyecto dentro de la organización
//     return await prisma.proyecto.findFirst({
//         where: {
//             codigo: procod,
//             organizacionId: organizacion.id, // Usar el ID de la organización
//         },
//     });
// };

