import React from 'react';
import useFetch from '../../hooks/useFetch'; // Asegúrate de especificar la ruta correcta del hook

const MyComponent = ({data, loading, error}) => {
  // const { data, loading, error } = useFetch('https://jsonplaceholder.typicode.com/users');

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      {data && (
        <ul>
          {data.map(item => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyComponent;
