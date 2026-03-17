from app import app
from waitress import serve

if __name__ == '__main__':
    #app.run(debug=True, host='0.0.0.0')
 
    #Use waitress to serve endpoint for better stability
    serve(app, host='0.0.0.0', port=5000)

