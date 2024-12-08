import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/stylesNuevoAutor.css';
import '../styles/styles.css';
import axios from "axios";

const EditarAutor = () => {

    const navigate = useNavigate();

    // Datos controlados por el usuario
    const [apellidoPaternoAutor, setApellidoPaternoAutor] = useState("Perez");
    const [apellidoMaternoAutor, setApellidoMaternoAutor] = useState("Casimiro");
    const [nombreAutor, setNombreAutor] = useState("Felix");
    const [aliasAutor, setAliasAutor] = useState("Fepe");
    const [rolAutor, setRolAutor] = useState("Diseñador de software");
    const [passwordAutor, setPasswordAutor] = useState('123456');
    const [telefonoAutor, setTelefonoAutor] = useState("123456789");
    const [dniAutor, setDniAutor] = useState("87654321");
    const [estado, setEstado] = useState("En progreso");
    const [comentario, setComentario] = useState("Trabaja con el cliente");
    //const [permisoPantilla, setPermisoPantilla] = useState([]);

    // Datos automáticos
    const [codigoAutor, setCodigoAutor] = useState("AUT-0002");
    const [versionAutor, setVersionAutor] = useState("00.01");
    const [fechaCreacionAutor, setFechaCreacionAutor] = useState("23/10/2023"); 
    const [codigoOrganizacion, setCodigoOrganizacion] = useState("ORG-001");
    const [autorPantilla, setAutorPantilla] = useState("AUT-000");

    // Función para manejar cambios en el input
    const handleChange = (event) => {
        setApellidoPaternoAutor(event.target.value);
        setApellidoMaternoAutor(event.target.value);
        setNombreAutor(event.target.value);
        setAliasAutor(event.target.value);
        setRolAutor(event.target.value);
        setPasswordAutor(event.target.value);
        setDniAutor(event.target.value);
        setEstado(event.target.value);
        setComentario(event.target.value);
        setCodigoAutor(event.target.value);
        setVersionAutor(event.target.value);
        setFechaCreacionAutor(event.target.value);
        setCodigoOrganizacion(event.target.value);
        setAutorPantilla(event.target.value);
    };
    const irAMenuOrganizaciones = () => {
        navigate("/menuOrganizaciones");
    };

    const irAAutores = () => {
        navigate("/autores");
    };

    const irALogin = () => {
        navigate("/");
    };

    const irAMenuProyecto = () => {
        navigate("/menuProyecto");
    };
    const irAListaProyecto = () => {
        navigate("/listaProyectos");
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
                                value={codigoAutor} 
                                onChange={handleChange} 
                                readOnly 
                                size="30" />
                            </div>
                            <div className="ro-fiel-vers">
                                <input 
                                disabled 
                                type="text" 
                                className="inputBloq-field" 
                                value={versionAutor}
                                onChange={handleChange}  
                                readOnly 
                                size="30" />
                            </div>
                            <div className="ro-fiel-fecha">
                                <input 
                                disabled 
                                type="text" 
                                className="inputBloq-field" 
                                value={fechaCreacionAutor} 
                                onChange={handleChange}  
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
                                    value={apellidoPaternoAutor} 
                                    onChange={handleChange}  
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
                                    value={apellidoMaternoAutor} 
                                    onChange={handleChange}  
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
                                    value={nombreAutor} 
                                    onChange={handleChange}  
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
                                    value={aliasAutor} 
                                    onChange={handleChange}  
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
                                    value={rolAutor} 
                                    onChange={handleChange}  
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
                                    value={passwordAutor} 
                                    onChange={handleChange}  
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
                                    value={telefonoAutor} 
                                    onChange={handleChange}  
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
                                    value={dniAutor} 
                                    onChange={handleChange}  
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
                                value={codigoOrganizacion}
                                onChange={handleChange}   
                                readOnly 
                                size="30" />
                            </div>
                            <div className="ro-fiel-vers">
                                <input 
                                disabled 
                                type="text" 
                                className="inputBloq-field" 
                                value={autorPantilla} 
                                onChange={handleChange}  
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