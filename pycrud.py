from flask import Flask, render_template
from flask.ext.login import LoginManager,  UserMixin
from flask.ext.browserid import BrowserID

class User(UserMixin):
    def __init__(self, id):
        self.id = id

def get_user_by_id(id):
    return User(id)

def get_user(browser_id):
    return get_user_by_id(browser_id['email'])

app = Flask(__name__)
app.secret_key = 'sad;fui2vn ;IG[ VP4RIT '

login_manager = LoginManager()
login_manager.user_loader(get_user_by_id)
login_manager.init_app(app)

browser_id = BrowserID()
browser_id.user_loader(get_user)
browser_id.init_app(app)

@app.route('/')
def hello_world():
    return render_template('index.html')
if __name__ == '__main__':
    app.run(debug=True)
