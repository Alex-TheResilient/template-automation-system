import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaFolder, FaPencilAlt, FaTrash } from "react-icons/fa";
import "../../../styles/stylesExpertos.css";
import "../../../styles/styles.css";

const Expertos = () => {

  const {projcod,orgcod} = useParams();

  // Estado de proyectos y errores
  const [expertos, setExpertos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    
  // Estado para los parámetros de búsqueda
  const [searchNombre, setSearchNombre] = useState("");
  const [searchYear, setSearchYear] = useState("");
  const [searchMonth, setSearchMonth] = useState("");

  // Variables de Enrutamiento
  const navigate = useNavigate();

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


  const irAMenuOrganizaciones = () => {
    navigate("/organizations");
  };
  const irAListaProyecto = () => {
    navigate(`/organizations/${orgcod}/projects`);
  };
  const irAMenuProyecto = (code) => {
    //navigate(`/menuProyecto?procod=${code}`);
    navigate(`/projects/${projcod}/menuProyecto`);
  };
  //Modificar
  const irAEditarProyecto = (projectId) => {
    console.log("ID del proyecto desde listaProyecto:", projectId);
    navigate(`/editarProyecto/${projectId}`);
  };

  const irANuevoExperto = () => {
    navigate(`/organizations/${orgcod}/projects/${projcod}/experts/new`);
  };

 
  const irAEditarExperto = (expcod) => {
    navigate(`/organizations/${orgcod}/projects/${projcod}/experts/${expcod}`);
  };

  const irALogin = () => {
    navigate("/");
  };
  const irAPlantillas = () => {
    navigate(`/projects/${projcod}/plantillas`);
  };

  

  const fetchExpertos = useCallback(async () => {
    //Obtener o listar expertos de un proyecto
    try {
      const response = await axios.get(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/experts`);
      setExpertos(response.data||[]);
    } catch (err) {
      setError(
        err.response
          ? err.response.data.error
          : "Error al obtener los proyectos"
      );
    }
  }, [projcod,orgcod,API_BASE_URL]);

  useEffect(() => {
    
    fetchExpertos();
    
  }, [fetchExpertos]);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);
  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  // Función para eliminar un Experto
  const deleteExpert = async (codigo) => {
    try {
      await axios.delete(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/experts/${codigo}`);
      fetchExpertos(); // Refrescar la lista de proyectos después de eliminar uno
    } catch (err) {
      console.error("Error al eliminar el proyecto:", err);
      setError(err.response?.data?.error || "Error al eliminar el proyecto");
    }
  };

  //funcion para buscaar proyectos por fecha y nombre
  const handleSearch = async () => {
  try {
      setLoading(true);
      let endpoint;
      let params = {};

      // Determinar qué tipo de búsqueda realizar
      if (searchNombre) {
          // Búsqueda por nombre
          endpoint = `${API_BASE_URL}/organizaciones/${orgcod}/proyectos/${projcod}/experts/search`;
          params.name = searchNombre;
      } else if (searchYear || searchMonth) {
          // Búsqueda por fecha
          endpoint = `${API_BASE_URL}/organizaciones/${orgcod}/proyectos/${projcod}/experts/search/date`;
          if (searchYear) params.year = searchYear;
          if (searchMonth) params.month = searchMonth;
      } else {
          // Si no hay criterios de búsqueda, cargar todos los proyectos
          await fetchExpertos();
          return;
      }

      const response = await axios.get(endpoint, { params });
      setExpertos(response.data);
      setError(null);
  } catch (err) {
      console.error("Error en la búsqueda:", err);
      setError(err.response?.data?.error || "Error al buscar proyectos");
      setExpertos([]);
  } finally {
      setLoading(false);
  }
};



  return (
    <div className="expe-container">
      <header className="expe-header">
        <h1>ReqWizards App</h1>
        <div className="flex-container">
          <span onClick={irAMenuOrganizaciones}>Menú Principal /</span>
          <span onClick={irAListaProyecto}>Mocar Company /</span>
          <span onClick={irAMenuProyecto}>Sistema Inventario /</span>
          <span onClick={irAPlantillas}>Plantillas /</span>
          <span>Expertos</span>

        </div>
      </header>

      <div className="expesub-container">
        <aside className="expe-sidebar">
          <div className="bar-expe">
            <p1 onClick={irAMenuOrganizaciones}>MENU PRINCIPAL</p1>
          </div>

          <div className="expe-profile-section">
            <div className="expe-profile-icon">👤</div>
            <p2>Nombre Autor - Cod</p2>
            <button onClick={irALogin} className="expe-logout-button">
              Cerrar Sesión
            </button>
          </div>
        </aside>

        <main className="expe-content">
          <h2>EXPERTOS</h2>
          <section className="expe-organizations-section">
            <div className="expe-search-section-bar">
              <button
                onClick={irANuevoExperto}
                className="expe-register-button"
              >
                Nuevo Experto
              </button>
              <div className="expe-sectionTextBuscar">
                <span class="message">
                  <input
                    class="expe-textBuscar"
                    type="text"
                    placeholder="Buscar por nombre"
                    value={searchNombre}
                    onChange={(e) => setSearchNombre(e.target.value)}
                  />
                  <span class="tooltip-text">
                    Filtro de búsqueda por nombre del experto
                  </span>
                </span>

                <button className="expe-search-button" onClick={handleSearch}>
                  Buscar
                </button>
              </div>
            </div>

            <div className="expe-search-section-text">
              <div className="expe-searchbar">
                <select
                  className="expe-year-input"
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
                  className="expe-month-input"
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
            <table className="expe-centertabla">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Fecha</th>
                  <th>Versión</th>
                  <th>Experiencia</th>
                  <th>Opciones</th>
                </tr>
              </thead>
              <tbody>
                {expertos.map((experto) => (
                  <tr key={experto.code}>
                    <td>{experto.code}</td>
                    <td>{experto.firstName}</td>
                    <td>{new Date(experto.creationDate).toLocaleDateString()}</td>
                    <td>{experto.version}</td>
                    <td>{experto.experience}</td>
                    <td>
                      <button className="botton-crud">
                        <FaFolder
                          style={{ color: "orange", cursor: "pointer" }}
                        />
                      </button>
                      <button
                        className="botton-crud"
                        onClick={(e) => {
                          e.stopPropagation();
                          irAEditarExperto(experto.code); // Llama a la función para editar
                        }}
                      >
                        <FaPencilAlt
                          style={{ color: "blue", cursor: "pointer" }}
                        />
                      </button>
                      <button
                        className="botton-crud"
                        onClick={(e) => {
                          e.stopPropagation(); // Evita que el clic se propague al <tr>
                          deleteExpert(experto.code); // Llama a la función de eliminación
                        }}
                      >
                        <FaTrash
                          style={{ color: "red", cursor: "pointer" }}
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

            <div className="ro-buttons">
              <button
                onClick={irAPlantillas}
                className="ro-button"
                size="50"
              >
                Atras
              </button>
            </div>

            <h4 className="expe-h4">
              {expertos.length === 0 ? (
                <p>No hay expertos registrados.</p>
              ) : (
                <table className="expe-centertabla">
                  <thead>{/* Encabezados */}</thead>
                  <tbody>
                    {expertos.map((pro) => (
                      <tr key={pro.code}>{/* Celdas */}</tr>
                    ))}
                  </tbody>
                </table>
              )}
            </h4>
            <div className="expe-export-buttons">
              <button className="expe-export-button">Excel</button>
              <button className="expe-export-button">PDF</button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Expertos;
