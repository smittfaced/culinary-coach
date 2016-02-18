__author__ = 'Andrew'

import webapp2
import jinja2

from pythons import base
from pythons import models

from google.appengine.ext.webapp import blobstore_handlers
from google.appengine.ext import blobstore
from google.appengine.api import users

# Library Dependencies
JE = jinja2.Environment(
    loader=jinja2.FileSystemLoader(''),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True)


class AdminHandler(webapp2.RequestHandler):
    def get(self):

        # Get User
        user = users.get_current_user()
        admin = users.is_current_user_admin()
        login_status = models.getLoginStatus(user)

        if (admin):

            student = models.getStudent(user)
            avatar = models.getServingURL(student.avatar, 200, True)

            recipe_upload_url = blobstore.create_upload_url('/recipe_upload')
            recipe_update_url = blobstore.create_upload_url('/recipe_update')
            stock_image_upload_url = blobstore.create_upload_url('/stock_image_upload')
            allRecipes = models.Recipe.query().fetch(limit=None, projection=[models.Recipe.name, models.Recipe.urlID])
            allStudents = models.Student.query().fetch(limit=None,
                                                       projection=[models.Student.firstname, models.Student.lastname,
                                                                   models.Student.urlID])

            template_values = {
                'user': user,
                'admin': admin,
                'profile': True,
                'login_status': login_status,
                'avatar_nav_img': avatar,
                'recipe_upload_url': recipe_upload_url,
                'recipe_update_url': recipe_update_url,
                'stock_image_upload_url': stock_image_upload_url,
                'all_recipes': allRecipes,
                'all_students': allStudents
            }

            template = JE.get_template('templates/admin.html')
            self.response.write(template.render(template_values))

        else:
            self.redirect('/profile')

    def post(self):

        # Get User
        user = users.get_current_user()
        admin = users.is_current_user_admin()
        login_status = models.getLoginStatus(user)
        student = models.getStudent(user)

        if (admin):

            allRecipes = models.Recipe.query().fetch(limit=None, projection=[models.Recipe.name, models.Recipe.urlID])
            allStudents = models.Student.query().fetch(limit=None,
                                                       projection=[models.Student.firstname, models.Student.lastname,
                                                                   models.Student.urlID])

            template_values = {
                'user': user,
                'admin': admin,
                'profile': True,
                'login_status': login_status,
                'avatar_nav_img': models.getServingURL(student.avatar, 200, True),
                'all_recipes': allRecipes,
                'all_students': allStudents
            }

            template = JE.get_template('templates/admin.html')
            self.response.write(template.render(template_values))

        else:
            self.redirect('/profile')


class StockImageUploader(blobstore_handlers.BlobstoreUploadHandler):
    def post(self):
        image = self.get_uploads('stock-image')[0]
        name = self.request.get('stock-image-name')

        stockImage = models.StockImage(
            name=name,
            image=image.key()
        )

        stockImage.put()

        self.redirect('/admin')


class ContactHandler(webapp2.RequestHandler):
    def get(self):

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
            # Student Stuff
            'user': users.get_current_user(),
            'avatar_nav_img': defaultAvatar,
            'theme': theme,
            'profile': models.getProfileStatus(users.get_current_user()),
            'login_status': models.getLoginStatus(users.get_current_user()),
            'admin': users.is_current_user_admin()
        }

        template = JE.get_template('templates/contact.html')
        self.response.write(template.render(template_values))
