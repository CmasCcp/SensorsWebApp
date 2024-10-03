import React from 'react';
import { ThreeDImage } from './ThreeDImage';
export const ItemBlog = ({ info = { name: "", description: "" }, imgPath = "", imgWidth = "50px", imgDirection = "right", imgVertical = false, bg = "customprimary", text = "white", bottomWaveColor = "light", threeD = false }) => {
    // TODO: CENTRALIZAR LOS CUSTOM COLORS EN UN SOLO LUGAR
    const customColors = {
        light: "#d7d7d9",
        customprimary: "#1D355D",
        success: " #3EDC85",
        dos: "#261501",
        warning: "#0075a2",
        customdark: " #010700",
        danger: " #010700",
    };
    const description = info.description.split("<br/>");
    return (<>
            <div className={`row m-0 p-0 col-md-12 text-${text} bg-${bg}`}>
                <div className="d-flex flex-row col-md-12 flex-wrap-reverse pt-3 p-0 m-0">

                <div className={`col-12 col-sm-5 col-lg-8 col-md-5 px-5 my-0 text-${imgDirection === "left" ? "center" : "left"}`} style={{ "marginLeft": imgDirection === "left" ? "auto" : "0" }}>
                    <h5 className={`m-0 pb-2 fw-bold `}>{info.name}</h5>
                    <br />

                    <p className='text-justify'>{description.map(parrafo => (<>&nbsp;{parrafo}<br /></>))}</p>
                </div>
                {/* TODO: EN PRODUCCION SE DEBE CAMBIAR LA RUTA*/}
                <div className="col-12">
                    {(!threeD)
            ?
                <img id="item-blog-img" className='
                            col-sm-12 col-md-6 animate__animated animate__slideInDown rounded img-fluid
                        ' style={{
                        "position": "absolute", [imgDirection]: "0px", "top": `${imgVertical ? "-100px" : "0px"}`, "width": `${imgVertical ? "250px" : imgWidth}`,
                    }} src={imgPath}/>
            :
                <div id="item-blog-img" className='col-sm-12 col-lg-4 col-md-5 mr-auto' style={{
                        "position": "absolute", [imgDirection]: "0px", "top": `${imgVertical ? "-40px" : "0px"}`, "width": `${imgVertical ? "250px" : imgWidth}`,
                    }}>
                            <ThreeDImage imgPath={imgPath}/>
                        </div>}
                </div>
                </div>
                
                {(imgDirection === "right")
            ? (<svg className='p-0 m-0' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                              <path fill={`${customColors[bottomWaveColor]}`} fillOpacity="1" d="M0,160L60,176C120,192,240,224,360,208C480,192,600,128,720,90.7C840,53,960,43,1080,53.3C1200,64,1320,96,1380,112L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z">
                              </path>
                          </svg>)
            :
                (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill={`${customColors[bottomWaveColor]}`} fillOpacity="1" d="M0,192L80,208C160,224,320,256,480,266.7C640,277,800,267,960,266.7C1120,267,1280,277,1360,282.7L1440,288L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path></svg>)}
                
            </div>
        </>);
};
