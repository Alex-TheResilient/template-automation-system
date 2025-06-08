import React, { useState } from "react";
import { useNavigate, useLocation, useParams} from "react-router-dom";
import axios from "axios";
import '../../../styles/stylesActaAceptacion.css';
import '../../../styles/styles.css';

const ActaAceptacion = () => {
    // Hooks de React Router
    const navigate = useNavigate();
    const location = useLocation();
    const { orgcod, projcod } = useParams();

    // Estado para el archivo y su previsualización
    const [selectedFile, setSelectedFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    
    // Estados para la llamada a la API
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // URL base de la API desde variables de entorno
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    // --- Funciones de Navegación ---
    const irAMenuOrganizaciones = () => {
        navigate("/organizations");
    };

    const irAMenuProyecto = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/menuProyecto`);
    };

    const irALogin = () => {
        navigate("/");
    };

    const irAListaProyecto = () => {
        navigate(`/organizations/${orgcod}/projects`);
    };

    // Obtener el código del acta desde los query params de la URL
    const queryParams = new URLSearchParams(location.search);
    const codigo = queryParams.get('code');

    // --- Manejadores de eventos ---
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            // Generar previsualización del archivo
            const fileReader = new FileReader();
            fileReader.onloadend = () => {
                setFilePreview(fileReader.result);
            };
            fileReader.readAsDataURL(file);
        } else {
            setSelectedFile(null);
            setFilePreview(null);
        }
    };

    const handleSaveActa = async () => {
        if (!selectedFile) {
            alert("Por favor, selecciona un archivo.");
            return;
        }

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("actaceprocod", codigo);

        try {
            const response = await axios.post(`${API_BASE_URL}/actas`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            // El estándar para una creación exitosa es el código 201 (Created)
            if (response.status === 201) {
                alert("Acta guardada con éxito");
                // Redirige al menú del proyecto específico
                irAMenuProyecto(); 
            }
        } catch (err) {
            // Se estandariza el manejo de errores como en el componente Artefactos
            const errorMessage = err.response 
                ? err.response.data.error 
                : "Error al guardar el acta";
            
            setError(errorMessage);
            console.error("Error al guardar el acta:", err);
            alert(`Hubo un error al guardar el acta: ${errorMessage}`);
        } finally {
            // Se detiene el indicador de carga tanto si hubo éxito como si hubo error
            setLoading(false);
        }
    };
    
    return (
        <div className="acta-container">
            <header className="acta-header">
                <h1>ReqWizards App</h1>
                <div className="flex-container">
                    <span onClick={irAMenuOrganizaciones}>Menú Principal /</span>
                    <span onClick={irAListaProyecto}>Mocar Company /</span>
                    <span onClick={irAMenuProyecto}>Sistema Inventario /</span>
                    <span>Acta</span>
                </div>
            </header>

            <div className="actasub-container">

                <aside className="sidebar">
                    {/*<div className="nav-button">
                            <button className="atras-button">Atras</button>
                            <button className="adelante-button">Adelante</button>
                        </div>*/}
                    <div className="bar-rp">
                        <p1 onClick={irAMenuOrganizaciones}>MENU PRINCIPAL</p1>
                    </div>

                    <div className="profile-section" >
                        <div className="profile-icon">👤</div>
                        <p2>Nombre Autor - Cod</p2>
                        <button onClick={irALogin}className="logout-button" >Cerrar Sesión</button>
                    </div>
                </aside>

                <main className="acta-content">
                    <h2>ACTA DE ACEPTACION</h2>
                    <span class="message">
                    <input
                        type="file"
                        accept=".jpg,.png,.jpeg,.pdf,.docx"
                        onChange={handleFileChange}
                        className="acta-button"
                    />
                    <span class="tooltip-text">Seleccionar archivo de acta de aceptación del proyecto</span>
                    </span>
                    <span>(.jpg .png .jpeg .pdf .docx)</span>
                     
                    <section className="acta-organization-section">
                        <h3>Informacion del Acta</h3>
                        {filePreview && (
                        <div className="file-preview">
                            {selectedFile.type.startsWith("image/") ? (
                                <img src={filePreview} alt="Preview" className="file-preview-img" />
                            ) : selectedFile.type === "application/pdf" ? (
                                <embed src={filePreview} type="application/pdf" className="file-preview-pdf" />
                            ) : (
                                <p>Vista previa no disponible</p>
                            )}
                        </div>
                    )}
    
                        <div className="acta-buttons">
                            <button onClick={handleSaveActa} className="acta-button" size="50">Guardar Acta</button>
                        </div>

                        <div className="search-section-bar">
                            <button onClick={irAMenuProyecto} className="atras-button">Regresar</button>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default ActaAceptacion;
