import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import '../../../styles/stylesNuevoAutor.css';
import '../../../styles/styles.css';
import axios from "axios";

const EditarAutor = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const {orgcod, projcod,autid,autcod } = location.state || {};

    // Datos controlados por el usuario
    const [apellidoPaterno, setApellidoPaternoAutor] = useState("");
    const [apellidoMaterno, setApellidoMaternoAutor] = useState("");
    const [nombre, setNombreAutor] = useState("");
    const [alias, setAliasAutor] = useState("");
    const [rol, setRolAutor] = useState("");
    const [password, setPasswordAutor] = useState("");
    const [telefono, setTelefonoAutor] = useState("");
    const [dni, setDniAutor] = useState("");
    const [estado, setEstado] = useState("");
    const [comentario, setComentario] = useState("");
    const [error, setError] = useState(null);
    //const [permisoPantilla, setPermisoPantilla] = useState([]);

    // Datos automáticos
    const [codigo, setCodigoAutor] = useState("");
    const [version, setVersionAutor] = useState("");
    const [fechaCreacion, setFechaCreacionAutor] = useState(""); 
    const [codigoOrganizacion, setCodigoOrganizacion] = useState("");
    const [autorPantilla, setAutorPantilla] = useState("");

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/v1";
    // Extraer Datos
    const fetchAuthorData = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/authors/${autid}`);
            const data = response.data;
            const rawDate = new Date(data.creationDate);
            const formattedDate = `${rawDate.getDate()}/${rawDate.getMonth() + 1}/${rawDate.getFullYear()}`;
            setCodigoAutor(data.code);
            setFechaCreacionAutor(formattedDate);
            setComentario(data.comments);
            setVersionAutor(data.version);
            setNombreAutor(data.firstName);
            setApellidoPaternoAutor(data.paternalSurname);
            setApellidoMaternoAutor(data.maternalSurname);
            setAliasAutor(data.alias);
            setEstado(data.status);
            setDniAutor(data.dni);
            setTelefonoAutor(data.phone);
            setRolAutor(data.role);
            setPasswordAutor(data.password);
            setEstado(data.status);
            setAutorPantilla(data.templateAuthor?.name);
            setComentario(data.comments);
        } catch (err) {
            setError("Error al obtener los datos del autor: " + err.message);
        }
    };
    //Guardar Datos Editados
    const handleEdit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.put(`${API_BASE_URL}/authors/${autid}`, {
                nombre,
                comentario, 
            });
    
            if (response.status === 200) {
                alert("Experto actualizado correctamente");
                irAAutores();
            }
        } catch (err) {
            setError("Error al actualizar el experto: " + err.message);
        }
    };
    useEffect(() => {
            fetchAuthorData();
    }, [autid]);

    const irAMenuOrganizaciones = () => {
        navigate("/organizations");
    };

    const irAAutores = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/authors`);
    };

    const irALogin = () => {
        navigate("/");
    };

    const irAMenuProyecto = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/menuProyecto`);
    };
    const irAListaProyecto = () => {
        navigate(`/organizations/${orgcod}/projects`);
    };


    return (
        <div className="ro-container">
            <header className="ro-header">
                <h1>ReqWizards App</h1>
                <div className="flex-container">
                    <span onClick={irAMenuOrganizaciones}>Menú Principal /</span>
                    <span onClick={irAListaProyecto}>Mocar Company /</span>
                    <span onClick={irAMenuProyecto}>Sistema Inventario /</span>
                    <span onClick={irAAutores}>Autores /</span>
                    <span>Editar autor</span>
                </div>
            </header>

            <div className="rosub-container">

                <aside className="sidebar">
                    <div className="bar-ro">
                        <p1 onClick={irAMenuOrganizaciones}>MENU PRINCIPAL</p1>
                    </div>

                    <div className="profile-section" >
                        <div className="profile-icon">👤</div>
                        <p2>Nombre Autor - Cod</p2>
                        <button onClick={irALogin} className="logout-button" >Cerrar Sesión</button>
                    </div>
                </aside>

                <main className="ro-content">
                    <h2>EDITAR AUTOR</h2>
                    <section className="ro-organization">
                        <h3>
                            <label className="ro-codigo" >Código </label>
                            <label className="ro-version">Version</label>
                            <label className="ro-Fecha">Fecha</label>
                        </h3>
                        <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <input 
                                disabled 
                                type="text" 
                                className="inputBloq-field" 
                                value={codigo} 
                                OnChange={(e) => setCodigoAutor(e.target.value)} 
                                readOnly 
                                size="30" />
                            </div>
                            <div className="ro-fiel-vers">
                                <input 
                                disabled 
                                type="text" 
                                className="inputBloq-field" 
                                value={version}
                                OnChange={(e) => setVersionAutor(e.target.value)}
                                readOnly 
                                size="30" />
                            </div>
                            <div className="ro-fiel-fecha">
                                <input 
                                disabled 
                                type="text" 
                                className="inputBloq-field" 
                                value={fechaCreacion} 
                                OnChange={(e) => setFechaCreacionAutor(e.target.value)}
                                readOnly 
                                size="30" />
                            </div>
                        </div>
                    </section>

                    <section className="ro-organization-section">
                        <h3>Información Personal</h3>

                        <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <h4>Apellido Paterno</h4>
                                <span class="message">
                                    <input 
                                    className="inputnombre-field" 
                                    type="text" 
                                    value={apellidoPaterno} 
                                    OnChange={(e) => setApellidoPaternoAutor(e.target.value)} 
                                    size="30" />
                                    <span class="tooltip-text">Apellido paterno del autor</span>
                                </span>
                            </div>
                            <div className="ro-fiel-vers">
                                <h4>Apellido Materno</h4>
                                <span class="message">
                                    <input 
                                    className="inputnombre-field" 
                                    type="text" 
                                    value={apellidoMaterno} 
                                    OnChange={(e) => setApellidoMaternoAutor(e.target.value)} 
                                    size="30" />
                                    <span class="tooltip-text">Apellido materno del autor</span>
                                </span>
                            </div>
                            <div className="ro-fiel-fecha">
                                <h4>Nombres</h4>
                                <span class="message">
                                    <input 
                                    className="inputnombre-field" 
                                    type="text" 
                                    value={nombre} 
                                    OnChange={(e) => setNombreAutor(e.target.value)} 
                                    size="30" />
                                    <span class="tooltip-text">Nombres del autor</span>
                                </span>
                            </div>
                        </div>

                        <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <h4>Alias</h4>
                                <span class="message">
                                    <input 
                                    className="inputnombre-field" 
                                    type="text" 
                                    value={alias} 
                                    OnChange={(e) => setAliasAutor(e.target.value)}
                                    size="30" />
                                    <span class="tooltip-text">Alias del autor</span>
                                </span>
                            </div>
                            <div className="ro-fiel-vers">
                                <h4>Rol</h4>
                                <span class="message">
                                    <input 
                                    className="inputnombre-field" 
                                    type="text" 
                                    value={rol?.name} 
                                    OnChange={(e) => setRolAutor(e.target.value)} 
                                    size="30" />
                                    <span class="tooltip-text">Rol del autor en el proyecto</span>
                                </span>
                            </div>
                            <div className="ro-fiel-fecha">
                                <h4>Contraseña</h4>
                                <span class="message">
                                    <input 
                                    className="inputnombre-field" 
                                    type="text" 
                                    value={password} 
                                    OnChange={(e) => setPasswordAutor(e.target.value)}
                                    size="30" />
                                    <span class="tooltip-text">Contraseña del autor, este debe tener al menos 6 caracteres</span>
                                </span>
                            </div>
                        </div>

                        <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <h4>Teléfono</h4>
                                <span class="message">
                                    <input 
                                    className="inputnombre-field" 
                                    type="text" 
                                    value={telefono} 
                                    OnChange={(e) => setTelefonoAutor(e.target.value)} 
                                    size="30" />
                                    <span class="tooltip-text">Teléfono del autor, este debe contener 9 dígitos</span>
                                </span>
                            </div>
                            <div className="ro-fiel-vers">
                                <h4>DNI</h4>
                                <span class="message">
                                    <input 
                                    className="inputnombre-field" 
                                    type="text" 
                                    value={dni} 
                                    OnChange={(e) => setDniAutor(e.target.value)} 
                                    size="30" />
                                    <span class="tooltip-text">DNI del autor, este debe contener 8 dígitos</span>
                                </span>
                            </div>
                        </div>
                    </section>

                    <section className="ro-organization">
                        <h3>
                            <label className="ro-codigo" >Organización </label>
                            <label className="ro-version">Autor de plantilla</label>
                            <label className="ro-Fecha">Estado</label>
                        </h3>
                        <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <input 
                                disabled 
                                type="text" 
                                className="inputBloq-field" 
                                value={orgcod}   
                                readOnly 
                                size="30" />
                            </div>
                            <div className="ro-fiel-vers">
                                <input 
                                disabled 
                                type="text" 
                                className="inputBloq-field" 
                                value={autorPantilla} 
                                OnChange={(e) => setAutorPantilla(e.target.value)}  
                                readOnly 
                                size="30" />
                            </div>
                            <div className="ro-fiel-fecha">
                                <select 
                                    className="estado-input" 
                                    value={estado} 
                                    onChange={(e) => setEstado(e.target.value)}
                                >
                                    <option value="">[Seleccionar]</option>
                                    <option value="por empezar">Por empezar</option>
                                    <option value="en progreso">En progreso</option>
                                    <option value="finalizado">Finalizado</option>
                                </select>
                            </div>

                        </div>
                    </section>

                    <section className="ro-organizations-section">
                        <h3>Comentario</h3>

                        <div className="input-text">
                            <textarea 
                            className="input-fieldtext" 
                            rows="3" 
                            value={comentario} 
                            onChange={(e) => setComentario(e.target.value)} 
                            placeholder="Añadir comentarios sobre el proyecto"></textarea>
                        </div>
                    </section>

                    <section className="ro-organizations-section">
                        <h3>Permiso para ver y editar plantillas</h3>

                        <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <input type="checkbox" className="custom-checkbox" />
                                <input type="checkbox" className="custom-checkbox" />
                            </div>
                            <div className="ro-fiel-cod-mar">
                                <input disabled type="text" className="inputBloq-field-select" value="Plantilla de Actores" readOnly size="60" />
                            </div>
                            <div className="ro-fiel-cod">
                                <input type="checkbox" className="custom-checkbox" />
                                <input type="checkbox" className="custom-checkbox" />
                            </div>
                            <div className="ro-fiel-cod-mar">
                                <input disabled type="text" className="inputBloq-field-select" value="Plantilla de Trazabilidad" readOnly size="60" />
                            </div>
                        </div>

                        <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <input type="checkbox" className="custom-checkbox" />
                                <input type="checkbox" className="custom-checkbox" />
                            </div>
                            <div className="ro-fiel-cod-mar">
                                <input disabled type="text" className="inputBloq-field-select" value="Plantilla de Entrevista" readOnly size="60" />
                            </div>
                            <div className="ro-fiel-cod">
                                <input type="checkbox" className="custom-checkbox" />
                                <input type="checkbox" className="custom-checkbox" />
                            </div>
                            <div className="ro-fiel-cod-mar">
                                <input disabled type="text" className="inputBloq-field-select" value="Plantilla de Req. no Funcionales" readOnly size="60" />
                            </div>
                        </div>

                        <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <input type="checkbox" className="custom-checkbox" />
                                <input type="checkbox" className="custom-checkbox" />
                            </div>
                            <div className="ro-fiel-cod-mar">
                                <input disabled type="text" className="inputBloq-field-select" value="Plantilla de Educción" readOnly size="60" />
                            </div>
                            <div className="ro-fiel-cod">
                                <input type="checkbox" className="custom-checkbox" />
                                <input type="checkbox" className="custom-checkbox" />
                            </div>
                            <div className="ro-fiel-cod-mar">
                                <input disabled type="text" className="inputBloq-field-select" value="Plantilla de Expertos" readOnly size="60" />
                            </div>
                        </div>

                        <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <input type="checkbox" className="custom-checkbox" />
                                <input type="checkbox" className="custom-checkbox" />
                            </div>
                            <div className="ro-fiel-cod-mar">
                                <input disabled type="text" className="inputBloq-field-select" value="Plantilla de Ilación" readOnly size="60" />
                            </div>
                            <div className="ro-fiel-cod">
                                <input type="checkbox" className="custom-checkbox" />
                                <input type="checkbox" className="custom-checkbox" />
                            </div>
                            <div className="ro-fiel-cod-mar">
                                <input disabled type="text" className="inputBloq-field-select" value="Plantilla de Fuentes" readOnly size="60" />
                            </div>
                        </div>

                        <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <input type="checkbox" className="custom-checkbox" />
                                <input type="checkbox" className="custom-checkbox" />
                            </div>
                            <div className="ro-fiel-cod-mar">
                                <input disabled type="text" className="inputBloq-field-select" value="Plantilla de Especificación" readOnly size="60" />
                            </div>
                            <div className="ro-fiel-cod">
                                <input type="checkbox" className="custom-checkbox" />
                                <input type="checkbox" className="custom-checkbox" />
                            </div>
                            <div className="ro-fiel-cod-mar">
                                <input disabled type="text" className="inputBloq-field-select" value="Plantilla de Métricas" readOnly size="60" />
                            </div>
                        </div>

                        <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <input type="checkbox" className="custom-checkbox" />
                                <input type="checkbox" className="custom-checkbox" />
                            </div>
                            <div className="ro-fiel-cod-mar">
                                <input disabled type="text" className="inputBloq-field-select" value="Plantilla de Artefactos" readOnly size="60" />
                            </div>
                            <div className="ro-fiel-cod">
                                <input type="checkbox" className="custom-checkbox" />
                                <input type="checkbox" className="custom-checkbox" />
                            </div>
                            <div className="ro-fiel-cod-mar">
                                <input disabled type="text" className="inputBloq-field-select" value="Plantilla de Pruebas de Software" readOnly size="60" />
                            </div>
                        </div>

                        <div className="ro-buttons">
                            <button onClick={irAAutores} className="ro-button" size="60">Cancelar</button>
                            <button onClick={irAAutores} className="ro-button" size="60">Guardar cambios</button>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default EditarAutor;