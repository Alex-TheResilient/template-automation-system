import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaFolder, FaPencilAlt, FaTrash } from "react-icons/fa";
import "../../../styles/stylesExpertos.css";
import "../../../styles/styles.css";

const Expertos = () => {
  // Variables de enrutamiento
  const location = useLocation();
  const navigate = useNavigate();

  const irAMenuOrganizaciones = () => {
    navigate("/menuOrganizaciones");
  };
  const irAListaProyecto = () => {
    navigate("/listaProyectos");
  };
  const irAMenuProyecto = (code) => {
    navigate(`/menuProyecto?procod=${code}`);
  };
  //Modificar
  const irAEditarProyecto = (projectId) => {
    console.log("ID del proyecto desde listaProyecto:", projectId);
    navigate(`/editarProyecto/${projectId}`);
  };

  const irANuevoExperto = () => {
    navigate(`/nuevoExperto?orgcod=${orgcod}`);
  };

  const irALogin = () => {
    navigate("/");
  };
  const irAPlantillas = () => {
    navigate(`/plantillas`);
  };
  // Obtener los parámetros de consulta
  const queryParams = new URLSearchParams(location.search);
  const orgcod = queryParams.get("orgcod"); // Obtener 'orgcod' de los parámetros de consulta

  //Proyecto
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);

  // Estado para los parámetros de búsqueda
  const [searchNombre, setSearchNombre] = useState("");
  const [searchYear, setSearchYear] = useState("");
  const [searchMonth, setSearchMonth] = useState("");

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

  const fetchProjects = useCallback(async () => {
    //Obtener o listar proyectos de una organizacion
    try {
      const response = await axios.get(
        `http://localhost:5000/api/projects?orgcod=${orgcod}`
      );
      setProjects(response.data);
    } catch (err) {
      setError(
        err.response
          ? err.response.data.error
          : "Error al obtener los proyectos"
      );
    }
  }, [orgcod]);

  useEffect(() => {
    if (orgcod) {
      fetchProjects();
    }
  }, [orgcod, fetchProjects]);

  // Función para buscar proyectos
  const handleSearch = async () => {
    try {
      // Construye los parámetros dinámicamente para evitar enviar valores vacíos
      const params = {
        orgcod: orgcod || "",
      };

      if (searchNombre) {
        params.pronom = searchNombre;
      }
      if (searchYear) {
        params.year = searchYear;
      }
      if (searchMonth) {
        params.month = searchMonth;
      }

      const response = await axios.get(
        "http://localhost:5000/api/projects/searchByOrganization",
        {
          params,
        }
      );

      setProjects(response.data); // Actualiza la lista de proyectos con los resultados
    } catch (err) {
      setError(
        err.response ? err.response.data.error : "Error al buscar proyectos"
      );
    }
  };
  // Función para eliminar un proyecto
  const deleteProject = async (procod) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este proyecto?")) {
      try {
        await axios.delete(`http://localhost:5000/api/projects/${procod}`);
        fetchProjects();
        alert("Proyecto eliminado correctamente.");
      } catch (err) {
        console.error(
          "Error al eliminar el proyecto:",
          err.response?.data || err.message
        );
        alert(
          `Hubo un error al eliminar el proyecto: ${
            err.response?.data.error || err.message
          }`
        );
      }
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
                    <th>Fecha </th>
                    <th>Version</th>
                    <th>Experiencia</th>
                    <th>Opciones</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((pro) => (
                    <tr key={pro.id} onClick={() => irAMenuProyecto(pro.code)}>
                      <td>{pro.code}</td>
                      <td>{pro.name}</td>
                      <td>{new Date(pro.creationDate).toLocaleDateString()}</td>
                      <td>
                        {new Date(pro.modificationDate).toLocaleDateString()}
                      </td>
                      <td>{pro.status}</td>
                      <td>
                        <button className="botton-crud">
                          <FaFolder
                            style={{ color: "orange", cursor: "pointer" }}
                          />
                        </button>
                        <button
                          className="botton-crud"
                          onClick={(e) => {
                            e.stopPropagation(); // Evita que el clic se propague al <tr>
                            irAEditarProyecto(pro.id); // Llama a la función para editar
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
                            deleteProject(pro.code); // Llama a la función de eliminación
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
              {projects.length === 0 ? (
                <p>No hay expertos registrados.</p>
              ) : (
                <table className="expe-centertabla">
                  <thead>{/* Encabezados */}</thead>
                  <tbody>
                    {projects.map((pro) => (
                      <tr key={pro.procod}>{/* Celdas */}</tr>
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
