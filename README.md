# los-shinigamis-desconocen

Pour lancer le projet, il faut d'abord aller dans le dossier dashboard.
Puis lancer les commandes suivantes :

Pour ubuntu et debian :
```bash
# Download and install nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

# in lieu of restarting the shell
\. "$HOME/.nvm/nvm.sh"

# Download and install Node.js:
nvm install 24

# Verify the Node.js version:
node -v # Should print "v24.11.1".

# Verify npm version:
npm -v # Should print "11.6.2".

# Se mettre sur nvm
nvm use

# Installer les dépendances
npm i
```

Lancer le docker compose up, **ATTENTION si postgresql est déjà lancé sur votre machine, il faut l'arrêter avant de lancer cette commande** :
```bash
docker compose build
docker compose up -d
```

Crée l'environnement python et installe les dépendances :
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Revenir au dossier précédent, lancer le script python ETL.py :
```bash
python3 ETL.py
```

Attendre la fin du script.
Maintenant on peut ouvrir le dashboard dans votre navigateur à l'adresse :
[http://localhost:5173/](http://localhost:5173/)

## Script important
- ETL.py : Script nettoie les csv et les insère dans la base de données postgresql.

- bdd.sql : Script de création de la base de données postgresql.

- dashboard/ : Dossier contenant le dashboard en ReactJS.

- docker-compose.yml : Fichier de configuration docker pour lancer postgresql, de flask pour l'api et de node pour le dashboard.

- dataset/ : Dossier contenant les datasets csv.

- api/*.py : Fichiers de l'api en flask et de connexion à la base de données. 