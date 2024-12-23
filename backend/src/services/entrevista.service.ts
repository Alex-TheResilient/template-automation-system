import { prisma } from '../prisma';

export const createEntrevista = async (projcod: string, data: any) => {
  const { agendas, conclusiones, ...entrevistaData } = data;

  // Contar el número de entrevistas existentes para el proyecto
  const count = await prisma.entrevista.count({
    where: { proyectoId: projcod },
  });

  // Generar el nombre de la entrevista
  const nombreEntrevista = `Entrevista ${count + 1}`;

  return await prisma.entrevista.create({
    data: {
      ...entrevistaData,
      proyectoId: projcod,
      nombreEntrevista,
      agendas: {
        create: agendas,
      },
      conclusiones: {
        create: conclusiones,
      },
    },
    include: {
      agendas: true,
      conclusiones: true,
    },
  });
};

export const getEntrevistasByProyecto = async (projcod: string) => {
  return await prisma.entrevista.findMany({
    where: { proyectoId: projcod },
    include: {
      agendas: true,
      conclusiones: true,
    },
  });
};

export const getEntrevistaById = async (id: string) => {
  return await prisma.entrevista.findUnique({
    where: { id },
    include: {
      agendas: true,
      conclusiones: true,
    },
  });
};

export const updateEntrevista = async (id: string, data: any) => {
  const { agendas, conclusiones, ...entrevistaData } = data;
  return await prisma.entrevista.update({
    where: { id },
    data: {
      ...entrevistaData,
      agendas: {
        deleteMany: {},
        create: agendas,
      },
      conclusiones: {
        deleteMany: {},
        create: conclusiones,
      },
    },
    include: {
      agendas: true,
      conclusiones: true,
    },
  });
};

export const deleteEntrevista = async (id: string) => {
  return await prisma.entrevista.delete({
    where: { id },
  });
};