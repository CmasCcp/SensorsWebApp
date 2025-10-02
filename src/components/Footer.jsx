
export const Footer = () => {
    const year = new Date().getFullYear();
    return (
        <footer className="footer">
            <p>©{year} Centro de investigación en tecnologías para la sociedad (C+).</p>
            <p>Todos los derechos reservados.</p>
      </footer>
    )
}
