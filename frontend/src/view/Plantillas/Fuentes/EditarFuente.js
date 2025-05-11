// frontend/src/view/RegistroOrganizacion.js
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import '../../../styles/stylesNuevaFuente.css';
import '../../../styles/styles.css';
import axios from "axios";

const EditarFuente = () => {
    const navigate = useNavigate();
    const {orgcod, projcod } = useParams();
    // Datos controlados por el usuario
    const [nombre, setNombre] = useState("");
    const [direccion, setDireccion] = useState("");
    const [telefonoOrganizacion, setTelefonoOrganizacion] = useState("");
    const [representanteLegal, setRepresentanteLegal] = useState("");
    const [telefonoRepresentante, setTelefonoRepresentante] = useState("");
    const [ruc, setRuc] = useState("");
    const [contacto, setContacto] = useState("");
    const [telefonoContacto, setTelefonoContacto] = useState("");
    const [estado, setEstado] = useState("");
    const [comentario, setComentario] = useState("");

    // Datos automáticos
    const [codigo, setCodigo] = useState("");
    const [version, setVersion] = useState("0.01");
    const [fecha, setFecha] = useState("");
    const [tipo, setTipo] = useState("Contratante");
    const [autor, setAutor] = useState("AUT-00.00");

    const [error, setError] = useState(null);

    useEffect(() => {
        // Simular la obtención de datos automáticos desde el servidor
        const fetchAutomaticData = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/organizations/last");
                const nextCode = response.data.nextCode || "ORG-001";
                setCodigo(nextCode);
                setFecha(new Date().toLocaleDateString());
            } catch (err) {
                console.error("Error al obtener datos automáticos:", err);
                setError("No se pudieron cargar los datos automáticos.");
            }
        };
        fetchAutomaticData();
    }, []);

    const irAMenuOrganizaciones = () => {
         navigate("/organizations");
    };
    const irAListaProyecto = () => {
        navigate(`/organizations/${orgcod}/projects`);
      };
      const irAFuentes = () => {
        navigate("/fuentes");
      };
      const irAPlantillas = () => {
        navigate(`/projects/${projcod}/plantillas`);
      };
      const irAMenuProyecto = (code) => {
        //navigate(`/menuProyecto?procod=${code}`);
        navigate(`/projects/${projcod}/menuProyecto`);
      };

    // Función para registrar la organización
    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/api/organizations", {
                orgcod: codigo,
                orgver: version,
                orgfeccrea: fecha,
                orgtiporgcod: tipo,
                orgautcod: autor,
                orgnom: nombre,
                orgdir: direccion,
                orgtel: telefonoOrganizacion,
                orgrepleg: representanteLegal,
                orgtelrepleg: telefonoRepresentante,
                orgruc: ruc,
                orgcontact: contacto,
                orgtelcon: telefonoContacto,
                orgest: estado,
                orgcom: comentario,
            });
            if (response.status === 201) {
                alert("Organización registrada correctamente");
                irAMenuOrganizaciones();
            }
        } catch (err) {
            setError("Error al registrar la organización: " + err.message);
        }
    };

    return (
        <div className="ro-container">
            <header className="ro-header">
                <h1>ReqWizards App</h1>
                <div className="flex-container">
                <span onClick={irAMenuOrganizaciones}>Menú Principal /</span>
                <span onClick={irAListaProyecto}>Mocar Company /</span>
                <span onClick={irAMenuProyecto}>Sistema Inventario /</span>
                <span onClick={irAPlantillas}>Plantillas /</span>
                <span onClick={irAFuentes}>Fuentes /</span>
                <span>Editar Fuente</span>
                </div>
            </header>

            <div className="rosub-container">
                <aside className="sidebar">
                    <div className="bar-ro">
                        <p1 onClick={irAMenuOrganizaciones}>MENU PRINCIPAL</p1>
                    </div>
                    <div className="profile-section">
                        <div className="profile-icon">👤</div>
                        <p2>Nombre Autor - Cod</p2>
                        <button onClick={() => navigate("/")} className="logout-button">Cerrar Sesión</button>
                    </div>
                </aside>

                <main className="ro-content">
                    <h2>EDITAR FUENTE</h2>
                    <section className="ro-organization">
                        <h3>
                            <label className="ro-codigo">Código </label>
                            <label className="ro-version">Versión</label>
                            <label className="ro-Fecha">Fecha</label>
                        </h3>
                        <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <input type="text" className="inputBloq-field"  readOnly size="30" />
                            </div>
                            <div className="ro-fiel-vers">
                                <input type="text" className="inputBloq-field"  readOnly size="30" />
                            </div>
                            <div className="ro-fiel-fecha">
                                <input type="text" className="inputBloq-field"  readOnly size="30" />
                            </div>
                        </div>

                        <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <h4 >Nombre* </h4> <br />
                                <h4>Autores de la Fuente* </h4>                             
                            </div>
                            <div className="ro-fiel-vers">
                                <span class="message">
                                    <input className="inputnombre-field" type="text"  onChange={(e) => setContacto(e.target.value)} size="110" />
                                    <span class="tooltip-text"> Editar el nombre de la fuente </span>
                                </span><br />
                                <span class="message">
                                    <input className="inputautores-field"  type="text" onChange={(e) => setContacto(e.target.value)} size="110" style={{ height: '50px' }} />
                                    <span class="tooltip-text"> Editar los autores de la fuente </span>
                                </span>
                            </div>
                            
                            
                              
                        </div>
                       
                    </section>
                    <section className="ro-organization">
                        <h3>
                            <label className="ro-codigo">Fecha Fuente* </label>
                            <label className="ro-version">Autor de plantilla </label>
                            <label className="ro-Fecha">Estado* </label>
                        </h3>
                        <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <span class="message">
                                    <input type="text" className="inputfechafuen-field" value={codigo} size="30" />
                                    <span class="tooltip-text"> Editar la fecha de la fuente </span>
                                </span>
                                
                            </div>
                            <div className="ro-fiel-vers">
                                <span class="message">
                                    <input type="text" className="inputBloq-field"  readOnly size="30" />
                                    <span class="tooltip-text"> Codigo del autor de la fuente </span>
                                </span>
                                
                            </div>
                            <div className="ro-fiel-fecha">
                                <select id="estado" name="estado" required>
                                    <option value="">Seleccione un estado</option>
                                    <option value="activo">Activo</option>
                                    <option value="inactivo">Inactivo</option>
                                    <option value="pendiente">Pendiente</option>
                                </select>
                            </div>
                        </div>
                    </section>
                    <section className="ro-organizations-section">
                        <h3>Comentario*</h3>
                        <div className="input-text">
                            <textarea className="input-fieldtext" rows="3" value={comentario} onChange={(e) => setComentario(e.target.value)} placeholder="Añadir comentarios sobre la fuente"></textarea>
                        </div>

                        <div className="ro-buttons">
                            <button onClick={irAFuentes} className="ro-button">Cancelar</button>
                            <button onClick={handleRegister} className="ro-button">Guardar Cambios</button>
                        </div>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                    </section>
                </main>
            </div>
        </div>
    );
};

export default EditarFuente;
