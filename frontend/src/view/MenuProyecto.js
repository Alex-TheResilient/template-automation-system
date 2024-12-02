import React, {useState} from "react"
import { useNavigate, useLocation } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import '../styles/stylesMenuProyecto.css'
import '../styles/styles.css';
import axios from "axios";



const MenuProyecto = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [codigoAutor, setCodigoAutor] = useState("");
    const [resultados, setResultados] = useState([]);
    const [mensaje, setMensaje] = useState("");

    const irALogin = () => {
        navigate("/");
    };
    const irAMenuOrganizaciones = () => {
        navigate("/menuOrganizaciones");
    };
    const irAActaAceptacion = () => {
        navigate(`/actaAceptacion?code=${codigo}`);
    };
    const irAAutores = () => {
        navigate("/autores");
    };
    const irAEntrevistas = () => {
        navigate("/entrevistas");
    };
    const irARoles = () => {
        navigate("/roles");
    };
    const irAPlantillas = () => {
        navigate("/plantillas");
    };
    const irAListaProyecto = () => {
        navigate("/listaProyectos");
    };

    // Obtener los parámetros de consulta
    const queryParams = new URLSearchParams(location.search);
    const codigo = queryParams.get('procod');

    const manejarBusqueda = (e) => {
        setCodigoAutor(e.target.value);
    };
    const buscarAutor = async () => {
        try {
            const response = await axios.get(`/api/authors/searchCode`, {
                params: { codAut: codigoAutor}
            });
            if(response.data.length === 0){
                setMensaje("No se encontraron resultados");
            }else {
                setResultados(response.data);
                setMensaje("");
            }
        } catch (error) {
            console.log("Error al buscar:", error);
            setMensaje("Error al realizar la búsqueda. intenta de nuevo");
            setResultados([]);
        }
    };

    return (
        <div className="menu-container">
            <header className="menu-header">
                <h1>ReqWizards App</h1>
                <div className="flex-container">
                    <span onClick={irAMenuOrganizaciones}>Menú Principal /</span>
                    <span onClick={irAListaProyecto}>Mocar Company /</span>
                    <span>Sistema Inventario</span>
                </div>
            </header>

            <div className="menusub-container">

                <aside className="sidebar">
                    {/*<div className="nav-button">
                            <button className="atras-button">Atras</button>
                            <button className="adelante-button">Adelante</button>
                        </div>*/}
                    <div className="bar-menu">
                    <p1 onClick={irAMenuOrganizaciones}>MENU PRINCIPAL</p1>
                    </div>

                    <div className="profile-section" >
                        <div className="profile-icon">👤</div>
                        <p2>Nombre Autor - Cod</p2>
                        <button onClick={irALogin} className="logout-button" >Cerrar Sesión</button>
                    </div>
                </aside>

                <main className="main-content">
                    <h2>MOCAR COMPANY - SISTEMA DE INVENTARIO</h2>
                    <section className="destacados-section">
                        <h3>Destacados</h3>
                        <div class="boton-container">
                            <button onClick={irAActaAceptacion} className="acta-aceptacion-button">ACTA DE ACEPTACIÓN</button>
                            <button onClick={irAAutores} className="autores-button">AUTORES</button>
                            <button onClick={irAEntrevistas} className="entrevistas-button">ENTREVISTAS</button>
                            <button onClick={irARoles} className="roles-button">ROLES</button>
                            <button onClick={irAPlantillas} className="plantillas-button">PLANTILLAS</button>
                        </div>

                    </section>
                    <section className="avance-section">
                        <h3>Avance del Proyecto</h3>
                        <h4>AVANCE DEL PROYECTO</h4>
                        <div style={{ height: '80px' }}></div>
                    </section>
                    <section className="historial-section">
                        <h3>Historial</h3>
                        <h2>Filtro de búsqueda</h2>

                        <div class="boton-container">
                            <div class="sectionTextBuscar">
                                <input class="codigoBuscar" type="text" placeholder="Código de autor"
                                    value={codigoAutor}
                                    onChange={manejarBusqueda} />
                                <input class="plantillaBuscar" type="text" placeholder="Plantilla" />
                                <input class="estadoBuscar" type="text" placeholder="Estado" />
                                <input class="fechaBuscar" type="text" placeholder="Fecha" />
                                <button className="search-button" onClick={buscarAutor}>Buscar</button>
                            </div>
                        </div>
                        {mensaje && <div className="mensaje">{mensaje}</div>}  {/* Mostrar mensaje si hay error o no resultados */}
                        <div className="menu-tabla-center">
                            <table className="menu-centertabla">
                                <thead>
                                    <tr>
                                        <th>Autor</th>
                                        <th>Plantilla</th>
                                        <th>Fecha de modificación</th>
                                        <th>Estado</th>
                                        <th>Opciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {resultados.length > 0 ?(
                                        resultados.map((autor) => (
                                            <tr key={autor.autCod}>
                                                <td>{autor.autCod}</td>
                                                <td>Ilacion</td>
                                                <td>23/10/2024</td>
                                                <td>00.01</td>
                                                <td>
                                                    <button className="button-ver"><FaEye style={{ color: "brown", cursor: "pointer" }} /></button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td>AUT-0007</td>
                                            <td>Educcion</td>
                                            <td>10/05/2024</td>
                                            <td>00.02</td>
                                            <td>
                                                <button className="button-ver"><FaEye style={{ color: "brown", cursor: "pointer" }} /></button>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                        </div>

                        <h4>Total de registros 2</h4>
                    </section>

                </main>
            </div>
        </div>
    );
};

export default MenuProyecto