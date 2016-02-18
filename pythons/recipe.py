from google.appengine.ext import ndb

__author__ = 'Andrew'

from pythons import models
from fractions import Fraction
from decimal import Decimal
import random

import json
import jinja2
import quopri

import webapp2

from google.appengine.api import users
from google.appengine.ext.webapp import blobstore_handlers
from google.appengine.ext.blobstore import BlobInfo

# Library Dependencies
JE = jinja2.Environment(
    loader=jinja2.FileSystemLoader(''),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True)


class RecipeUploadHandler(blobstore_handlers.BlobstoreUploadHandler):
    def post(self):
        try:
            # Create Recipe Model
            recipe_key = models.Recipe()

            # Avatar Model
            try:
                avi = self.get_uploads('avatar_file')
                recipe_key.avatar = avi[0].key()
            except Exception, e:
                print e

            # Images Model
            try:
                sm_images = self.get_uploads('sm_image')
                for image in sm_images:
                    recipe_key.img.append(image.key())
            except Exception, e:
                print e

            # Getting all the Directions
            try:
                directions = self.request.get_all('direction')
                for step in directions:
                    direction = models.Direction(
                        instruction=quopri.decodestring(step)
                    )
                    recipe_key.directions.append(direction)
            except Exception, e:
                print e

            # Getting all the Ingredient Parts
            ingr_amount = self.request.get_all('amount')
            ingr_unit = self.request.get_all('unit')
            ingr_name = self.request.get_all('name')
            ingr_note = self.request.get_all('note')

            try:
                for val, ingr in enumerate(ingr_amount):
                    try:
                        amt = float(ingr_amount[val])
                    except:
                        amt = 0
                    ingredient = models.Ingredient(
                        amount=amt,
                        unit=ingr_unit[val],
                        name=ingr_name[val],
                        note=ingr_note[val]
                    )
                    recipe_key.ingredients.append(ingredient)
            except Exception, e:
                print e

            # Getting all the Utility Parts
            util_name = self.request.get_all('util_name')
            util_function = self.request.get_all('util_function')
            util_link = self.request.get_all('util_url')

            try:
                for val, util in enumerate(util_name):
                    utility = models.Utility(
                        name=util_name[val],
                        function=util_function[val],
                        link=util_link[val]
                    )
                    recipe_key.utilities.append(utility)
            except Exception, e:
                print e

            # Get Category Info
            try:
                category_string = self.request.get('add_category')
                categories = category_string.split(',')
                for val in categories:
                    if (val != ''):
                        recipe_key.category.append(val)
            except Exception, e:
                print e

            # Adding the remaining Recipe parts
            recipe_key.prep_time = float(self.request.get('prep_time'))
            recipe_key.cook_time = float(self.request.get('cook_time'))
            recipe_key.serves = int(self.request.get('serves'))
            recipe_key.name = self.request.get('recipe_name')
            recipe_key.sm_description = self.request.get('short_description')
            recipe_key.description = quopri.decodestring(self.request.get('full_description'))
            # https://code.google.com/p/googleappengine/issues/detail?id=2749

            # Put in Datastore and Get Key
            keyID = recipe_key.put()
            # Store urlsafe key back with entity
            recipe = keyID.get()
            # Turn Key URL Safe
            recipe.urlID = keyID.urlsafe()
            recipe.put()

            self.redirect('/admin')

        except Exception, e:
            print(e)
            self.redirect('/admin')


class RecipeUpdateHandler(blobstore_handlers.BlobstoreUploadHandler):
    def post(self):
        try:
            recipeID = self.request.get('recipe_id')
            print("rID: " + recipeID)

            recipe = ndb.Key(urlsafe=recipeID)
            recipe_key = recipe.get()

            # Image Elements
            recipe_key.img = []
            deletable = []

            # Get Deletable Elements
            try:
                removedImages = self.request.get('removed_images')
                images = removedImages.split(',')
                for image in images:
                    if image != '':
                        print('Deletable: ' + image)
                        deletable.append(BlobInfo.get(image).key())

            except Exception, e:
                print e

            # Avatar Model
            try:
                avi = self.get_uploads('avatar_file')
                recipe_key.avatar = avi[0].key()
                try:
                    oldAvi = self.request.get('existing_avatar')
                    recipe_key.img.append(BlobInfo.get(oldAvi).key())
                except Exception, e:
                    print(e)

            except Exception, e:
                print('No new Avatar Image Uploaded')
                # Existing Avatar Model
                try:
                    aviKey = self.request.get_all('existing_avatar')
                    recipe_key.avatar = BlobInfo.get(aviKey[0]).key()
                except Exception, e:
                    # Pull old avatar that was deleted out of the trash
                    if recipe_key.avatar in deletable:
                        deletable.remove(recipe_key.avatar)
                    print('No Existing Image Chosen as Avatar. Keeping Same Avatar')

            # Existing Images Model
            try:
                urlKeys = self.request.get_all('existing_img')
                for keye in urlKeys:
                    recipe_key.img.append(BlobInfo.get(keye).key())
            except Exception, e:
                print e

            # New Images
            try:
                sm_images = self.get_uploads('sm_image')
                for image in sm_images:
                    recipe_key.img.append(image.key())
            except Exception, e:
                print e

            # Process Deletable
            try:
                for delete in deletable:
                    BlobInfo.get(delete).delete()
            except Exception, e:
                print e


            # Getting all the Directions
            print("Getting Directions")
            try:
                recipe_key.directions = []
                directions = self.request.get_all('direction')
                for step in directions:
                    direction = models.Direction(
                        instruction=quopri.decodestring(step)
                    )
                    recipe_key.directions.append(direction)
            except Exception, e:
                print e

            # Getting all the Ingredient Parts
            ingr_amount = self.request.get_all('amount')
            ingr_unit = self.request.get_all('unit')
            ingr_name = self.request.get_all('name')
            ingr_note = self.request.get_all('note')

            try:
                recipe_key.ingredients = []
                for val, ingr in enumerate(ingr_amount):
                    ingredient = models.Ingredient(
                        amount=float(ingr_amount[val]),
                        unit=ingr_unit[val],
                        name=ingr_name[val],
                        note=ingr_note[val]
                    )
                    recipe_key.ingredients.append(ingredient)
            except Exception, e:
                print e

            # Getting all the Utility Parts
            util_name = self.request.get_all('util_name')
            util_function = self.request.get_all('util_function')
            util_link = self.request.get_all('util_url')

            try:
                recipe_key.utilities = []
                for val, util in enumerate(util_name):
                    utility = models.Utility(
                        name=util_name[val],
                        function=util_function[val],
                        link=util_link[val]
                    )
                    recipe_key.utilities.append(utility)
            except Exception, e:
                print e

            # Get Category Info
            try:
                recipe_key.category = []
                category_string = self.request.get('add_category')
                categories = category_string.split(',')
                for val in categories:
                    if (val != ''):
                        recipe_key.category.append(val)
            except Exception, e:
                print e

            # Adding the remaining Recipe parts
            recipe_key.prep_time = float(self.request.get('prep_time'))
            recipe_key.cook_time = float(self.request.get('cook_time'))
            recipe_key.serves = int(self.request.get('serves'))
            recipe_key.name = self.request.get('recipe_name')
            recipe_key.description = quopri.decodestring(self.request.get('full_description'))

            # Put in Datastore and Get Key
            keyID = recipe_key.put()

            self.redirect('/admin')

        except Exception, e:
            print(e)
            self.redirect('/admin')


class RecipeServeHandler(webapp2.RequestHandler):
    def post(self):
        recipeID = self.request.get('recipeID')
        print(recipeID)

        recipe_key = ndb.Key(urlsafe=recipeID)
        recipe = recipe_key.get()

        # IMAGES
        image_list = []
        for image in recipe.img:
            try:
                img = BlobInfo.get(image)
                url = models.getServingURL(blobkey=img, size=200, shape=False)
                image_list.append(dict(filename=img.filename, url=url, urlkey=str(image)))
            except Exception, e:
                print e

        # AVATAR
        avatar = dict(filename='No Avatar', url='img/no_image.png', urlkey='NoAvatarInBlobstore')
        try:
            img = BlobInfo.get(recipe.avatar)
            url = models.getServingURL(blobkey=img, size=200, shape=False)
            avatar = dict(filename=img.filename, url=url, urlkey=str(recipe.avatar))
        except Exception, e:
            print e

        # INGREDIENTS
        ingredient_list = []
        for ingredient in recipe.ingredients:
            ingr = dict(amount=ingredient.amount, unit=ingredient.unit, name=ingredient.name, note=ingredient.note)
            ingredient_list.append(ingr)


        # DIRECTIONS
        directions_list = []
        for direction in recipe.directions:
            instr = dict(instruction=direction.instruction)
            directions_list.append(instr)


        # UTILITIES
        utilities_list = []
        for utility in recipe.utilities:
            util = dict(name=utility.name, function=utility.function, link=utility.link)
            utilities_list.append(util)

        # CATEGORIES
        categories_list = []
        for category in recipe.category:
            categories_list.append(category)

        template_values = {
            'name': recipe.name,
            'date': recipe.date.isoformat(),
            'category': categories_list,
            'description': recipe.description,
            'prep_time': recipe.prep_time,
            'cook_time': recipe.cook_time,
            'serves': recipe.serves,
            'img': image_list,
            'avatar': avatar,
            'directions': directions_list,
            'ingredients': ingredient_list,
            'utilities': utilities_list,
            'urlID': recipe.urlID
        }

        output = json.dumps(template_values)
        self.response.write(output)


class ShowRecipeHandler(webapp2.RequestHandler):
    def post(self):

        # Recipe Stuff
        #
        recipeID = self.request.get('recipeID')

        recipe_key = ndb.Key(urlsafe=recipeID)
        recipe = recipe_key.get()

        # IMAGES
        image_list = []
        for image in recipe.img:
            try:
                img = BlobInfo.get(image)
                url = models.getServingURL(blobkey=img, size=200, shape=False)
                image_list.append(dict(filename=img.filename, url=url, urlkey=str(image)))
            except Exception, e:
                print e

        # AVATAR
        avatar = dict(filename='No Avatar', url='img/no_image.png', urlkey='NoAvatarInBlobstore')
        try:
            img = BlobInfo.get(recipe.avatar)
            url = models.getServingURL(blobkey=img, size=200, shape=False)
            avatar = dict(filename=img.filename, url=url, urlkey=str(recipe.avatar))
        except Exception, e:
            print e

        # INGREDIENTS
        ingredient_list = []
        for ingredient in recipe.ingredients:
            amount = Fraction(Decimal(ingredient.amount)).limit_denominator(100)
            if amount.denominator == 1:
                ingr = dict(amount=(amount.numerator // amount.denominator), unit=ingredient.unit,
                            name=ingredient.name, note=ingredient.note)
            else:
                if amount.numerator // amount.denominator == 0:
                    ingr = dict(amount='{}/{}'.format((amount.numerator % amount.denominator), amount.denominator),
                                unit=ingredient.unit,
                                name=ingredient.name, note=ingredient.note)
                else:
                    ingr = dict(amount='{} {}/{}'.format((amount.numerator // amount.denominator),
                                                         (amount.numerator % amount.denominator), amount.denominator),
                                unit=ingredient.unit,
                                name=ingredient.name, note=ingredient.note)
            ingredient_list.append(ingr)


        # DIRECTIONS
        directions_list = []
        for direction in recipe.directions:
            instr = dict(instruction=direction.instruction)
            directions_list.append(instr)


        # UTILITIES
        utilities_list = []
        for utility in recipe.utilities:
            util = dict(name=utility.name, function=utility.function, link=utility.link)
            utilities_list.append(util)

        # CATEGORIES
        categories_list = []
        for category in recipe.category:
            categories_list.append(category)

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

        # Student Stuff
        #
        studentID = self.request.get('studentID')

        student_key = ndb.Key(urlsafe=studentID)
        student = student_key.get()

        recipeNotes = []
        for note in student.recipeNotes:
            if note.urlID == recipeID:
                recipeNotes.append(note)

        favorite = False
        if recipeID in student.favRecipes:
            favorite = True

        template_values = {
            # Recipe Stuff
            'name': recipe.name,
            'date': recipe.date.isoformat(),
            'category': categories_list,
            'description': recipe.description,
            'prep_time': prep_time,
            'cook_time': cook_time,
            'serves': recipe.serves,
            'img': image_list,
            'avatar': avatar,
            'directions': directions_list,
            'ingredients': ingredient_list,
            'utilities': utilities_list,
            'urlID': recipe.urlID,
            # Student Stuff
            'studentID': studentID,
            'theme' : student.theme,
            'avatar_nav_img': models.getServingURL(student.avatar, 200, True),
            'profile': True,
            'user': users.get_current_user(),
            'login_status': models.getLoginStatus(users.get_current_user()),
            'admin': users.is_current_user_admin(),
            'notes': recipeNotes,
            'favorite': favorite,
        }

        template = JE.get_template('templates/recipe.html')
        self.response.write(template.render(template_values))


class GalleryImageHandler(webapp2.RequestHandler):
    def get(self):

        recipes = models.Recipe.query()
        recipeList = recipes.fetch(limit=30)

        student = models.getStudent(users.get_current_user())

        images = []
        for recipe in recipeList:
            images.append(
                dict(
                    url=models.getServingURL(recipe.avatar, random.randint(2, 6) * 100, False)
                )
            )

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
            # Image Stuff
            'images': images,
            # Student Stuff
            'user': users.get_current_user(),
            'theme': theme,
            'avatar_nav_img': defaultAvatar,
            'profile': models.getProfileStatus(users.get_current_user()),
            'login_status': models.getLoginStatus(users.get_current_user()),
            'admin': users.is_current_user_admin()
        }

        template = JE.get_template('templates/gallery.html')
        self.response.write(template.render(template_values))
