import os
import jinja2
import webapp2

jinja_environment = jinja2.Environment(
    autoescape=True,
    loader=jinja2.FileSystemLoader(os.path.join(os.path.dirname(__file__), '../html')),
    extensions=['jinja2.ext.do']
    )

class HtmlHandler(webapp2.RequestHandler):
    def get(self, aName=None):
        ltemplate = self.getTemplate(aName if aName else "index")
        self.response.out.write(ltemplate.render(self.getData()))

    def getTemplate(self, aName):
        return jinja_environment.get_template("%s.html" % aName)
    
    def getData(self):
        return {}
		
# class RedirectHandler(webapp2.RequestHandler):
# 	def get(self, aName):
# 		self.redirect("/doc/%s" % aName)
