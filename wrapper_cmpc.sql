INSERT INTO Datos (idSensor, valorMedicion, FechaMedicion)
SELECT
    CASE
        WHEN stationid = 1 THEN 1
        WHEN stationid = 2 THEN 5
        WHEN stationid = 3 THEN 9
        WHEN stationid = 4 THEN 13
        WHEN stationid = 5 THEN 17
        WHEN stationid = 6 THEN 21
    END AS idSensor,
    ph_avg AS valorMedicion,
    `timestamp` AS FechaMedicion
FROM proyectos.cmpc
WHERE `timestamp` >= '2024-10-22 00:00:00';

INSERT INTO Datos (idSensor, valorMedicion, FechaMedicion)
SELECT
    CASE
        WHEN stationid = 1 THEN 2
        WHEN stationid = 2 THEN 6
        WHEN stationid = 3 THEN 10
        WHEN stationid = 4 THEN 14
        WHEN stationid = 5 THEN 18
        WHEN stationid = 6 THEN 22
    END AS idSensor,
    ec_avg AS valorMedicion,
    `timestamp` AS FechaMedicion
FROM proyectos.cmpc
WHERE `timestamp` >= '2024-10-22 00:00:00';

INSERT INTO Datos (idSensor, valorMedicion, FechaMedicion)
SELECT
    CASE
        WHEN stationid = 1 THEN 3
        WHEN stationid = 2 THEN 7
        WHEN stationid = 3 THEN 11
        WHEN stationid = 4 THEN 15
        WHEN stationid = 5 THEN 19
        WHEN stationid = 6 THEN 23
    END AS idSensor,
    temp_avg AS valorMedicion,
    `timestamp` AS FechaMedicion
FROM proyectos.cmpc
WHERE `timestamp` >= '2024-10-22 00:00:00';

INSERT INTO Datos (idSensor, valorMedicion, FechaMedicion)
SELECT
    CASE
        WHEN stationid = 1 THEN 4
        WHEN stationid = 2 THEN 8
        WHEN stationid = 3 THEN 12
        WHEN stationid = 4 THEN 16
        WHEN stationid = 5 THEN 20
        WHEN stationid = 6 THEN 24
    END AS idSensor,
    battery AS valorMedicion,
    `timestamp` AS FechaMedicion
FROM proyectos.cmpc
WHERE `timestamp` >= '2024-10-22 00:00:00';