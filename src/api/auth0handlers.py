'''
Created on 14Sep.,2016

@author: emlyn
'''
from apibase import APIBase
from google.appengine.api import urlfetch
import json
from webapp2_extras import sessions
import webapp2

class Auth0CallbackHandler(APIBase):
    def dispatch(self):
    
        self.session_store = sessions.get_store(request=self.request)
    
        try:
            webapp2.RequestHandler.dispatch(self)
        finally:
            self.session_store.save_sessions(self.response)

    @webapp2.cached_property
    def session(self):
        return self.session_store.get_session()#(backend="<whatever you want here>")

    @classmethod
    def JsonSchemaRequired(cls):
        return False

    def ProcessAPICall(self, aQueryJson, aUser):
        lcode = self.request.get("code")
        
        ljsonHeader = {'content-type': 'application/json'}
        
        ltokenUrl = "https://{domain}/oauth/token".format(domain='emlyntest.au.auth0.com')

        ltokenPayload = {
          'client_id':     'mZfw4InBCmfhwYd6DGcSc0W49nJxXiIv',
          'client_secret': 'h6q4Fsb6it53SlF4k5kGZffGqgSaT7ZcMIGk-GQQAQ27TunuISG4LKM4RhQUdeHk',
          'redirect_uri':  'http://YOUR_APP/callback',
          'code':          lcode,
          'grant_type':    'authorization_code'
        }
        

        ltokenInfo = urlfetch.fetch(ltokenUrl, json.dumps(ltokenPayload), "POST", ljsonHeader)        
        
        luserUrl = "https://{domain}/userinfo?access_token={access_token}" \
            .format(domain='emlyntest.au.auth0.com', access_token=ltokenInfo.get('access_token'))

        luserInfo = urlfetch.fetch(luserUrl)        
        
        # We're saving all user information into the session
        self.session['profile'] = luserInfo
        
        # Redirect to the User logged in page that you want here
        # In our case it's /dashboard
        return self.redirect('/')

    @classmethod
    def GetAPIPath(cls):
        return "/api/auth0callback"

# Here we're using the /callback route.
@app.route('/callback')
def callback_handling():
  env = os.environ
  code = request.args.get('code')

  json_header = {'content-type': 'application/json'}

  token_url = "https://{domain}/oauth/token".format(domain='emlyntest.au.auth0.com')

  token_payload = {
    'client_id':     'mZfw4InBCmfhwYd6DGcSc0W49nJxXiIv',
    'client_secret': 'h6q4Fsb6it53SlF4k5kGZffGqgSaT7ZcMIGk-GQQAQ27TunuISG4LKM4RhQUdeHk',
    'redirect_uri':  'http://YOUR_APP/callback',
    'code':          code,
    'grant_type':    'authorization_code'
  }

  token_info = requests.post(token_url, data=json.dumps(token_payload), headers = json_header).json()

  user_url = "https://{domain}/userinfo?access_token={access_token}" \
      .format(domain='emlyntest.au.auth0.com', access_token=token_info['access_token'])

  user_info = requests.get(user_url).json()

  # We're saving all user information into the session
  session['profile'] = user_info

  # Redirect to the User logged in page that you want here
  # In our case it's /dashboard
  return redirect('/dashboard')
  