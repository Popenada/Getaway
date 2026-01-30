from app import app

@app.route('/')
@app.route('/index')
def index():
    return "Hello, World!"


@app.route('/api/flight-search', methods=["GET"])
def flightSearch():
    return "hello world!"
