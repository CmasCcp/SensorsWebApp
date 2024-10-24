import React from 'react'
import { ItemBlog } from '../components/ItemBlog'

export const Blog = () => {
    return (
        <>

            <div className='bg-customprimary inner-shadow text-white container-fluid p-0 pt-5 m-0'>

                <h3 className='text-center text-customsuccess py-5'>
                    Proyectos en desarrollo
                </h3>
                <div className="row justify-content-center mb-5">
                    {/* <iframe className='mx-auto' height={"300px"} width="600" src="
                https://uddcl-my.sharepoint.com/personal/factoriaccp_udd_cl/_layouts/15/embed.aspx?UniqueId=f291e65b-9713-4759-b2ff-a58d346b5215&embed=%7B%22ust%22%3Atrue%2C%22hv%22%3A%22CopyEmbedCode%22%7D&referrer=StreamWebApp&referrerScenario=EmbedDialog.Create
                "  frameborder="0" scrolling="no" allowfullscreen title="arm_ProyectosFIC Salud_02.mp4"></iframe> */}
                    <iframe src="https://uddcl-my.sharepoint.com/personal/factoriaccp_udd_cl/_layouts/15/embed.aspx?UniqueId=f291e65b-9713-4759-b2ff-a58d346b5215&nav=%7B%22playbackOptions%22%3A%7B%22startTimeInSeconds%22%3A0%7D%7D&embed=%7B%22af%22%3Atrue%2C%22hvm%22%3Atrue%2C%22ust%22%3Atrue%7D&referrer=StreamWebApp&referrerScenario=EmbedDialog.Create" width="640" height="360" frameborder="0" scrolling="no" allowfullscreen title="arm_ProyectosFIC Salud_02.mp4"></iframe>
                    {/* <iframe src="https://uddcl-my.sharepoint.com/personal/factoriaccp_udd_cl/_layouts/15/embed.aspx?UniqueId=f291e65b-9713-4759-b2ff-a58d346b5215&nav=%7B%22playbackOptions%22%3A%7B%22startTimeInSeconds%22%3A0%7D%7D&embed=%7B%22af%22%3Atrue%2C%22ust%22%3Atrue%7D&referrer=StreamWebApp&referrerScenario=EmbedDialog.Create" width="640" height="360" frameborder="0" scrolling="no" allowfullscreen title="arm_ProyectosFIC Salud_02.mp4"></iframe> */}
                </div>

                <ItemBlog
                    info={{ name: "Dispensador de pastillas", description: "La solución propuesta es un dispensador electrónico y sensorizado que se puede programar a través de una aplicación móvil. El dispositivo cuenta con un indicador de dosis con luces, programación de alarmas audibles y una pantalla para visualizar la información. También tiene la capacidad de monitorear la apertura y cierre del dispositivo. La solución garantiza la entrega correcta de la dosis de medicamentos requeridos por el usuario. Además, el dispensador cuenta con un almacenamiento seguro para al menos 8 semanas de uso continuo. En resumen, el dispensador electrónico y sensorizado es una solución integral que asegura la entrega correcta y oportuna de los medicamentos, proporcionando tranquilidad y autonomía a los usuarios con problemas de autonomía y polimedicados. <br/> La gestión y configuración del dispositivo será mediante una aplicación móvil programable, siendo una forma de guardar información respecto al uso de la herramienta en base la prescripción médica, logrando dosificar y de esta forma, facilitar el consumo de medicamentos, en conjunto con un sistema que entrega información sobre el estado de las dosis (cantidad, dias de duracion, receta, etc.). <br/> Cabe mencionar que en el funcionamiento del dispositivo, primero , se definen y organizan  paquetes de  medicamentos por horarios (pudiendo ser 1 o más) por parte del cuidador o profesional de salud;  y  posteriormente estos se dosifican tanto en el dispositivo como en la app,  según la posología prescrita por el médico. " }}
                    threeD={true}
                    imgDirection="right" imgPath="/models/dispensador 1.glb" imgWidth="350px" bg="customprimary" text="white" bottomWaveColor="light"
                />
                <ItemBlog
                    info={{ name: "Pastillero", description: "La solución propuesta es un pastillero electrónico innovador y personalizable que se integra con una aplicación móvil. El pastillero cuenta con un indicador de dosis que utiliza luces para indicar la hora y la cantidad de medicamento que debe tomarse. También incluye una programación de alarmas audibles y una pantalla para facilitar la visualización de las instrucciones. Además, el pastillero cuenta con un sistema de monitoreo y detección de apertura y cierre, lo que garantiza que los medicamentos se tomen correctamente y que el almacenamiento de los comprimidos sea seguro. Con una capacidad de almacenamiento para 4 semanas de uso para las personas mayores que necesitan un recordatorio eficiente y fácil de seguir para tomar sus medicamentos diarios." }}
                    imgDirection="left" imgPath="/blog/pastillero.png" imgWidth="350px" bg="light" text="customprimary" bottomWaveColor="customprimary"
                />

                <ItemBlog
                    info={{ name: "Geolocalizador", description: `Geolocalizador wearable diseñado específicamente para adultos mayores con dificultades en la memoria y la ubicación espacial. Este dispositivo portátil, en forma de reloj, prendedor u otro, estará equipado con tecnología de geolocalización precisa mediante GPS con algún grado de autonomía para su portabilidad. Además, contará con funciones de alerta y emergencia que permitirán al usuario notificar rápidamente a sus contactos de confianza en caso de peligro o necesidad de ayuda, esto configurado mediante una App. <br/> La solución se caracteriza por su autonomía, ya que el dispositivo estará conectado directamente a la geolocalización, eliminando la dependencia de otros dispositivos o infraestructuras externas. Además, se enfoca en la facilidad de uso y comodidad del usuario, al ser un dispositivo wearable compacto y de diseño ergonómico. <br/> El geolocalizador mejorará la seguridad y tranquilidad tanto de los adultos mayores como de sus familias, al proporcionar una solución confiable para su localización y asistencia en casos de emergencia. Esta solución tecnológica asequible y eficiente permitirá una mayor autonomía para los adultos mayores y una respuesta más rápida por parte de los cuidadores y la comunidad en situaciones de extravío o riesgo y considerando los resguardos éticos en la prescripción de este procedimiento por parte del equipo de salud.` }}
                    imgDirection="right" imgPath="/blog/gps.png" imgWidth="350px" bg="customprimary" text="white" bottomWaveColor="light"
                />
                <ItemBlog
                    info={{ name: "Atril plegable", description: "Debido a la incomodidad al momento de transportar el atril o porta suero al domicilio del paciente por su tamaño y peso, se ha propuesto la fabricación de un atril desarmable/plegable para uso de atencion domiciliaria (poco espacio para llevar atril convencional) <br/> Esta problemática se asocia con las personas de la tercera edad en la necesidad de realizarse una tranfusion de sangre o medicamento intravenoso en su domicilio. <br/> Está compuesto de piezas ensambladas por imantación, mejora la facilidad de transporte y uso al momento de su transporte al domicilio." }}
                    imgVertical={true}
                    threeD={true}
                    imgDirection="left" imgPath="/models/Atril DF 19-06-2023.glb" imgWidth="350px" bg="light" text="customprimary" bottomWaveColor="customprimary"
                />
                <ItemBlog
                    info={{ name: "Seguimiento de bacterias", description: "El crecimiento bacteriano en tejido humano se utiliza en pruebas médicas para identificar la presencia de infecciones bacterianas. <br/> Para ello, el personal médico necesita revisar constantemente las incubadoras cada vez que se realizan estudios de bacterias en pacientes. <br/>Como solución se propone instalar una cámara dentro de la incubadora, monitoriando en tiempo real para detectar el tiempo exacto en que empieza a crecer." }}
                    imgDirection="right"
                    imgPath="/blog/bacteria-removebg-preview.png" imgWidth="350px" bg="customprimary" text="white" bottomWaveColor="customprimary"
                />

            </div>

        </>
    )
}
