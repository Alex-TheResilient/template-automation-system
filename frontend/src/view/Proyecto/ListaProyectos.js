import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaFolder, FaPencilAlt, FaTrash } from "react-icons/fa";
import "../../styles/stylesListaProyectos.css";
import "../../styles/styles.css";

const ListaProyectos = () => {
  const { orgcod } = useParams(); // Extraer el parámetro de la URL
  
  // Estado de proyectos y errores
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estado para los parámetros de búsqueda
  const [searchNombre, setSearchNombre] = useState("");
  const [searchYear, setSearchYear] = useState("");
  const [searchMonth, setSearchMonth] = useState("");

  // Variables de enrutamiento
  const location = useLocation();
  const navigate = useNavigate();

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  // Navegaciones
  const irAMenuOrganizaciones = () => navigate("/organizations");
  const irAEditarProyecto = (orgcod, procod) => {
    if (!orgcod || !procod) {
        alert("Código de la organización o del proyecto no válido.");
        return;
    }
    navigate(`/organizations/${orgcod}/projects/${procod}`);
  };
  const irARegistroProyecto = () => navigate(`/organizations/${orgcod}/projects/new`);
  const irALogin = () => navigate("/");
  const irAMenuProyecto = (orgcod, procod) => navigate(`/organizations/${orgcod}/projects/${procod}`);
    
  // Obtener proyectos asociados a la organización
  const fetchProjects = useCallback(async () => {
    if (!orgcod) {
        console.error("El código de la organización no es válido.");
        setError("El código de la organización no es válido.");
        return;
    }
    try {
        const response = await axios.get(`${API_BASE_URL}/organizations/${orgcod}/projects`);
        setProjects(response.data || []); // Aquí asumimos que el backend devuelve un arreglo plano
        setLoading(false); // Finalizar la carga
    } catch (err) {
        setError(err.response?.data?.error || "Error al obtener los proyectos");
        setLoading(false); // Finalizar la carga en caso de error
    }
  }, [orgcod, API_BASE_URL]);
  
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);


  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);
  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  // Eliminar un proyecto
  const deleteProject = async (codigo) => {
    try {
      await axios.delete(`${API_BASE_URL}/organizations/${orgcod}/projects/${codigo}`);
      fetchProjects(); // Refrescar la lista de proyectos después de eliminar uno
    } catch (err) {
      console.error("Error al eliminar el proyecto:", err);
      setError(err.response?.data?.error || "Error al eliminar el proyecto");
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

// Función para buscar proyectos
const handleSearch = async () => {
  try{
    if(searchNombre){
      const response = await axios.get(
        `${API_BASE_URL}/organizations/${orgcod}/projects/search`,{
          params: { 
            nombre: searchNombre 
          }
        });
        setProjects(response.data);
      }else{
        fetchProjects();
      }
  }catch(err){
    console.error("Error al buscar proyectos:", err);
    setError(err.response?.data?.error || "Error al buscar proyectos");
  }
};
const handleKeyPress = (event) => {
  if (event.key === 'Enter') {
    handleSearch();
  }
}

// Exportar a Excel
const exportToExcel = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/organizations/${orgcod}/projects/exports/excel`, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `projects_de_${orgcod}.xlsx`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Eliminar el enlace después de la descarga
  } catch (err) {
    setError(err.response?.data?.error || 'Error al exportar a Excel');
  }
};

// Exportar a PDF
const exportToPDF = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/organizations/${orgcod}/projects/exports/pdf`, {
      responseType: 'blob', // Cambiar la ruta a la del PDF
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `projects_de_${orgcod}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Eliminar el enlace después de la descarga
  } catch (err) {
    setError(err.response?.data?.error || 'Error al exportar a PDF');
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
          <h2>Proyectos de la Organización {orgcod}</h2>
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
                    onKeyPress={handleKeyPress}
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
                      <tr key={pro.id} onClick={() => irAMenuProyecto(orgcod, pro.codigo)}>
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
                          {/* Boton para editar un proyecto */}
                          <button
                            className="botton-crud"
                            onClick={(e) => {
                              e.stopPropagation();
                              irAEditarProyecto(orgcod, pro.codigo);
                            }}
                          >
                            <FaPencilAlt style={{ color: "blue", cursor: "pointer" }} />
                          </button>
                          {/* Boton para eliminar un proyecto */}
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
              {loading ? (
                <p>Cargando proyectos...</p>
              ) : error ? (
                <p className="error-message">{error}</p>
              ) : projects.length === 0 ? (
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
              <button className="export-button" onClick={exportToExcel}>Excel</button>
              <button className="export-button" onClick={exportToPDF}>PDF</button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default ListaProyectos;
