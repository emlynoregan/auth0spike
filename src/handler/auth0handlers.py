'''
Created on 14Sep.,2016

@author: emlyn
'''
from google.appengine.api import urlfetch
import json
from webapp2_extras import sessions
import webapp2
from handler.htmlhandler import HtmlHandler
import logging
import urllib

class SessionHandlerBase(HtmlHandler):
    def dispatch(self):
    
        self.session_store = sessions.get_store(request=self.request)
    
        try:
            webapp2.RequestHandler.dispatch(self)
        finally:
            self.session_store.save_sessions(self.response)

    @webapp2.cached_property
    def session(self):
        return self.session_store.get_session()#(backend="<whatever you want here>")

class IndexHandler(SessionHandlerBase):
    def getData(self):
        return {"user": self.session.get("profile")}

class LogoutHandler(SessionHandlerBase):
    def get(self):
        self.dologout()

    def post(self):
        self.dologout()
        
    def dologout(self):
        self.session['profile'] = None
        largs = { 'returnTo' : 'https://auth0spike.appspot.com' }
        lencodedArgs = urllib.urlencode(largs) 
       
        self.redirect("https://emlyntest.au.auth0.com/v2/logout?%s" % lencodedArgs)
#         self.redirect("https://emlyntest.au.auth0.com/v2/logout?returnTo=https://auth0spike.appspot.com")

class Auth0CallbackHandler(SessionHandlerBase):
    @classmethod
    def JsonSchemaRequired(cls):
        return False

    def get(self):
        self.docallback()

    def post(self):
        self.docallback()
      
    def docallback(self):
        lcode = self.request.get("code")
        
        if lcode:
            ljsonHeader = {'content-type': 'application/json'}
            
            ltokenUrl = "https://{domain}/oauth/token".format(domain='emlyntest.au.auth0.com')
    
            ltokenPayload = {
              'client_id':     'mZfw4InBCmfhwYd6DGcSc0W49nJxXiIv',
              'client_secret': 'h6q4Fsb6it53SlF4k5kGZffGqgSaT7ZcMIGk-GQQAQ27TunuISG4LKM4RhQUdeHk',
              'redirect_uri':  'https://auth0spike.appspot.com',
              'code':          lcode,
              'grant_type':    'authorization_code'
            }
            
    
            def ParseResponse(aResponse):
                if aResponse.status_code < 200 or aResponse.status_code >= 300:
                    raise Exception("Bad response (%s): %s" % (aResponse.status_code, aResponse.content))
                return json.loads(aResponse.content)
    
            ltokenResponse = urlfetch.fetch(ltokenUrl, json.dumps(ltokenPayload), "POST", ljsonHeader)        
            ltokenInfo = ParseResponse(ltokenResponse)
            logging.debug("tokeninfo: %s" % ltokenInfo)
            
            luserUrl = "https://{domain}/userinfo?access_token={access_token}" \
                .format(domain='emlyntest.au.auth0.com', access_token=ltokenInfo.get('access_token'))
    
            luserResponse = urlfetch.fetch(luserUrl)        
            luserInfo = ParseResponse(luserResponse)
            logging.debug("userinfo: %s" % luserInfo)
            
            # We're saving all user information into the session
            self.session['profile'] = luserInfo
            
        return self.redirect('/')

