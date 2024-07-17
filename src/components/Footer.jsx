
export const Footer = () => {
    return (
        <div style={{"minHeight":"270px"}} className="overflow-hidden px-5 m-0 w-100 row justify-content-around align-items-center bg-customprimary text-light">

            <div className="d-flex mt-3 overflow-hidden flex-column justify-content-start align-items-center m-0" style={{"maxWidth": "200px"}}>
                <img height="20" className='my-3' src='https://centrodeinvestigacioningenieria.udd.cl/wp-content/uploads/2021/09/logo-udd-blanco.png'/>
                <img style={{"maxHeight": "50px", "maxWidth": "200px"}} className="mx-auto" src="https://centrodeinvestigacioningenieria.udd.cl/wp-content/uploads/2021/09/logo-acreditacion-blanco-300x86.png"/>

            </div>


            <div className="container mt-auto p-5 col-md-4 d-flex flex-column justify-content-start align-items-center text-center">
                {/* <?php if(!empty($info->email)||!empty($info->fono)):?> */}

                {/* <h5 className="text-center">Datos de contacto</h5> */}
                

                <h3>Sede Concepción</h3>
                <p>Ainavillo 456, Concepción</p>
                <p>(+56-41) 226 8610</p>

                    {/* <?php if(!empty($info->fono)):?> */}
                    {/* <?php echo $info->fono."<br>";?> */}
                        {/* <?php endif;?> */}
                        {/* <?php if(!empty($info->email)):?>
                        <?php echo $info->email."<br>";?>
                            <?php endif;?> */}
                

                        
                        
                        {/* <h5 className="text-center">Redes Sociales</h5> */}
                        <div className="d-flex row mt-2">
                            {/* <!-- facebook --> */}
                            {/* <a target="_blank" className="bg-white text-customprimary mx-1 icon-fab-light rounded-circle text-center" href="<?php echo $info->facebook;?>">
                                <span className=""><i className="fab fa-facebook"></i></span>
                            </a> */}


                            {/* <a target="_blank" className="bg-danger mx-1 icon-fab-light rounded-circle text-center" href="<?php echo $info->youtube;?>&text=Hola, quiero hacer mi pedido.">
                                <span className=""><i className="fab fa-whatsapp"></i></span>
                            </a> */}

                            {/* <a target="_blank" className="bg-white text-customprimary mx-1 icon-fab-light rounded-circle text-center" href="<?php echo $info->instagram;?>">
                                <span className=""><i className="fab fa-instagram"></i></span>
                            </a> */}
                        </div>
                        {/* <?php endif;?> */}

            </div>
            <div className="col-md-4 d-flex flex-column">
            <p className="mx-auto pt-5  text-center justify-self-end"><small>&copy; 
                { new Date().getFullYear() }
                &nbsp;
                <a href="#" className="text-white">Desarrollado por DK</a></small></p>
            </div>
        </div>
    )
}
