import React, { useState } from "react";
import { useNavigate, useLocation} from "react-router-dom";
import axios from "axios";
import '../styles/stylesActaAceptacion.css';
import '../styles/styles.css';

const ActaAceptacion= () => {

    const location = useLocation();
    const navigate = useNavigate();

    const [selectedFile, setSelectedFile] = useState(null);  // Para manejar el archivo cargado
    const [filePreview, setFilePreview] = useState(null);

    const irAMenuOrganizaciones = () => {
        navigate("/menuOrganizaciones");
    };
    const irAMenuProyecto = () => {
        navigate("/menuProyecto");
    };
    const irALogin = () => {
        navigate("/");
    };
    const irAListaProyecto = () => {
        navigate("/listaProyectos");
    };

    const queryParams = new URLSearchParams(location.search);
    const codigo = queryParams.get('code');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);

        // Previsualizar el archivo si es una imagen o PDF
        if (file) {
            const fileReader = new FileReader();
            fileReader.onloadend = () => {
                setFilePreview(fileReader.result);
            };
            fileReader.readAsDataURL(file);
        }
    };

    const handleSaveActa = async () => {
        if (!selectedFile) {
            alert("Por favor, selecciona un archivo.");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("actaceprocod", codigo);

        try {
            const response = await axios.post("http://localhost:5000/api/actas", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 201) {
                alert("Acta guardada con éxito");
                navigate("/menuProyecto");
            }
        } catch (error) {
            console.error("Error al guardar el acta:", error);
            alert("Hubo un error al guardar el acta.");
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
                    <input
                        type="file"
                        accept=".jpg,.png,.jpeg,.pdf,.docx"
                        onChange={handleFileChange}
                        className="acta-button"
                    />
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
