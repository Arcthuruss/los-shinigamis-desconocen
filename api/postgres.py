import psycopg2
import psycopg2.extras

def connection_db():
    return psycopg2.connect(
        dbname="shinigami_db",
        user="shinigami",
        password="shinigami_password",
        host="db",
        port="5432"
    )

def run_sql(query, params=None):
    conn = connection_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(query, params)
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return rows
