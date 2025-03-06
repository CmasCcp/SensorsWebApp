import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export const BasicDataTableGraphic = ({ data }) => {
    const { data: schemaData } = useFetch(`${import.meta.env.VITE_API_URL}/schema?tabla=${tableName}`);
    if (!data || data.length === 0) {
        return <p className="text-center">No hay datos disponibles.</p>;
    }

    const headers = Object.keys(data[0]);

    return (
        <>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        {/* <th>Nombre</th> */}
                        {/* <th>Descripción</th> */}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row) => (
                        <tr key={row.id_dato}>
                            <td>{row.id_dato}</td>
                            {/* <td>{row.name}</td> */}
                            <td>{row.description}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Pagination>
                <Pagination.Prev onClick={() => setPage(page - 1)} disabled={page === 1} />
                <Pagination.Item active>{page}</Pagination.Item>
                <Pagination.Next onClick={() => setPage(page + 1)} />
            </Pagination>
        </>
    );
};

