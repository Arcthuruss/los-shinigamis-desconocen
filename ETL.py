import os
import csv
import psycopg2
import psycopg2.extras
import re
import calendar
from multiprocessing import Pool, cpu_count

BATCH_SIZE = 5000

def traiter_ligne(row, csv_file_path):
    # Traitement nom/prenom
    if '*' not in row['nomprenom']:
        prenom = row['nomprenom'].replace('/', '')
        nom = ''
    elif row['nomprenom'].endswith('*/'):
        nom = row['nomprenom'].split('*')[0]
        prenom = ''
    else:
        parts = row['nomprenom'].split('*')
        nom = parts[0]
        prenom = parts[1].replace('/', '')

    # Traitement dates
    def corriger(date_raw):
        try:
            # Remplacement 00 → 01 pour jour et mois
            if date_raw[6:8] == '00' or date_raw[6:8] == '':
                date_raw = date_raw[:6] + '01'
            if date_raw[4:6] == '00' or date_raw[4:6] == '':
                date_raw = date_raw[:4] + '01' + date_raw[6:8]

            # 29 février invalide
            if date_raw[4:6] == '02' and date_raw[6:8] == '29':
                year = int(date_raw[0:4])
                if (year % 4 != 0) or (year % 100 == 0 and year % 400 != 0):
                    date_raw = date_raw[:6] + '28'

            # Année 0000 = récupérer depuis le nom fichier
            if date_raw.startswith("0000"):
                m = re.search(r"(\d{4})", os.path.basename(csv_file_path))
                year = m.group(1) if m else "1900"
                date_raw = year + date_raw[4:]
            
            # Normalisation
            year = int(date_raw[0:4])
            month = int(date_raw[4:6])
            
            # Test des mois pour être en 1 et 12
            if month < 1:
                month = 1
            if month > 12:
                month = 12
            date_raw = date_raw[:4] + f"{month:02d}" + date_raw[6:8]

            # Vérifie que le jour est 1 min
            day = int(date_raw[6:8])
            if day < 1:
                day = 1
                date_raw = date_raw[:6] + f"{day:02d}"

            # Vérifie si le jour existe pour le mois et l'année
            _, max_day = calendar.monthrange(year, month)
            if day > max_day:
                date_raw = date_raw[:6] + f"{max_day:02d}"

            return f"{date_raw[6:8]}-{date_raw[4:6]}-{date_raw[0:4]}"
        except Exception:
            print(f"[ERREUR] date invalide {date_raw} dans le fichier {csv_file_path}")
            return None

    date_naissance = corriger(row["datenaiss"])
    date_deces = corriger(row["datedeces"])

    return (
        nom,
        prenom,
        row['sexe'],
        date_naissance,
        row['lieunaiss'],
        row['commnaiss'],
        row['paysnaiss'],
        date_deces,
        row['lieudeces'],
        row['actedeces']
    )


# Fonction exécutée en parallèle
def traiter_csv(csv_file_path):
    try:
        print(f"[PID {os.getpid()}] -> Import de {os.path.basename(csv_file_path)}")

        conn = psycopg2.connect(
            dbname="shinigami_db",
            user="shinigami",
            password="shinigami_password",
            host="localhost",
            port="5432"
        )
        cursor = conn.cursor()

        batch = []

        with open(csv_file_path, newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile, delimiter=';')

            for row in reader:
                # skip si aucune date de décès ou de naissance
                if not row['datedeces'].strip() or not row['datenaiss'].strip():
                    continue
                
                batch.append(traiter_ligne(row, csv_file_path))

                if len(batch) >= BATCH_SIZE:
                    psycopg2.extras.execute_values(cursor, """
                        INSERT INTO le_deces.deces
                        (nom, prenom, sexe, date_naissance, lieu_naissance, commune_naissance,
                        pays_naissance, date_deces, lieu_deces, acte_deces)
                        VALUES %s
                    """, batch)
                    batch = []

        # Dernier batch
        if batch:
            psycopg2.extras.execute_values(cursor, """
                INSERT INTO le_deces.deces
                (nom, prenom, sexe, date_naissance, lieu_naissance, commune_naissance,
                pays_naissance, date_deces, lieu_deces, acte_deces)
                VALUES %s
            """, batch)

        conn.commit()
        cursor.close()
        conn.close()

        print(f"[PID {os.getpid()}] -> Import terminé : {os.path.basename(csv_file_path)}")

    except Exception as e:
        print(f"[ERREUR] fichier {csv_file_path} -> {e}")


# Multiprocessing
def main():
    data_folder = "dataset"
    
    fichiers = [
        os.path.join(data_folder, f)
        for f in os.listdir(data_folder)
        if f.endswith(".csv")
    ]    

    # Nombre de processus = nombre de CPU - 1
    nb_workers = max(1, cpu_count() - 1)
    print(f"Lancement avec {nb_workers} workers en parallèle")

    with Pool(processes=nb_workers) as pool:
        pool.map(traiter_csv, fichiers)
        
    # Supprime tout les doublons dans la table après l'import
    try:
        print("Suppression des doublons en cours...")
        
        conn = psycopg2.connect(
            dbname="shinigami_db",
            user="shinigami",
            password="shinigami_password",
            host="localhost",
            port="5432"
        )
        cursor = conn.cursor()
        cursor.execute("""
            DELETE FROM le_deces.deces a
            USING le_deces.deces b
            WHERE a.ctid < b.ctid
            AND a.nom = b.nom
            AND a.prenom = b.prenom
            AND a.date_naissance = b.date_naissance
            AND a.date_deces = b.date_deces
            AND a.lieu_deces = b.lieu_deces
            AND a.acte_deces = b.acte_deces
            AND a.sexe = b.sexe
            AND a.lieu_naissance = b.lieu_naissance
            AND a.commune_naissance = b.commune_naissance
            AND a.pays_naissance = b.pays_naissance;
        """)
        conn.commit()
        cursor.close()
        conn.close()
        print("Suppression des doublons terminée.")
        
        conn = psycopg2.connect(
            dbname="shinigami_db",
            user="shinigami",
            password="shinigami_password",
            host="localhost",
            port="5432"
        )
        cursor = conn.cursor()
        
        # On supprime les données avec des dates impossibles et qui ont u age_deces supérieur à 120 ans
        cursor.execute("""
            DELETE FROM le_deces.deces
            WHERE date_naissance < '1800-01-01'
            AND age_deces > 120;
        """)
        conn.commit()
        cursor.close()
        conn.close()
        print("Suppresion terminée.")
        
    except Exception as e:
        print(f"[ERREUR] lors de la suppression des doublons → {e}")


if __name__ == "__main__":
    main()
