CREATE SCHEMA le_deces;

-- postgresql
-- "nomprenom";"sexe";"datenaiss";"lieunaiss";"commnaiss";"paysnaiss";"datedeces";"lieudeces";"actedeces"

CREATE TABLE le_deces.deces (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100),
    prenom VARCHAR(100),
    -- '1' pour masculin, '2' pour féminin
    sexe CHAR(1),
    date_naissance DATE,
    lieu_naissance VARCHAR(100),
    commune_naissance VARCHAR(100),
    pays_naissance VARCHAR(100),
    date_deces DATE,
    lieu_deces VARCHAR(100),
    acte_deces VARCHAR(100)
);

ALTER DATABASE shinigami_db SET datestyle TO 'ISO, DMY';
ALTER ROLE shinigami SET datestyle TO 'ISO, DMY';

