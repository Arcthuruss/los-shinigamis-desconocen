CREATE SCHEMA IF NOT EXISTS le_deces;

DROP TABLE IF EXISTS le_deces.deces;

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
    acte_deces VARCHAR(100),
    age_deces INT
);

-- trigger pour calculer l'âge au moment du décès
CREATE OR REPLACE FUNCTION calculer_age_deces()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.date_deces IS NOT NULL AND NEW.date_naissance IS NOT NULL THEN
        NEW.age_deces := DATE_PART('year', AGE(NEW.date_deces, NEW.date_naissance));
    ELSE
        NEW.age_deces := NULL;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_calculer_age_deces
BEFORE INSERT OR UPDATE ON le_deces.deces
FOR EACH ROW
EXECUTE FUNCTION calculer_age_deces();

-- réglages de format de date
ALTER DATABASE shinigami_db SET datestyle TO 'ISO, DMY';
ALTER ROLE shinigami SET datestyle TO 'ISO, DMY';

