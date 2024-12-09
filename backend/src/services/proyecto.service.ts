// backend/src/services/proyecto.service.ts
import { PrismaClient, Proyecto } from '@prisma/client';

const prisma = new PrismaClient();

export const createProyecto = async (data: Partial<Proyecto>) => {
  const codigo = await generateCodigo();
  const version = '00.01';

  return prisma.proyecto.create({ 
    data: {
      codigo,
      version,
      fechaCreacion: new Date(),
      nombre: data.nombre ?? '',
      descripcion: data.descripcion || null,
      fechaModificacion: data.fechaModificacion || null,
      estado: data.estado || null,
      organizacion: { connect: { id: data.organizacionId } },
    }, 
  });
};

export const getProyectos = async () => {
  return prisma.proyecto.findMany({ include: { organizacion: true } });
};

export const getProyectoById = async (id: string) => {
  return prisma.proyecto.findUnique({
    where: { id },
    include: { organizacion: true },
  });
};

export const updateProyecto = async (id: string, data: Partial<Proyecto>) => {
  const existingProyecto = await prisma.proyecto.findUnique({ where: { id } });
  if (!existingProyecto) throw new Error('Proyecto no encontrado');

  const newVersion = incrementVersion(existingProyecto.version); // Incrementar la versión

  return await prisma.proyecto.update({
    where: { id },
    data: {
        ...data,
        version: newVersion, // Actualizar versión
        fechaModificacion: new Date(), // Actualizar fecha de modificación
    },
  });
};

export const deleteProyecto = async (id: string) => {
  return prisma.proyecto.delete({ where: { id } });
};

// Codigo Automatizacion
const incrementVersion = (currentVersion: string): string => {
  const [major, minor] = currentVersion.split('.').map(Number);
  return `${major.toString().padStart(2, '0')}.${(minor + 1).toString().padStart(2, '0')}`;
};

const generateCodigo = async (): Promise<string> => {
  const proyectos = await prisma.proyecto.findMany({
      orderBy: { fechaCreacion: 'desc' }, // Ordenar por fecha de creación como alternativa confiable
  });

  if (proyectos.length === 0) {
      return 'PROY-001'; // Si no hay organizaciones, empezar en PROY-001
  }

  const lastCodigo = proyectos[0].codigo; // Obtener el último código creado
  const lastCodeNumber = parseInt(lastCodigo.split('-')[1], 10); // Extraer el número del código
  return `PROY-${(lastCodeNumber + 1).toString().padStart(3, '0')}`; // Generar el siguiente código
};

export const getProyectosByOrganizacionCodigo = async (organizacionCodigo: string) => {
  return prisma.proyecto.findMany({
    where: {
      organizacion: {
        codigo: organizacionCodigo, // Filtrar por el código de la organización
      },
    },
    include: { organizacion: true }, // Incluir información de la organización si es necesario
  });
};

// Agregar esta función para reutilizar la lógica de generateCodigo
export const getNextCodigo = async (): Promise<string> => {
  return await generateCodigo();
};