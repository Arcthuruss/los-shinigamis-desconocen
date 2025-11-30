from flask import Flask, request, Response, jsonify
# from flask_cors import CORS
from postgres import *
app = Flask(__name__)

@app.route('/')
def hello():
    return "Hello World!"

@app.route('/deces')
def get_deces():
    params = request.args

    # Liste des champs autorisés
    allowed_fields = {
        "id", "nom", "prenom", "sexe", "date_naissance",
        "lieu_naissance", "commune_naissance", "pays_naissance",
        "date_deces", "lieu_deces", "acte_deces", "age_deces"
    }

    # 1) Gestion des champs demandés dans SELECT
    if "fields" in params:
        requested = params["fields"].split(",")

        # On garde uniquement les champs valides
        selected_fields = [f for f in requested if f in allowed_fields]

        if not selected_fields:
            selected_fields = ["*"]  # fallback
    else:
        selected_fields = ["*"]

    select_clause = ", ".join(selected_fields)

    # 2) Construction du SQL avec filtres
    base_query = f"SELECT {select_clause} FROM le_deces.deces"

    conditions = []
    params_sql = {}

    if "sexe" in params:
        conditions.append("sexe = %(sexe)s")
        params_sql["sexe"] = params["sexe"]
    if "age_deces" in params:
        conditions.append("age_deces = %(age_deces)s")
        params_sql["age_deces"] = int(params["age_deces"])

    if "age_deces_min" in params:
        conditions.append("age_deces >= %(age_min)s")
        params_sql["age_min"] = int(params["age_deces_min"])

    if "age_deces_max" in params:
        conditions.append("age_deces <= %(age_max)s")
        params_sql["age_max"] = int(params["age_deces_max"])

    if "date_deces" in params:
        conditions.append("date_deces = %(date_deces)s")
        params_sql["date_deces"] = params["date_deces"]

    if "date_deces_start" in params:
        conditions.append("date_deces >= %(dstart)s")
        params_sql["dstart"] = params["date_deces_start"]

    if "date_deces_end" in params:
        conditions.append("date_deces <= %(dend)s")
        params_sql["dend"] = params["date_deces_end"]
        
    if "date_naissance" in params:
        conditions.append("date_naissance = %(date_naissance)s")
        params_sql["date_naissance"] = params["date_naissance"]
        
    if "date_naissance_start" in params:
        conditions.append("date_naissance >= %(dnstart)s")
        params_sql["dnstart"] = params["date_naissance_start"]

    if "date_naissance_end" in params:
        conditions.append("date_naissance <= %(dnend)s")
        params_sql["dnend"] = params["date_naissance_end"]

    if "lieu_naissance" in params:
        conditions.append("LOWER(lieu_naissance) LIKE %(lieu_n)s")
        params_sql["lieu_n"] = f"%{params['lieu_naissance'].lower()}%"
    
    if "commune_naissance" in params:
        conditions.append("LOWER(commune_naissance) LIKE %(commune_n)s")
        params_sql["commune_n"] = f"%{params['commune_naissance'].lower()}%"
    
    if "pays_naissance" in params:
        conditions.append("LOWER(pays_naissance) LIKE %(pays_n)s")
        params_sql["pays_n"] = f"%{params['pays_naissance'].lower()}%"

    if "lieu_deces" in params:
        conditions.append("LOWER(lieu_deces) LIKE %(lieu_d)s")
        params_sql["lieu_d"] = f"%{params['lieu_deces'].lower()}%"
    
    if "nom" in params:
        conditions.append("LOWER(nom) LIKE %(nom)s")
        params_sql["nom"] = f"%{params['nom'].lower()}%"
        
    if "prenom" in params:
        conditions.append("LOWER(prenom) LIKE %(prenom)s")
        params_sql["prenom"] = f"%{params['prenom'].lower()}%"
    
    if "annee_deces" in params:
        conditions.append("EXTRACT(YEAR FROM date_deces) = %(annee_deces)s")
        params_sql["annee_deces"] = int(params["annee_deces"])
    
    if "mois_deces" in params:
        conditions.append("EXTRACT(MONTH FROM date_deces) = %(mois_deces)s")
        params_sql["mois_deces"] = int(params["mois_deces"])
    
    if "jour_deces" in params:
        conditions.append("EXTRACT(DAY FROM date_deces) = %(jour_deces)s")
        params_sql["jour_deces"] = int(params["jour_deces"])

    if conditions:
        final_query = base_query + " WHERE " + " AND ".join(conditions)
    else:
        final_query = base_query

    rows = run_sql(final_query, params_sql)

    response = jsonify(rows)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/deces_par_mois/<annee>')
def deces_par_mois(annee) :
    params_sql = {}

    if annee == "all" :
        final_query = "select extract(year from date_deces) as key, count(*) as data from le_deces.deces where extract(year from date_deces) >= 1970 group by extract(year from date_deces);"
    else :
        final_query = "select extract(month from date_deces) as key, count(*) as data from le_deces.deces where extract(year from date_deces) = %(annee_deces)s group by extract(month from date_deces);"
        params_sql["annee_deces"] = annee

    rows = run_sql(final_query, params_sql)

    response = jsonify(rows)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/deces_par_annee/<mois>')
def get_year(mois) :
    params_sql = {}

    if mois != "all" :
        final_query = "select extract(year from date_deces) as key, count(*) as data from le_deces.deces where extract(month from date_deces) = %(mois_deces)s and extract(year from date_deces) >= 1970 group by extract(year from date_deces);"
        params_sql["mois_deces"] = mois
    else :
        final_query = "select extract(month from date_deces) as key, count(*) as data from le_deces.deces group by extract(month from date_deces);"

    rows = run_sql(final_query, params_sql)

    response = jsonify(rows)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
