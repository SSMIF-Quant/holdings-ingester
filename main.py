from flask import Flask

# Contains endpoints

app = Flask(__name__)

@app.post("/api/v1/ingest")
def add_holdings():
    pass

def main():
    pass

if __name__ == "__main__":
    main()