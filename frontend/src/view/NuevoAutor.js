import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/stylesNuevoAutor.css';
import '../styles/styles.css';
import axios from "axios";

const NuevoAutor = () => {

    const navigate = useNavigate();

    // Datos controlados por el usuario
    const [apellidoPaterno, setApellidoPaterno] = useState("");
    const [apellidoMaterno, setApellidoMaterno] = useState("");
    const [nombre, setNombre] = useState("");
    const [alias, setAlias] = useState("");
    const [rol, setRol] = useState("");
    const [password, setPassword] = useState('');
    const [telefonoAutor, setTelefonoAutor] = useState("");
    const [dniAutor, setDniAutor] = useState("");
    const [estado, setEstado] = useState("");
    const [comentario, setComentario] = useState("");
    //const [permisoPantilla, setPermisoPantilla] = useState([]);

    // Datos automáticos
    const [codigo, setCodigo] = useState("");//Generacion Automatizada
    const [version, setVersion] = useState("0.01");
    const [fecha, setFecha] = useState(""); //Generacion Automatizada
    const [codigoOrganizacion, setcodigoOrganizacion] = useState("ORG-001"); //Cambiar a Generacion Automatizada
    const [autorPantilla, setAutorPantilla] = useState("AUT-000");//Cambiar a Generacion Automatizada
    const [error, setError] = useState(null);

    useEffect(() => {
        // Simular la obtención de datos automáticos desde el servidor
        const fetchAutomaticData = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/authors/last");//Cambiar router
                const nextCode = response.data.nextCode || "AUT-001";
                setCodigo(nextCode);
                setFecha(new Date().toLocaleDateString());
            } catch (err) {
                console.error("Error al obtener datos automáticos:", err);
                setError("No se pudieron cargar los datos automáticos.");
            }
        };
        fetchAutomaticData();
    }, []);

    // Función para registrar la organización
    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/api/authors", { //Cambiar router

                autCod: codigo,
                autVer: version,
                autFecCrea: fecha,
                autApePat: apellidoPaterno,
                autApeMat: apellidoMaterno,
                autNom: nombre,
                autAli: alias,
                autRol: rol,
                password: password,
                autTef: telefonoAutor,
                autDNI: dniAutor,
                autCodOrg: codigoOrganizacion,
                autPan: autorPantilla,
                autEst: estado,
                autCom: comentario,
                //permissions: permisoPantilla,
            });
            if (response.status === 201) {
                alert("Autor registrado correctamente");
                irAAutores();
            }
        } catch (err) {
            setError("Error al registrar al autor: " + err.message);
        }
    };

    // Manejar los cambios en los checkboxes de permisos
    /*const handlePermissionChange = (e, templateName, permissionType) => {
        const { checked } = e.target;
        setFormData((prevData) => {
            const updatedPermissions = prevData.permissions.filter(
                (perm) => perm.templateName !== templateName
            );

            if (checked) {
                updatedPermissions.push({
                    templateName,
                    [permissionType]: true,
                });
            }

            return { ...prevData, permissions: updatedPermissions };
        });
    };*/

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
                    <span>Nuevo autor</span>
                </div>
            </header>

            <div className="rosub-container">

                <aside className="sidebar">
                    {/*<div className="nav-button">
                            <button className="atras-button">Atras</button>
                            <button className="adelante-button">Adelante</button>
                        </div>*/}
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
                    <h2>NUEVO AUTOR</h2>
                    <section className="ro-organization">
                        <h3>
                            <label className="ro-codigo" >Código </label>
                            <label className="ro-version">Version</label>
                            <label className="ro-Fecha">Fecha</label>
                        </h3>
                        <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <input disabled type="text" className="inputBloq-field" value={codigo} readOnly size="30" />
                            </div>
                            <div className="ro-fiel-vers">
                                <input disabled type="text" className="inputBloq-field" value={version} readOnly size="30" />
                            </div>
                            <div className="ro-fiel-fecha">
                                <input disabled type="text" className="inputBloq-field" value={fecha} readOnly size="30" />
                            </div>
                        </div>
                    </section>

                    <section className="ro-organization-section">
                        <h3>Información Personal</h3>

                        <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <h4>Apellido Paterno</h4>
                                <span class="message">
                                    <input className="inputnombre-field" type="text" value={apellidoPaterno} onChange={(e) => setApellidoPaterno(e.target.value)} size="30" />
                                    <span class="tooltip-text">Apellido paterno del autor</span>
                                </span>
                            </div>
                            <div className="ro-fiel-vers">
                                <h4>Apellido Materno</h4>
                                <span class="message">
                                    <input className="inputnombre-field" type="text" value={apellidoMaterno} onChange={(e) => setApellidoMaterno(e.target.value)} size="30" />
                                    <span class="tooltip-text">Apellido materno del autor</span>
                                </span>
                            </div>
                            <div className="ro-fiel-fecha">
                                <h4>Nombres</h4>
                                <span class="message">
                                    <input className="inputnombre-field" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} size="30" />
                                    <span class="tooltip-text">Nombres del autor</span>
                                </span>
                            </div>
                        </div>

                        <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <h4>Alias</h4>
                                <span class="message">
                                    <input className="inputnombre-field" type="text" value={alias} onChange={(e) => setAlias(e.target.value)} size="30" />
                                    <span class="tooltip-text">Alias del autor</span>
                                </span>
                            </div>
                            <div className="ro-fiel-vers">
                                <h4>Rol</h4>
                                <span class="message">
                                    <input className="inputnombre-field" type="text" value={rol} onChange={(e) => setRol(e.target.value)} size="30" />
                                    <span class="tooltip-text">Rol del autor en el proyecto</span>
                                </span>
                            </div>
                            <div className="ro-fiel-fecha">
                                <h4>Contraseña</h4>
                                <span class="message">
                                    <input className="inputnombre-field" type="text" value={password} onChange={(e) => setPassword(e.target.value)} size="30" />
                                    <span class="tooltip-text">Contraseña del autor, este debe tener al menos 6 caracteres</span>
                                </span>
                            </div>
                        </div>

                        <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <h4>Teléfono</h4>
                                <span class="message">
                                    <input className="inputnombre-field" type="text" value={telefonoAutor} onChange={(e) => setTelefonoAutor(e.target.value)} size="30" />
                                    <span class="tooltip-text">Teléfono del autor, este debe contener 9 dígitos</span>
                                </span>
                            </div>
                            <div className="ro-fiel-vers">
                                <h4>DNI</h4>
                                <span class="message">
                                    <input className="inputnombre-field" type="text" value={dniAutor} onChange={(e) => setDniAutor(e.target.value)} size="30" />
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
                                <input disabled type="text" className="inputBloq-field" value={codigoOrganizacion} readOnly size="30" />
                            </div>
                            <div className="ro-fiel-vers">
                                <input disabled type="text" className="inputBloq-field" value={autorPantilla} readOnly size="30" />
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
                            <textarea className="input-fieldtext" rows="3" value={comentario} onChange={(e) => setComentario(e.target.value)} placeholder="Añadir comentarios sobre el proyecto"></textarea>
                        </div>
                    </section>

                    <section className="ro-organizations-section">
                        {/*
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
                        */}
                        <div className="ro-buttons">
                            <button onClick={irAAutores} className="ro-button" size="60">Cancelar</button>
                            <button onClick={handleRegister} className="ro-button" size="60">Crear Autor</button>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default NuevoAutor;