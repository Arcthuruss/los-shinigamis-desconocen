# Script qui va parcourir tout les csv et upload leur contenu dans la base de données
import os
import csv
import psycopg2
import re

def import_csv_to_db(cursor, csv_file_path):
    with open(csv_file_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile, delimiter=';')
        for row in reader:
            # exemple de ce qui se trouve dans le csv TRIPIER*NICOLE/ du coup on le modifie
            nom = row['nomprenom'].split('*')[0]
            prenom = row['nomprenom'].split('*')[1]
            prenom = prenom.replace('/', '') 
            
            # exemple date : 20250318 -> on le convertit en format date postgresql DD-MM-YYYY
            
            date_deces = row['datedeces']
            date_naissance = row['datenaiss']
            if date_naissance[6:8] == '00' :
                date_naissance = date_naissance[:6] + '01'
            if date_naissance[4:6] == '00' :
                date_naissance = date_naissance[:4] + '01' + date_naissance[6:8]
            if date_deces[6:8] == '00' :
                date_deces = date_deces[:6] + '01'
            if date_deces[4:6] == '00' :
                date_deces = date_deces[:4] + '01' + date_deces[6:8]
                
            # Si 29 février alors que l'année de le contient pas alors faire -1
            if date_naissance[4:6] == '02' and date_naissance[6:8] == '29' :
                year = int(date_naissance[0:4])
                if (year % 4 != 0) or (year % 100 == 0 and year % 400 != 0):
                    date_naissance = date_naissance[:6] + '28'
                                        
            if date_deces[4:6] == '02' and date_deces[6:8] == '29' :
                year = int(date_deces[0:4])
                if (year % 4 != 0) or (year % 100 == 0 and year % 400 != 0):
                    date_deces = date_deces[:6] + '28'
                
            if date_naissance[0:4] == '0000' :
                # On récupère l'année dans le nom du fichier
                m = re.search(r'(\d{4})', os.path.basename(csv_file_path))
                year_from_filename = m.group(1) if m else ''
                date_naissance = year_from_filename + date_naissance[4:6] + date_naissance[6:8]
            if date_deces[0:4] == '0000' :
                # On récupère l'année dans le nom du fichier
                m = re.search(r'(\d{4})', os.path.basename(csv_file_path))
                year_from_filename = m.group(1) if m else ''
                date_deces = year_from_filename + date_deces[4:6] + date_deces[6:8]
            
            date_naissance = f"{date_naissance[6:8]}-{date_naissance[4:6]}-{date_naissance[0:4]}"
            date_deces = f"{date_deces[6:8]}-{date_deces[4:6]}-{date_deces[0:4]}"
            
            cursor.execute("""
                INSERT INTO le_deces.deces (nom, prenom, sexe, date_naissance, lieu_naissance, commune_naissance, pays_naissance, date_deces, lieu_deces, acte_deces)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
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
            ))
            
def main():
    # Connexion à la base de données
    conn = psycopg2.connect(
        dbname="shinigami_db",
        user="shinigami",
        password="shinigami_password",
        host="localhost",
        port="5432"
    )
    cursor = conn.cursor()
    
    # Parcourir tous les fichiers CSV dans le dossier 'data'
    data_folder = 'dataset'
    for filename in os.listdir(data_folder):
        if filename.endswith('.csv'):
            csv_file_path = os.path.join(data_folder, filename)
            import_csv_to_db(cursor, csv_file_path)
            print(f"Importé : {filename}")
    
    conn.commit()
    cursor.close()
    conn.close()
    
if __name__ == "__main__":
    main()