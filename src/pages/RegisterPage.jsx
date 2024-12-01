import { useMsal } from '@azure/msal-react';
import { useState } from 'react';
import Select from 'react-select';

export const RegisterPage = () => {
  const { accounts } = useMsal();
  const username = accounts[0] && accounts[0].username;

  const projectOptions = [
    { value: 'Proyecto 1', label: 'Proyecto 1' },
    { value: 'Proyecto 2', label: 'Proyecto 2' },
    { value: 'Proyecto 3', label: 'Proyecto 3' },
  ];

  const filterOptions = ['Dispositivo 1', 'Dispositivo 2', 'Dispositivo 3'];

  const tableData = {
    'Dispositivo 1': [
      { id: 1, name: 'Item 1', description: 'Descripción 1' },
      { id: 2, name: 'Item 2', description: 'Descripción 2' },
    ],
    'Dispositivo 2': [
      { id: 3, name: 'Item 3', description: 'Descripción 3' },
      { id: 4, name: 'Item 4', description: 'Descripción 4' },
    ],
    'Dispositivo 3': [
      { id: 5, name: 'Item 5', description: 'Descripción 5' },
      { id: 6, name: 'Item 6', description: 'Descripción 6' },
    ],
  };

  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState(null);

  const handleProjectChange = (selectedOption) => {
    setSelectedProject(selectedOption);
    setSelectedFilter(null); // Reset filter when project changes
  };

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter);
  };

  const customStyles = {
    container: (provided) => ({
      ...provided,
      width: '300px',
      zIndex: 3, // Ensure dropdown is on top

    }),
    menu: (provided) => ({
      ...provided,
      width: '300px',
      zIndex: 5, // Ensure dropdown is on top

    }),
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center">
      <div className="card w-100">
        <h2 className="card-title">Dispositivos</h2>
        <div className="card-content">
          {username && (
            <div>
              <p>Utilice esta página para gestionar sus sensores y dispositivos.</p>
              <div className="dropdown mb-4">
                <Select
                  id="project-select"
                  options={projectOptions}
                  onChange={handleProjectChange}
                  value={selectedProject}
                  placeholder="Seleccione un proyecto"
                  className="mt-2"
                  styles={customStyles}
                />
              </div>
              <div className="row">
                {/* Left Column: Filters */}
                <div className="col-2">
                  <h5>Dispositivos</h5>
                  <ul className="list-group">
                    {filterOptions.map((filter) => (
                      <li
                        key={filter}
                        className={`list-group-item ${
                          filter === selectedFilter ? 'active' : ''
                        }`}
                        onClick={() => handleFilterClick(filter)}
                        style={{ cursor: 'pointer' }}
                      >
                        {filter}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Right Column: Data Table */}
                <div className="col-10">
                  <h5>Sensores</h5>
                  {selectedFilter ? (
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Nombre</th>
                          <th>Descripción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableData[selectedFilter]?.map((row) => (
                          <tr key={row.id}>
                            <td>{row.id}</td>
                            <td>{row.name}</td>
                            <td>{row.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>Seleccione un filtro para ver los datos.</p>
                  )}
                </div>
              </div>
            </div>
          )}
          {!username && (
            <>
              <h2>Acceso Restringido</h2>
              <p>Para ver este contenido, es necesario que inicies sesión.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
