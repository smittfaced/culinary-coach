__author__ = 'Andrew'

import webapp2
import jinja2

from google.appengine.api import users

import models

# Library Dependencies
JE = jinja2.Environment(
    loader=jinja2.FileSystemLoader(''),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True)


class LandingHandler(webapp2.RequestHandler):
    def get(self):

        # Get User
        user = users.get_current_user()
        student = models.getStudent(users.get_current_user())

        stock = models.StockImage.query(models.StockImage.name == "ccNavLogo").fetch(1)[0]
        defaultAvatar = models.getServingURL(stock.image, "", True)
        try:
            defaultAvatar = models.getServingURL(student.avatar, 200, True)
        except Exception, e:
            print e

        theme = 'light'
        try:
            theme = student.theme
        except Exception, e:
            print e

        template_values = {
            'user': user,
            'defaultAvatar': defaultAvatar,
            'theme': theme,
            'admin': users.is_current_user_admin(),
            'profile': models.getProfileStatus(user),
            'login_status': models.getLoginStatus(user)
        }

        template = JE.get_template('templates/base.html')
        self.response.write(template.render(template_values))
