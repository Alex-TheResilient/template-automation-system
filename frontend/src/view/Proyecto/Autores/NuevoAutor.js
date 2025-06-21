import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import '../../../styles/stylesNuevoAutor.css';
import '../../../styles/styles.css';
import axios from "axios";

const NuevoAutor = () => {

    const navigate = useNavigate();
    const hasFetched = useRef(false);
    const { orgcod, projcod } = useParams();
    // Datos controlados por el usuario

    const [paternalSurname, setApellidoPaterno] = useState("");
    const [maternalSurname, setApellidoMaterno] = useState("");
    const [firstName, setNombre] = useState("");
    const [alias, setAlias] = useState("");
    //const [role, setRol] = useState("");
    const [password, setPassword] = useState('');
    const [phone, setTelefono] = useState("");
    const [dni, setDni] = useState("");
    const [status, setEstado] = useState("");
    const [comments, setComentario] = useState("");
    //const [permisoPantilla, setPermisoPantilla] = useState([]);

    // Datos automáticos
    const [codigo, setCodigo] = useState("");//Generacion Automatizada
    const [version, setVersion] = useState("0.01");
    const [creationDate, setFechaCreacion] = useState(
        new Date().toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' })
    );
    const [codigoOrganizacion, setcodigoOrganizacion] = useState("ORG-001"); //Cambiar a Generacion Automatizada
    const [autorPantilla, setAutorPantilla] = useState("AUT-000");//Cambiar a Generacion Automatizada
    const [error, setError] = useState(null);
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/v1";

    //Siguente codigo de autor
    useEffect(() => {
        if (hasFetched.current) return; // Previene segunda ejecución
        hasFetched.current = true;
        console.log("Ejecutando useEffect...");
        const fetchNextCodigoAutor = async () => {
            try {

                // Llamar al endpoint usando parámetros de consulta
                const response = await axios.get(`${API_BASE_URL}/authors/next-code`);
                console.log("Respuesta del backend:", response.data);
                // Asignar el valor recibido al estado
                setCodigo(response.data.nextCode || "AUT-001");
            } catch (err) {
                console.error("Error al obtener el siguiente código de actor:", err);
                setError("No se pudo cargar el siguiente código del actor.");
            }
        };

        fetchNextCodigoAutor();
    }, []);
    //Roles
    const [roleId, setRoleId] = useState("");
    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);
    useEffect(() => {
        const fetchRoles = async () => {
            const res = await axios.get(`${API_BASE_URL}/roles`);
            setRoles(res.data.data || []); // Asegúrate de ajustar según cómo devuelves los datos
        };

        fetchRoles();
    }, []);

    // Función para registrar el autor
    const registrarAutor = async (e) => {
        e.preventDefault();
        try {
            // Realiza la solicitud POST con los datos correctos
            await axios.post(`${API_BASE_URL}/authors`, {
                firstName,
                paternalSurname,
                maternalSurname,
                version,
                status,
                alias,
                password,
                phone,
                dni,
                comments,
                role: {
                    connect: {
                        id: roleId
                    }
                }
            });

            // Redirigir a la página de expertos o realizar otra acción
            irAAutores();

        } catch (err) {
            console.error("Error al registrar el experto:", err);
            setError("No se pudo registrar al experto. Inténtalo de nuevo.");
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
                                <input disabled type="text" className="inputBloq-field" value={creationDate} readOnly size="30" />
                            </div>
                        </div>
                    </section>

                    <section className="ro-organization-section">
                        <h3>Información Personal</h3>

                        <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <h4>Apellido Paterno</h4>
                                <span class="message">
                                    <input className="inputnombre-field" type="text" value={paternalSurname} onChange={(e) => setApellidoPaterno(e.target.value)} size="30" />
                                    <span class="tooltip-text">Apellido paterno del autor</span>
                                </span>
                            </div>
                            <div className="ro-fiel-vers">
                                <h4>Apellido Materno</h4>
                                <span class="message">
                                    <input className="inputnombre-field" type="text" value={maternalSurname} onChange={(e) => setApellidoMaterno(e.target.value)} size="30" />
                                    <span class="tooltip-text">Apellido materno del autor</span>
                                </span>
                            </div>
                            <div className="ro-fiel-fecha">
                                <h4>Nombres</h4>
                                <span class="message">
                                    <input className="inputnombre-field" type="text" value={firstName} onChange={(e) => setNombre(e.target.value)} size="30" />
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
                                    <select id="rol" name="rol" value={roleId} onChange={(e) => {
                                        const selectedId = e.target.value;
                                        setRoleId(selectedId);

                                        const fullRole = roles.find((r) => r.id === selectedId);
                                        setSelectedRole(fullRole); // Aquí sí: guardas el objeto seleccionado
                                    }} required>
                                        <option value="">Seleccione un rol</option>
                                        {roles.map((r) => (
                                            <option key={r.id} value={r.id}>{r.name}</option>
                                        ))}</select>
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
                                    <input className="inputnombre-field" type="text" value={phone} onChange={(e) => setTelefono(e.target.value)} size="30" />
                                    <span class="tooltip-text">Teléfono del autor, este debe contener 9 dígitos</span>
                                </span>
                            </div>
                            <div className="ro-fiel-vers">
                                <h4>DNI</h4>
                                <span class="message">
                                    <input className="inputnombre-field" type="text" value={dni} onChange={(e) => setDni(e.target.value)} size="30" />
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
                                <select id="estado" name="estado-input"
                                    value={status}
                                    onChange={(e) => setEstado(e.target.value)} required>
                                    <option value="">Seleccione un tipo</option>
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
                            <textarea className="input-fieldtext" rows="3" value={comments} onChange={(e) => setComentario(e.target.value)} placeholder="Añadir comentarios sobre el proyecto"></textarea>
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
                            <button onClick={registrarAutor} className="ro-button" size="60">Crear Autor</button>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default NuevoAutor;