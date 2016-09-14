import webapp2

from handler.auth0handlers import Auth0CallbackHandler, IndexHandler,\
    LogoutHandler

_routes = [
    ('/', IndexHandler),
    ('/logout', LogoutHandler),
    ('/auth0callback', Auth0CallbackHandler)
]

def AddRoute(aApiHandler):
	_routes.append((aApiHandler.GetAPIPath(), aApiHandler))
	
#AddRoute(SelfApiHandler)

config = {}
config['webapp2_extras.sessions'] = {
    'secret_key': 'dsfzsdfsfwaefszefzsefezsf',
}

app = webapp2.WSGIApplication(_routes, config=config, debug=True)

