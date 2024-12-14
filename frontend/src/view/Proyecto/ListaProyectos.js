import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaFolder, FaPencilAlt, FaTrash } from "react-icons/fa";
import "../../styles/stylesListaProyectos.css";
import "../../styles/styles.css";

// URL Base del API
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/v1";


const ListaProyectos = () => {
  // Variables de enrutamiento
  const location = useLocation();
  const navigate = useNavigate();
  
  //Proyecto
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);

  // Estado para los parámetros de búsqueda
  const [searchNombre, setSearchNombre] = useState("");
  const [searchYear, setSearchYear] = useState("");
  const [searchMonth, setSearchMonth] = useState("");
  
  // Obtener los parámetros de consulta
  const queryParams = new URLSearchParams(location.search);
  const organizacionCodigo = queryParams.get("orgcod") || "";
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);
  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  
  // Navegaciones
  const irAMenuOrganizaciones = () => navigate("/menuOrganizaciones");
  const irAMenuProyecto = (id) => navigate(`/menuProyecto?procod=${id}`);
  const irAEditarProyecto = (code) => {
      if (!code) {
          alert("Código del proyecto no válido.");
          return;
      }
      navigate(`/registroProyecto?code=${code}`);
  };
  const irARegistroProyecto = () => navigate(`/registroProyecto?orgcod=${organizacionCodigo}`);
  const irALogin = () => navigate("/");
  

  // Obtener proyectos
  const fetchProjects = useCallback(async () => {
    if (!organizacionCodigo) {
      console.error("El código de la organización no es válido.");
      setError("El código de la organización no es válido.");
      return;
    }
    try {
      const response = await axios.get(`${API_BASE_URL}/proyectos`, {
        params: { organizacionCodigo },
      });
      setProjects(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Error al obtener los proyectos");
    }
  }, [organizacionCodigo]);
  
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Función para buscar proyectos
  const handleSearch = async () => {
    try {
      // Construye los parámetros dinámicamente para evitar enviar valores vacíos
      const params = { organizacionCodigo };

      if (searchNombre) {
        params.nombre = searchNombre;
      }
      if (searchYear) {
        params.year = searchYear;
      }
      if (searchMonth) {
        params.month = searchMonth;
      }

      // Llamada a la API usando la URL base de la variable de entorno
      const response = await axios.get(`${API_BASE_URL}/proyectos/search`, {
        params,
      });

      setProjects(response.data); // Actualiza la lista de proyectos con los resultados
    } catch (err) {
      setError(err.response ? err.response.data.error : "Error al buscar proyectos");
    }
  };

  // Función para eliminar un proyecto
  const deleteProject = async (procod) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este proyecto?")) {
      try {
        // Llamada a la API usando la URL base de la variable de entorno
      await axios.delete(`${API_BASE_URL}/projects/${procod}`);
      fetchProjects();
      alert("Proyecto eliminado correctamente.");
    } catch (err) {
      console.error("Error al eliminar el proyecto:", err.response?.data || err.message);
      alert(`Hubo un error al eliminar el proyecto: ${err.response?.data?.error || err.message}`);
    }
  }
};

  return (
    <div className="lista-container">
      <header className="ro-header">
        <h1>ReqWizards App</h1>
        <div className="flex-container">
          <span onClick={irAMenuOrganizaciones}>Menú Principal /</span>
          <span>Mocar Company</span>
        </div>
      </header>

      <div className="listasub-container">
        <aside className="lista-sidebar">
          <div className="bar-lista">
            <p1 onClick={irAMenuOrganizaciones}>MENU PRINCIPAL</p1>
          </div>

          <div className="lista-profile-section">
            <div className="lista-profile-icon">👤</div>
            <p2>Nombre Autor - Cod</p2>
            <button onClick={irALogin} className="lista-logout-button">
              Cerrar Sesión
            </button>
          </div>
        </aside>

        <main className="lista-content">
          <h2>MOCAR COMPANY</h2>
          <section className="lista-organizations-section">
            <div className="lista-search-section-bar">
              <button
                onClick={irARegistroProyecto}
                className="lista-register-button"
              >
                Nuevo proyecto
              </button>
              <div className="lista-sectionTextBuscar">
                <span class="message">
                  <input
                    class="lista-textBuscar"
                    type="text"
                    placeholder="Buscar por nombre"
                    value={searchNombre}
                    onChange={(e) => setSearchNombre(e.target.value)}
                  />
                  <span class="tooltip-text">
                    Filtro de búsqueda por nombre del proyecto
                  </span>
                </span>

                <button className="lista-search-button" onClick={handleSearch}>
                  Buscar
                </button>
              </div>
            </div>

            <div className="lista-search-section-text">
              <div className="lista-searchbar">
                <select
                  className="lista-year-input"
                  value={searchYear}
                  onChange={(e) => setSearchYear(e.target.value)}
                >
                  <option value="">AÑO</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <select
                  className="lista-month-input"
                  value={searchMonth}
                  onChange={(e) => setSearchMonth(e.target.value)}
                >
                  <option value="">MES</option>
                  {months.map((month, index) => (
                    <option key={index} value={index + 1}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {error ? (
              <p>{error}</p>
            ) : (
              <table className="lista-centertabla">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Nombre</th>
                    <th>Fecha creación</th>
                    <th>Fecha modificación</th>
                    <th>Estado</th>
                    <th>Opciones</th>
                  </tr>
                </thead>
                  <tbody>
                    {projects.map((pro) => (
                      <tr key={pro.id} onClick={() => irAMenuProyecto(pro.codigo)}>
                        <td>{pro.codigo}</td>
                        <td>{pro.nombre}</td>
                        <td>{new Date(pro.fechaCreacion).toLocaleDateString()}</td>
                        <td>
                          {pro.fechaModificacion
                            ? new Date(pro.fechaModificacion).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td>{pro.estado}</td>
                        <td>
                          <button
                            className="botton-crud"
                            onClick={(e) => {
                              e.stopPropagation();
                              irAEditarProyecto(pro.codigo);
                            }}
                          >
                            <FaPencilAlt style={{ color: "blue", cursor: "pointer" }} />
                          </button>
                          <button
                            className="botton-crud"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteProject(pro.codigo);
                            }}
                          >
                            <FaTrash style={{ color: "red", cursor: "pointer" }} />
                          </button>
                        </td>
                      </tr> 
                    ))}
                  </tbody>
              </table>
            )}

            <div className="ro-buttons">
              <button
                onClick={irAMenuOrganizaciones}
                className="ro-button"
                size="50"
              >
                Atras
              </button>
            </div>

            <h4 className="lista-h4">
              {projects.length === 0 ? (
                <p>No hay proyectos registrados para esta organización.</p>
              ) : (
                <table className="lista-centertabla">
                  <thead>{/* Encabezados */}</thead>
                  <tbody>
                    {projects.map((pro) => (
                      <tr key={pro.procod}>{/* Celdas */}</tr>
                    ))}
                  </tbody>
                </table>
              )}
            </h4>
            <div className="lista-export-buttons">
              <button className="lista-export-button">Excel</button>
              <button className="lista-export-button">PDF</button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default ListaProyectos;
