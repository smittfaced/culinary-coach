__author__ = 'Andrew'

from google.appengine.ext import ndb
from google.appengine.api import users
from pythons import models

import json
import jinja2
import webapp2
import re
import random

from google.appengine.ext.webapp import blobstore_handlers
from google.appengine.ext.blobstore import BlobInfo
from google.appengine.ext import blobstore

# Library Dependencies
JE = jinja2.Environment(
    loader=jinja2.FileSystemLoader(''),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True)

# New Profile Handler
# GET: Serves basin user information for creating a new user account
# POST: Interprets form input from new_profile.html and stores it in Datastore
class NewProfileHandler(blobstore_handlers.BlobstoreUploadHandler):
    def get(self):

        # Get User
        user = users.get_current_user()
        admin = users.is_current_user_admin()

        if models.getProfileStatus(user):
            print(user)
            student = models.getStudent(user)

            if (student == ''):

                image = models.StockImage.query(models.StockImage.name == "ccNavLogo").fetch(1)[0]
                defaultAvatar = models.getServingURL(image.image, "", True)

                template_values = {
                    'user_email': user.email(),
                    'user_ID': user.user_id(),
                    'admin': admin,
                    'profile': models.getProfileStatus(user),
                    'defaultAvatar': defaultAvatar
                }

                template = JE.get_template('templates/new_profile.html')
                self.response.write(template.render(template_values))

            else:
                self.redirect('/profile')

        else:
            self.redirect(users.create_login_url('/'))

    def post(self):

        # Get User
        user = users.get_current_user()

        # Create Student Model
        student = models.Student()

        try:
            student.userID = user.user_id()
        except Exception, e:
            print e

        # Avatar Model
        try:
            avatar = self.get_uploads('avatar-input')[0]
            student.avatar = avatar.key()
        except Exception, e:
            image = models.StockImage.query(models.StockImage.name == "ccNavLogo").fetch(1)[0]
            student.avatar = image.image
            print e

        # Name and Email Stuff
        try:
            student.nickname = self.request.get('first-name')
            student.firstname = self.request.get('first-name')
            student.lastname = self.request.get('last-name')
            student.email = user.email()
        except Exception, e:
            print e

        # Phone Stuff
        try:
            type = self.request.get_all('phone-type')
            number = self.request.get_all('phone-number')

            for index, value in enumerate(number):
                student.phone.append(models.Phone(
                    type=type[index],
                    # If Getting Rid of Hyphens
                    # number=re.sub('-', '', str(number[index]))
                    number=number[index]
                ))

        except Exception, e:
            print e

        # Address Stuff
        try:
            street = self.request.get('address-street')
            apt = self.request.get('address-apt')
            city = self.request.get('address-city')
            state = self.request.get('address-state')
            zip = int(self.request.get('address-zip'))

            student.address.append(models.Address(
                street=street,
                street2=apt,
                city=city,
                state=state,
                zip=zip
            ))

        except Exception, e:
            print e


        # Add Some Recipes for New Accounts

        recipes = models.Recipe.query()
        recipeList = recipes.fetch(limit=10)

        for recipe in recipeList:
            student.recipes.append(
                models.RecipeBrief(
                    name=recipe.name,
                    urlID=recipe.urlID
                )
            )


        # Put in Datastore and Get Key
        keyID = student.put()
        # Store urlsafe key back with entity
        student_key = keyID.get()
        # Turn Key URL Safe
        student.urlID = keyID.urlsafe()
        # Store Student Record
        student_key.put()

        self.redirect('/profile')


# Student Information Handler
# GET: Checks for Student Status and sends appropriate information or redirects to new_profile
# POST: Sends all recorded Student information gathered from Datastore
#     Type: JSON
class StudentServeHandler(webapp2.RequestHandler):
    def get(self):

        # Get User
        user = users.get_current_user()
        admin = users.is_current_user_admin()

        student = models.getStudent(user)

        if student:

            # Student has a Profile
            profile = True
            # Create Recipes List
            recipes = []
            # Get Favorite Recipes List
            favRecipes = student.favRecipes

            # PHONES
            phones = []
            types = ['home', 'cell', 'work']
            for p in student.phone:
                # Remove Existing from types list
                types = [i for i in types if i != p.type]
                # Append to phones list
                phones.append(p)

            for t in types:
                phones.append(dict(
                    type=t,
                    number=''
                ))


            # ADDRESS
            if student.address:
                address = student.address
            else:
                address = [{'type': 'home'}]


            # Loop Through Student Recipes
            for item in student.recipes:
                # Get Recipe Using Key
                recipe_key = ndb.Key(urlsafe=item.urlID)
                recipe = recipe_key.get()
                # Create Categories List
                categories = []

                # Combine Categories into List
                for cat in recipe.category:
                    categories.append(cat)


                # COOK TIME
                cook_time = dict(
                    hours=int(recipe.cook_time / 60),
                    minutes=int(recipe.cook_time % 60)
                )

                # PREP TIME
                prep_time = dict(
                    hours=int(recipe.prep_time / 60),
                    minutes=int(recipe.prep_time % 60)
                )

                # Check if Recipe is a Favorite
                if item.urlID in favRecipes:
                    # Append Recipe Dict to List
                    recipes.append(dict(name=recipe.name, description=recipe.description, urlID=recipe.urlID,
                                        avatar=models.getServingURL(blobkey=recipe.avatar, size='', shape=False),
                                        serves=recipe.serves, cookTime=cook_time, prepTime=prep_time,
                                        categories=categories, favorite=True))
                else:
                    # Append Recipe Dict to List
                    recipes.append(dict(name=recipe.name, description=recipe.description, urlID=recipe.urlID,
                                        avatar=models.getServingURL(blobkey=recipe.avatar, size='', shape=False),
                                        serves=recipe.serves, cookTime=cook_time, prepTime=prep_time,
                                        categories=categories, favorite=False))

            template_values = {
                'user': user,
                'admin': users.is_current_user_admin(),
                'profile': profile,
                'login_status': models.getLoginStatus(user),
                'uploadURL': blobstore.create_upload_url('/update_avatar'),
                'userID': student.userID,
                'urlID': student.urlID,
                'avatar': student.avatar,
                'avatar_img': models.getServingURL(student.avatar, "", False),
                'avatar_nav_img': models.getServingURL(student.avatar, 200, True),
                'date_joined': student.date.strftime('%b %d, %Y'),
                'nickname': student.nickname,
                'firstname': student.firstname,
                'lastname': student.lastname,
                'email': student.email,
                'phone': phones,
                'address': address,
                'recipes': recipes,
                'favRecipes': favRecipes,
                'theme' : student.theme
            }

            template = JE.get_template('templates/profile.html')
            self.response.write(template.render(template_values))

        else:

            self.redirect('/new_profile')

    def post(self):
        studentID = self.request.get('studentID')

        student_key = ndb.Key(urlsafe=studentID)
        student = student_key.get()

        # AVATAR
        avatar = dict(filename='No Avatar', url='img/no_image.png', urlkey='NoAvatarInBlobstore')
        try:
            img = BlobInfo.get(student.avatar)
            url = models.getServingURL(blobkey=img, size=300, shape=False)
            avatar = dict(filename=img.filename, url=url, urlkey=str(student.avatar))
        except Exception, e:
            print e

        # NICKNAME
        if student.nickname != '':
            nickname = student.nickname
        else:
            nickname = ''

        # PHONE
        phone_list = []
        for phone in student.phone:
            try:
                phone_list.append(dict(type=phone.type, number=phone.number))
            except Exception, e:
                print e

        # ADDRESS
        address_list = []
        for address in student.address:
            try:
                address_list.append(
                    dict(type=address.type, street=address.street, street2=address.street2, city=address.city,
                         state=address.state, zip=address.zip))
            except Exception, e:
                print e

        # RECIPES
        recipe_list = []
        for recipe in student.recipes:
            recipe_list.append(dict(name=recipe.name, id=recipe.urlID))

        fav_recipe_list = []
        for recipe in student.favRecipes:
            fav_recipe_list.append(recipe)

        template_values = {
            'avatar': avatar,
            'uploadURL': blobstore.create_upload_url('/update_avatar'),
            'studentID': student.userID,
            'urlID': student.urlID,
            'firstname': student.firstname,
            'lastname': student.lastname,
            'nickname': student.nickname,
            'theme' : student.theme,
            'email': student.email,
            'phone': phone_list,
            'address': address_list,
            'recipes': recipe_list,
            'favRecipes': fav_recipe_list
        }

        output = json.dumps(template_values)
        self.response.write(output)


# Student Recipe Permissions Handler
# GET:
# POST: Interprets recipe permissions from admin.html and stores it in Datastore
class StudentPermissionUpdateHandler(webapp2.RequestHandler):
    def post(self):

        parsedJSON = json.loads(self.request.get('data'))

        try:
            # Parse StudentID
            student_key = ndb.Key(urlsafe=parsedJSON['studentID'])
            student = student_key.get()

            try:
                # Clear Existing Recipes
                student.recipes = []

                # Add Recipes
                for recipe in parsedJSON['recipes']:
                    student.recipes.append(
                        models.RecipeBrief(
                            name=recipe['name'],
                            urlID=recipe['urlID']
                        )
                    )

                # Save Student Favorites
                student.put()

            except Exception, e:
                print(e)

        except Exception, e:
            print(e)


# Student Favorite Recipes Handler
# GET:
# POST: Interprets favorite recipes from profile.html and stores it in Datastore
class UpdateFavoriteRecipesHandler(webapp2.RequestHandler):
    def post(self):

        parsedJSON = json.loads(self.request.get('data'))

        try:
            # Parse StudentID
            student_key = ndb.Key(urlsafe=parsedJSON['studentID'])
            student = student_key.get()

            try:
                # Clear Existing Favorites
                student.favRecipes = []

                # Add Favorite Recipes
                for recipe in parsedJSON['recipes']:
                    student.favRecipes.append(recipe)

                # Save Student Favorites
                student.put()

            except Exception, e:
                print(e)

        except Exception, e:
            print(e)


# Student Favorite Recipes Handler
# GET:
# POST: Interprets favorite recipes from profile.html and stores it in Datastore
class UpdateFavoriteRecipeHandler(webapp2.RequestHandler):
    def post(self):

        parsedJSON = json.loads(self.request.get('data'))

        try:
            # Parse StudentID
            student_key = ndb.Key(urlsafe=parsedJSON['studentID'])
            student = student_key.get()

            recipeID = parsedJSON['recipeID']
            try:
                if recipeID in student.favRecipes:
                    student.favRecipes.remove(recipeID)
                else:
                    student.favRecipes.append(recipeID)

                # Save Student Favorites
                student.put()

            except Exception, e:
                print(e)

        except Exception, e:
            print(e)


# Student Nickname Update Handler
# GET:
# POST: Interprets nickname update from profile.html and stores it in Datastore
class UpdateNicknameHandler(webapp2.RequestHandler):
    def post(self):
        parsedJSON = json.loads(self.request.get('data'))

        try:
            # Parse StudentID
            student_key = ndb.Key(urlsafe=parsedJSON['studentID'])
            student = student_key.get()

            student.nickname = parsedJSON['nickname']
            student.put()

        except Exception, e:
            print(e)

# Student Theme Update Handler
# GET:
# POST: Interprets theme update from profile.html and stores it in Datastore
class UpdateThemeHandler(webapp2.RequestHandler):
    def post(self):
        parsedJSON = json.loads(self.request.get('data'))

        try:
            # Parse StudentID
            student_key = ndb.Key(urlsafe=parsedJSON['studentID'])
            student = student_key.get()

            student.theme = parsedJSON['theme']
            student.put()

        except Exception, e:
            print(e)



# Student Phone Update Handler
# GET:
# POST: Interprets phone update from profile.html and stores it in Datastore
class UpdatePhoneHandler(webapp2.RequestHandler):
    def post(self):
        parsedJSON = json.loads(self.request.get('data'))  # Parse StudentID

        student_key = ndb.Key(urlsafe=parsedJSON['studentID'])
        student = student_key.get()

        student.phone = [i for i in student.phone if i.type != parsedJSON['type']]

        if parsedJSON['command'] != 'delete':
            student.phone.append(models.Phone(
                type=parsedJSON['type'],
                number=parsedJSON['number']
            ))

        student.put()


# Student Address Update Handler
# GET:
# POST: Interprets address update from profile.html and stores it in Datastore
class UpdateAddressHandler(webapp2.RequestHandler):
    def post(self):
        parsedJSON = json.loads(self.request.get('data'))

        try:
            # Parse StudentID
            student_key = ndb.Key(urlsafe=parsedJSON['studentID'])
            print(student_key)
            student = student_key.get()

            student.address = [i for i in student.address if i.type != parsedJSON['type']]

            if parsedJSON['command'] != 'delete':
                student.address.append(models.Address(
                    type=parsedJSON['type'],
                    street=parsedJSON['street'],
                    street2=parsedJSON['street2'],
                    city=parsedJSON['city'],
                    state=parsedJSON['state'],
                    zip=int(parsedJSON['zip'])
                ))

            student.put()

        except Exception, e:
            print (e)


# Student Recipe Notes Update Handler
# GET:
# POST: Interprets recipe notes update from recipe.html and stores it in Datastore
class UpdateRecipeNotesHandler(webapp2.RequestHandler):
    def post(self):
        parsedJSON = json.loads(self.request.get('data'))
        try:
            # Parse StudentID
            student_key = ndb.Key(urlsafe=parsedJSON['studentID'])
            student = student_key.get()

            if parsedJSON['purpose'] == 'delete':
                for note in list(student.recipeNotes):
                    if (note.urlID == parsedJSON['recipeID']):
                        if (note.note == parsedJSON['note']):
                            student.recipeNotes.remove(note)
            else:
                student.recipeNotes.append(models.RecipeNote(
                    urlID=parsedJSON['recipeID'],
                    note=parsedJSON['note']
                ))

            student.put()

        except Exception, e:
            print (e)


# Student Avatar Update Handler
# GET:
# POST: Interprets avatar update from profile.html and stores it in Datastore
class UpdateAvatarHandler(blobstore_handlers.BlobstoreUploadHandler):
    def post(self):
        try:
            # Parse Student Favorite Recipes
            studentID = self.request.get('studentID')

            # Retrieve Student
            student_key = ndb.Key(urlsafe=studentID)
            student = student_key.get()

            # Get New Avatar
            avatar = self.get_uploads('avatar-input')[0]
            old_avatar = student.avatar
            safe = False

            # Save New Avatar
            try:
                student.avatar = avatar.key()
                student.put()
                safe = True

            except Exception, e:
                print e

            # Checking to See if Avatar was Never Uploaded Before
            try:
                CCLogo = models.StockImage.query(models.StockImage.image == old_avatar).fetch(1)[0]
                if (CCLogo):
                    safe = False
                else:
                    safe = True
            except Exception, e:
                print e

            # Delete Old Avatar
            if (safe):
                BlobInfo.get(BlobInfo.get(old_avatar).key()).delete()

            self.redirect('/profile')

        except Exception, e:
            print e

        self.redirect('/profile')


# Blobstore Upload URL Retriever Handler
# GET:
# POST: Processes Request for Blobstore Upload URL and return a valid JSON response
#       Containing a new BlobstoreUploadURL with 10 minute timeout
class BlobUploadURLServeHandler(webapp2.RequestHandler):
    def post(self):
        # Get JSON Data
        parsedJSON = json.loads(self.request.get('data'))

        # Get URL for Upload Request
        url = parsedJSON['url']

        # Create Upload URL
        uploadURL = blobstore.create_upload_url(url)

        # Create JSON Response
        response = {
            'url': uploadURL
        }

        # Output Response
        self.response.write(json.dumps(response))
