import psycopg2

def connection_db():
    return psycopg2.connect(
        dbname="shinigami_db",
        user="shinigami",
        password="shinigami_password",
        host="localhost",
        port="5432"
    )
